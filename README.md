# Coutinho Ink: site

Landing page do estúdio Coutinho Ink (Méier, RJ). É HTML, CSS e JS puro: não tem build no deploy, não tem servidor, não tem banco de dados.

```
index.html            a página
css/styles.css        visual
js/main.js            filtro, lightbox, animações, endereço e o carregador da camada 3D
js/imersivo.min.js    camada 3D (three.js), gerada a partir de js/src/imersivo.js
js/src/imersivo.js    fonte da camada 3D
img/                  imagens do site (geradas pelo script)
vercel.json           redirects que tiram as notas internas do ar
fotos/                fotos originais (NÃO vai para o ar, fica fora do git)
tools/                script de otimizar fotos (NÃO vai para o ar)
```

## Ver no computador

Na pasta do projeto:

```
python -m http.server 8080
```

Abra http://localhost:8080 no navegador. Para parar, `Ctrl+C` no terminal.

## Adicionar ou trocar fotos

O portfólio, o hero e as miniaturas de Estilos já usam fotos reais (21 no portfólio: 6 anime, 7 blackwork, 8 fineline). Para acrescentar uma:

1. Salve o original em `fotos/`, com um destes nomes:
   - `anime-07.jpg`, `blackwork-08.jpg`, `fineline-09.jpg`, ... para o portfólio (o prefixo define o estilo);
   - `disponivel-<nome-do-desenho>.jpg` para os desenhos disponíveis (ex.: `disponivel-mascara-oni.jpg`). O nome vira o título e a mensagem do WhatsApp.
2. Rode o script (precisa do Node instalado):
   ```
   cd tools
   npm install
   node otimizar-fotos.mjs
   ```
   Ele cria em `img/` as versões leves de cada foto (AVIF, WebP e JPG em até 3 tamanhos) e imprime um bloco `<picture>` para cada uma.
3. No `index.html`, copie um `<a class="obra">` existente em `.portfolio__grade`, troque o bloco `<picture>` pelo novo e ajuste `data-estilo` e o `href` (o JPG maior, que abre ampliado) com os valores que o script mostra no comentário. Troque `alt="TROCAR: descreva a tatuagem"` por uma descrição de verdade (ex.: "Tatuagem fineline de lua crescente no antebraço").

## Fotos da seção Estilos (recortes)

As três fotos grandes de Estilos não são as do portfólio: são **recortes apertados em volta da tatuagem** (`img/estilo-anime-*`, `estilo-blackwork-*`, `estilo-fineline-*`). Sem o recorte, a foto do blackwork tinha 33% de papel-toalha branco; com ele, cerca de 11%. As fotos inteiras seguem no portfólio e no lightbox.

Receita (origem em `fotos/`, caixa em pixels do original `left, top, largura, altura`):

| Saída | Original | Caixa |
|---|---|---|
| `estilo-anime` | `anime-02.jpeg` | 250, 200, 720, 900 |
| `estilo-blackwork` | `blackwork-01.jpeg` | 140, 30, 740, 1130 |
| `estilo-fineline` | `fineline-01.jpeg` | 425, 400, 560, 712 |

Para trocar a foto de um estilo: escolha o original, recorte com `sharp(...).extract({ left, top, width, height }).jpeg({ quality: 95 })`, salve em `fotos/estilo-<nome>.jpeg` e rode `node otimizar-fotos.mjs` (na pasta `tools/`; para não refazer as outras, aponte `FOTOS_DIR` para uma pasta só com os recortes). Depois ajuste `width`, `height` e os nomes no `<figure class="estilo__foto">` do `index.html`. Meta: proporção entre 0,65 e 0,85, tatuagem ocupando a maior parte do quadro e pouco fundo branco.

## Desenhos disponíveis (seção oculta)

A seção `#disponiveis` está com o atributo `hidden` e fora do menu até existirem desenhos reais para vender. Para reativar: gere as fotos `disponivel-<nome>`, coloque um `<article class="painel rv">` por desenho dentro de `.disp__paineis` (o modelo está no comentário do `index.html`), tire o `hidden` da `<section>` e devolva `<a href="#disponiveis">Disponíveis</a>` ao `<nav>` do topo.

## Camada 3D (three.js)

O hero e as três linhas de Estilos têm um canvas WebGL com a foto em perspectiva (inclina com o mouse e com o scroll, com brilho de papel) sobre um fundo de screentone em duas profundidades. A foto nunca é deformada.

- **É melhoria progressiva.** O layout em CSS já está completo sozinho. O 3D só carrega depois do evento `load` e fica de fora com `prefers-reduced-motion`, economia de dados (`saveData`), sem WebGL2 ou se o arquivo falhar. Quando entra, a classe `.gl` aparece na cena e o `<figure>` do DOM some (continua lá para SEO e leitor de tela).
- **O que vai ao ar** é `js/imersivo.min.js` (~137 KB com gzip), commitado. O Vercel não roda build.
- **Mudar o efeito:** edite `js/src/imersivo.js` e gere de novo (precisa do Node), na raiz do projeto:
  ```
  npm i --no-save three@0.186.1
  npx esbuild@0.28.2 js/src/imersivo.js --bundle --minify --format=esm --target=es2020 --legal-comments=inline --outfile=js/imersivo.min.js
  ```
  Commite o `.min.js` junto com a fonte. `--no-save` não mexe no `package.json`.
- **Nova foto numa cena:** o `<figure data-foto>` da cena define posição e tamanho; cor da borda, sombra e deslocamento vêm das variáveis `--cartao-*` do CSS (`.hero__panel`, `.estilo__foto`), as mesmas que o fallback usa.

## Endereço e horário

- **Texto e mapa da página:** constante `ESTUDIO` no começo de `js/main.js`:
  ```js
  const ESTUDIO = { endereco: 'Méier, Rio de Janeiro - RJ', horario: 'Atendimento com hora marcada' };
  ```
  O mapa e o botão "Abrir no Maps" usam esse endereço automaticamente.
- **Google (dados estruturados):** no `index.html`, no bloco `<script type="application/ld+json">`, preencha `"streetAddress"` com rua e número.

## Pendências (`TROCAR:`)

Tudo o que falta confirmar está marcado com `TROCAR:` no código (bio do artista, respostas do FAQ, endereço, domínio). Para listar:

```
grep -rn TROCAR --exclude-dir=node_modules .
```

No Windows sem grep, no PowerShell: `Select-String -Path index.html,js\main.js,css\styles.css -Pattern TROCAR`.

## Publicar

O site é só uma pasta de arquivos estáticos. **Não publique `fotos/` nem `tools/`** (são pesadas e só servem para você).

- **Netlify Drop (mais fácil):** copie a pasta do projeto sem `fotos/` e `tools/`, entre em https://app.netlify.com/drop e arraste a pasta. Pronto, sai um link.
- **Vercel (é o que está em uso):** o repositório é o site, a raiz é a pasta publicada e não há build. Cada branch ganha um deploy de preview; produção é o merge no `main`. Como o Vercel serve o repositório inteiro, o `vercel.json` redireciona `vault/`, `docs/`, `tools/`, `fotos/` e os `.md` da raiz para a home, para não expor notas internas. `fotos/` já está no `.gitignore`.
- **GitHub Pages:** suba o repositório e aponte para a raiz. Lá não existe o `vercel.json`, então mova `vault/` e `docs/` para fora do repositório antes.

Depois de ter o domínio final, troque `https://coutinhoink.com.br/` no `index.html` (canonical, Open Graph e JSON-LD).
