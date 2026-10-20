---
tipo: modulo
status: ativo
arquivos: [tools/otimizar-fotos.mjs]
relacionado: [[index-html]], [[02-Arquitetura-e-Ligacoes]]
---

# tools/otimizar-fotos.mjs

Lê `fotos/` (jpg, png, webp) e gera `img/<nome>-<largura>.{avif,webp,jpg}` em 480, 960 e na largura original (as fotos atuais têm entre ~1000 e 1200 px, então saem 480, 960 e a largura original). Imprime o `<picture>` pronto, o `data-estilo` e o `href` do lightbox. Usa `sharp` (instalado em `tools/node_modules` e na raiz).

Convenção de nomes: `anime-NN`, `blackwork-NN`, `fineline-NN` (portfólio); `disponivel-<nome>` (Disponíveis, hoje oculta); `hero`, `artista`, `estudio` (avulsas).

Originais atuais em `fotos/` (fora do git): anime-01..06, blackwork-01..07, fineline-01..08.
