// Camada 3D do hero e de Estilos (three.js). Esta é a FONTE; o site carrega js/imersivo.min.js
// (como gerar: README, "Camada 3D"). Melhoria progressiva: qualquer falha deixa o CSS como está.
//
// Cada [data-cena] ganha um canvas absoluto (z-index 2) com o cartão da foto em perspectiva e um
// fundo de screentone em duas profundidades. O canvas rola junto com o DOM, então não há defasagem
// de scroll. A foto só inclina e brilha: nunca é deformada.
import {
  WebGLRenderer, PerspectiveCamera, Scene, Group, Mesh, PlaneGeometry, MeshBasicMaterial,
  ShaderMaterial, Texture, Color, Vector2, Vector4, SRGBColorSpace, LinearMipmapLinearFilter,
} from 'three';

const FOV = 30;
const toque = matchMedia('(pointer: coarse)').matches;
const DPR = Math.min(devicePixelRatio || 1, toque ? 1.5 : 2);
const trava = (v, a, b) => Math.min(b, Math.max(a, v));

// Os tokens do site são oklch e o three não lê oklch: o canvas 2D converte qualquer cor CSS.
const c2d = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
function cor(css) {
  c2d.clearRect(0, 0, 1, 1);
  c2d.fillStyle = css || 'transparent';
  c2d.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = c2d.getImageData(0, 0, 1, 1).data;
  return { cor: new Color().setRGB(r / 255, g / 255, b / 255, SRGBColorSpace), a: a / 255 };
}

const VERT_FUNDO = `
  varying vec2 vP;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vP = w.xy;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;
// Meio-tom de mangá a 45°: os pontos crescem perto da foto (halo) e perto do ponteiro.
const FRAG_FUNDO = `
  uniform vec3 uCor; uniform float uAlfa, uG, uR, uK, uF; uniform vec2 uC, uM, uS; uniform vec4 uT;
  varying vec2 vP;
  void main() {
    vec2 q = mat2(0.7071, 0.7071, -0.7071, 0.7071) * vP / uG;
    float d = length(fract(q) - 0.5);
    float dist = length((vP - uC) / vec2(uR, uR * 1.25));
    float m = 1.0 - smoothstep(0.15, 1.2, dist);
    m += 0.3 * (1.0 - smoothstep(0.0, 1.0, length(vP - uM) / (uR * 0.5)));
    m *= 0.88 + 0.12 * sin(dist * 5.0 + uK);
    float r = 0.3 * clamp(m, 0.0, 1.0);
    vec2 borda = 1.0 - smoothstep(0.7, 1.0, abs(vP) / uS);   // dissolve nas bordas da cena: sem corte seco
    // uT = retângulo da palavra da cena (x0,y0,x1,y1): sem pontos sobre as letras, borda suave de uF
    vec2 fora = max(uT.xy - vP, vP - uT.zw);
    float texto = smoothstep(0.0, uF, max(fora.x, fora.y));
    float a = (1.0 - smoothstep(r - fwidth(d), r, d)) * step(0.02, r) * uAlfa * borda.x * borda.y * texto;
    gl_FragColor = vec4(uCor, a);
    #include <colorspace_fragment>
  }`;
const VERT_BRILHO = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
// Faixa diagonal suave, como luz passando por papel brilhante.
const FRAG_BRILHO = `
  uniform float uPos, uAlfa; varying vec2 vUv;
  void main() {
    float b = 1.0 - smoothstep(0.0, 0.22, abs(vUv.x * 0.75 + (1.0 - vUv.y) * 0.25 - uPos));
    gl_FragColor = vec4(1.0, 1.0, 1.0, b * b * uAlfa);
    #include <colorspace_fragment>
  }`;

const cenas = new Set();
const ponteiro = { x: 0, y: 0, cx: 0, cy: 0, ativo: false };
let raf = 0, ultimo = 0;

function tick(t) {
  raf = 0;
  const dt = Math.min(0.05, (t - ultimo) / 1000) || 0.016;
  ultimo = t;
  let vivo = false;
  for (const c of cenas) if (c.visivel) { vivo = true; c.passo(dt); }
  if (vivo) raf = requestAnimationFrame(tick);
}
function acordar() {
  if (!raf) { ultimo = performance.now(); raf = requestAnimationFrame(tick); }
}

class Cena {
  constructor(el, i) {
    this.el = el;
    this.fig = el.querySelector('[data-foto]');
    this.img = this.fig.querySelector('img');
    this.hero = el.dataset.cena === 'hero';
    this.palavra = el.querySelector('.estilo__word');   // só Estilos: o screentone desvia das letras
    this.dir = i % 2 ? -1 : 1;           // linhas alternadas inclinam para lados opostos
    this.px = this.py = this.sc = this.exit = 0;
    this.visivel = false; this.sujo = true;
  }

  async iniciar() {
    const { img } = this;
    img.loading = 'eager';               // a textura sai do próprio <img>: sem download extra
    if (!img.complete || !img.naturalWidth) {
      await new Promise((ok, erro) => { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', erro, { once: true }); });
    }
    // Pixels reais: img.naturalWidth de um <img> com srcset é a largura corrigida pela densidade
    // (menor que o arquivo). Uma <img> sem srcset (mesma URL, já em cache) devolve o tamanho verdadeiro.
    this.raw = new Image();
    this.raw.src = img.currentSrc || img.src;
    await this.raw.decode();
    this.montar();
    this.medir();
    this.passo(0, true);                 // 1º frame desenhado ANTES de assumir o lugar do DOM
    this.el.classList.add('gl');
    cenas.add(this);
    this.obs = [
      new IntersectionObserver(([e]) => { this.visivel = e.isIntersecting; if (this.visivel) acordar(); }, { rootMargin: '10% 0px' }),
      new ResizeObserver(() => { this.medir(); this.sujo = true; acordar(); }),
    ];
    this.obs[0].observe(this.el);
    this.obs[1].observe(this.el); this.obs[1].observe(this.fig);
  }

  montar() {
    const cs = getComputedStyle(this.fig);
    const lerVar = (n) => cs.getPropertyValue(n).trim();
    const canvas = this.canvas = document.createElement('canvas');
    canvas.className = 'cena__canvas';
    canvas.setAttribute('aria-hidden', 'true');
    this.el.append(canvas);
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.desmontar(); });

    const r = this.r = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    r.setPixelRatio(DPR);
    r.setClearColor(0x000000, 0);
    this.cena = new Scene();
    this.cam = new PerspectiveCamera(FOV, 1, 1, 10);

    // painter's algorithm: tudo transparente, sem depth, a ordem vem do renderOrder
    const plano = new PlaneGeometry(1, 1);
    const opts = { transparent: true, depthTest: false, depthWrite: false };
    const malha = (material, ordem) => Object.assign(new Mesh(plano, material), { renderOrder: ordem });

    this.bw = parseFloat(lerVar('--cartao-bw')) || 0;
    this.desl = parseFloat(lerVar('--cartao-desloc')) || 0;
    const borda = cor(lerVar('--cartao-borda')), sombra = cor(lerVar('--cartao-sombra'));
    // Não usar o <img> direto: img.width devolve a largura renderizada em CSS, o three aloca a textura
    // com ela e a imagem maior não cabe. Um canvas de tamanho natural tem as dimensões certas.
    const { naturalWidth: pw, naturalHeight: ph } = this.raw;
    const pix = Object.assign(document.createElement('canvas'), { width: pw, height: ph });
    pix.getContext('2d').drawImage(this.raw, 0, 0);
    canvas.dataset.textura = `${pw}x${ph}`;   // resolução real da textura (os testes conferem)
    const tex = new Texture(pix);
    tex.colorSpace = SRGBColorSpace;
    tex.minFilter = LinearMipmapLinearFilter;
    tex.anisotropy = Math.min(8, r.capabilities.getMaxAnisotropy());
    tex.onUpdate = () => { pix.width = pix.height = 1; };   // já está na GPU: libera a cópia em RAM
    tex.needsUpdate = true;

    this.sombra = malha(new MeshBasicMaterial({ ...opts, color: sombra.cor, opacity: sombra.a }), 2);
    this.sombra.visible = sombra.a > 0 && this.desl > 0;
    this.moldura = malha(new MeshBasicMaterial({ ...opts, color: borda.cor, opacity: borda.a }), 3);
    this.moldura.visible = this.bw > 0 && borda.a > 0;
    this.foto = malha(new MeshBasicMaterial({ ...opts, map: tex }), 4);
    this.brilho = malha(new ShaderMaterial({ ...opts, vertexShader: VERT_BRILHO, fragmentShader: FRAG_BRILHO, uniforms: { uPos: { value: 0.5 }, uAlfa: { value: 0.16 } } }), 5);

    // inclina = perspectiva (ponteiro e scroll); rola = o rotate do CSS, que gira no sentido horário
    this.inclina = new Group();
    const rola = new Group();
    rola.rotation.z = -(parseFloat(cs.rotate) || 0) * Math.PI / 180;
    rola.add(this.sombra, this.moldura, this.foto, this.brilho);
    this.inclina.add(rola);
    this.cena.add(this.inclina);

    // screentone: pontos na cor do texto da cena (tinta no papel, papel na tinta), 2 profundidades
    const ponto = cor(getComputedStyle(this.el).color).cor;
    this.fundos = [[220, 0.2, 10, 0], [80, 0.16, 22, 1]].map(([d, alfa, g, ordem]) => {
      const m = malha(new ShaderMaterial({
        ...opts, vertexShader: VERT_FUNDO, fragmentShader: FRAG_FUNDO,
        uniforms: { uCor: { value: ponto }, uAlfa: { value: alfa }, uG: { value: 1 }, uR: { value: 1 }, uK: { value: 0 }, uF: { value: 1 }, uC: { value: new Vector2() }, uM: { value: new Vector2(1e5, 1e5) }, uS: { value: new Vector2(1, 1) }, uT: { value: new Vector4(1e5, 1e5, 1e5 + 1, 1e5 + 1) } },
      }), ordem);
      m.userData = { d, g };
      this.cena.add(m);
      return m;
    });
  }

  // 1 unidade = 1 px CSS no plano z=0: o cartão cai exatamente onde o <figure> está no layout
  medir() {
    const { el, fig, r, cam } = this;
    const W = this.W = el.clientWidth, H = this.H = el.clientHeight;
    if (!W || !H) return;
    r.setSize(W, H, false);
    const zc = this.zc = (H / 2) / Math.tan(FOV * Math.PI / 360);
    cam.aspect = W / H; cam.near = zc * 0.5; cam.far = zc + 1000;
    cam.updateProjectionMatrix();

    // offset* ignora transform: não depende da animação CSS do figure
    const fw = fig.offsetWidth, fh = fig.offsetHeight, { bw, desl } = this;
    this.cx = fig.offsetLeft + fw / 2 - W / 2;
    this.cy = -(fig.offsetTop + fh / 2 - H / 2);
    this.sombra.scale.set(fw, fh, 1); this.sombra.position.set(desl, -desl, 0);
    this.moldura.scale.set(fw, fh, 1);
    this.foto.scale.set(fw - 2 * bw, fh - 2 * bw, 1);
    this.brilho.scale.copy(this.foto.scale);
    // retângulo da palavra (com folga p/ o parallax de ±2vw e o respiro vertical), em coords do mundo
    let t = null;
    if (this.palavra) {
      const er = el.getBoundingClientRect(), range = document.createRange();
      range.selectNodeContents(this.palavra);
      const b = range.getBoundingClientRect(), px = innerWidth * 0.03 + 16, py = b.height * 0.15;
      t = [b.left - er.left - px - W / 2, -(b.bottom - er.top + py - H / 2), b.right - er.left + px - W / 2, -(b.top - er.top - py - H / 2)];
    }
    for (const f of this.fundos) {
      const k = (zc + f.userData.d) / zc;            // camadas fundas parecem menores: compensa
      f.position.z = -f.userData.d;
      f.scale.set((W * 1.25 + 120) * k, (H * 1.25 + 120) * k, 1);
      const u = f.material.uniforms;
      u.uG.value = f.userData.g * k; u.uR.value = Math.max(fw, fh) * 0.85 * k; u.uF.value = 40 * k;
      u.uC.value.set(this.cx * k, this.cy * k); u.uS.value.set(W / 2 * k, H / 2 * k);
      if (t) u.uT.value.set(t[0] * k, t[1] * k, t[2] * k, t[3] * k);
    }
  }

  passo(dt, forcar) {
    if (!this.W || !this.H) return;
    const b = this.el.getBoundingClientRect(), vh = innerHeight;
    const alvo = trava(((b.top + b.height / 2) - vh / 2) / (vh / 2 + b.height / 2), -1, 1);   // +1 abaixo, -1 acima
    const tx = toque ? 0 : ponteiro.x, ty = toque ? 0 : ponteiro.y;
    let dx = 0, dy = 0, ds = 0;
    if (forcar) { this.px = tx; this.py = ty; this.sc = alvo; }
    else {
      const k = 1 - Math.exp(-dt * 7);
      dx = (tx - this.px) * k; dy = (ty - this.py) * k; ds = (alvo - this.sc) * (1 - Math.exp(-dt * 10));
      this.px += dx; this.py += dy; this.sc += ds;
    }
    const sair = this.hero ? trava(-b.top / b.height, 0, 1) : 0;        // hero "afundando" ao sair
    if (!forcar && !this.sujo && Math.abs(dx) + Math.abs(dy) + Math.abs(ds) < 4e-4 && sair === this.exit) return;
    this.sujo = false; this.exit = sair;

    const f = innerWidth < 768 ? 0.75 : 1, { cam, zc } = this;
    const mx = ponteiro.ativo ? ponteiro.cx - b.left - this.W / 2 : 1e5, my = ponteiro.ativo ? -(ponteiro.cy - b.top - this.H / 2) : 1e5;
    // a câmera desloca: z=0 (a foto) anda mais que o fundo = parallax real
    cam.position.set(this.px * 16 + this.sc * 14 * this.dir * f, -this.py * 10 + this.sc * 40 * f, zc);
    this.inclina.position.set(this.cx, this.cy + sair * 0.06 * vh * f, 0);
    this.inclina.scale.setScalar(1 + 0.06 * sair);
    this.inclina.rotation.set(this.py * 0.07 - this.sc * 0.03 * f, this.px * 0.09 + this.sc * 0.06 * this.dir * f, 0);
    this.brilho.material.uniforms.uPos.value = 0.5 + this.px * 0.35 + this.sc * 0.45 * this.dir;
    for (const fu of this.fundos) {
      const k = (zc + fu.userData.d) / zc, u = fu.material.uniforms;
      u.uK.value = this.sc * 3 + this.px * 2;
      u.uM.value.set(mx * k, my * k);
    }
    this.r.render(this.cena, cam);
  }

  desmontar() {
    cenas.delete(this);
    this.obs?.forEach((o) => o.disconnect());
    this.el.classList.remove('gl');
    this.canvas?.remove();
    this.r?.dispose();
  }
}

if (!toque) {
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    ponteiro.x = (e.clientX / innerWidth) * 2 - 1; ponteiro.y = (e.clientY / innerHeight) * 2 - 1;
    ponteiro.cx = e.clientX; ponteiro.cy = e.clientY; ponteiro.ativo = true;
  }, { passive: true });
}

document.querySelectorAll('[data-cena]').forEach((el, i) => {
  if (!el.querySelector('[data-foto] img')) return;
  const c = new Cena(el, i);
  c.iniciar().catch(() => c.desmontar());
});
