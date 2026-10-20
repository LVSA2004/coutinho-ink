---
tipo: modulo
status: ativo
arquivos: [js/src/imersivo.js, js/imersivo.min.js, js/main.js]
relacionado: [[index-html]], [[css-styles]], [[js-main]], [[2026-10-20-camada-3d-three]]
---

# Camada 3D (imersivo)

**Fonte:** `js/src/imersivo.js`. **Servido:** `js/imersivo.min.js` (gerado; comando no README).

**Fluxo:** [[js-main]] importa o bundle depois do `load`. Para cada `[data-cena]` com `[data-foto] img`, a classe `Cena` espera a imagem, monta o canvas (`.cena__canvas`), desenha o primeiro frame e só então põe `.gl` na cena. O CSS ([[css-styles]]) esconde o `<figure>` e mostra o canvas.

**Cartão:** plano de sombra, moldura, foto e brilho. Posição e tamanho vêm de `figure.offset*` (ignora transform); cor/espessura/deslocamento, das variáveis `--cartao-*`; rotação, do `rotate` do CSS. Cores oklch viram RGB por um canvas 2D de 1×1.

**Movimento:** câmera em perspectiva com 1 unidade = 1 px no plano z=0. O ponteiro (só mouse) e o progresso de scroll da cena deslocam a câmera e inclinam o cartão. O render só roda com a cena visível e só quando algo mudou.

**Armadilhas**
- Textura: nunca `new Texture(img)` com o `<img>` do DOM (ver [[2026-10-20-camada-3d-three]], item 4). Tampouco desenhar o `<img>` com `srcset` no canvas: `naturalWidth` vem corrigido pela densidade. Usa-se uma `Image` própria da mesma URL (`currentSrc`), e `canvas.dataset.textura` guarda `LxA` real ([[2026-10-20-recortes-e-leitura-em-estilos]]).
- Screentone sobre texto: o canvas fica acima das palavras; o uniforme `uT` (retângulo da palavra, só em Estilos) zera os pontos ali.
- Ordem de desenho por `renderOrder` com tudo `transparent` e sem `depthTest`.
- `fwidth` e `#include <colorspace_fragment>` exigem WebGL2 (o three atual já exige).
- `webglcontextlost` desmonta a cena e devolve o fallback CSS.

**Variáveis de ajuste** (no topo e em `passo`): `FOV`, amplitude da câmera (16/10 px por mouse, 14/40 px por scroll), inclinação (0,09 e 0,07 rad por mouse), brilho `uAlfa`, alfa e passo do screentone em `fundos`.
