---
tipo: decisao
status: ativo
data: 2026-10-20
relacionado: [[imersivo]], [[css-styles]], [[index-html]], [[02-Arquitetura-e-Ligacoes]]
---

# Camada 3D com three.js no hero e em Estilos

**Contexto:** no hero os detalhes (linhas de mangá, selo) ficavam por cima da foto; em Estilos a palavra gigante cobria uma miniatura de até 230 px. A foto é o trabalho do cliente e tem de ser o foco. Pedido: parallax moderno e imersivo com three.js, com deploy no Vercel funcionando.

**Escolhas**
1. **Melhoria progressiva.** O CSS já entrega o layout certo (detalhes atrás, fotos de até 480 px na frente das palavras). O WebGL só entra por cima.
2. **Um canvas por cena**, absoluto dentro do bloco (`.hero__cena` e cada `.estilo`), em vez de um canvas fixo sincronizado com o scroll. Rola junto com o DOM, então não existe defasagem.
3. **A foto nunca é deformada.** Só inclina em perspectiva (máx. ~8°) e ganha um brilho de papel. A profundidade vem de camadas ao redor: screentone em z=-80 e z=-220, câmera deslocada por mouse e scroll.
4. **Textura via canvas 2D**, não direto do `<img>`: `img.width` devolve a largura renderizada em CSS, o three aloca a textura com ela e a imagem maior não cabe (a foto saía transparente). Ver [[imersivo]].
5. **Bundle commitado** (`js/imersivo.min.js`, 137 KB gzip, esbuild com tree-shaking de three 0.186.1). Sem `package.json` no git, o Vercel trata o projeto como estático e não roda build.
6. **Carrega só depois do `load`**, e não carrega com `prefers-reduced-motion`, `saveData` ou sem WebGL2. No celular usa o scroll como motor (sem mouse) e resolução limitada a 1,5x.
7. **`vercel.json` com redirects** de `vault/`, `docs/`, `tools/`, `fotos/` e `.md` da raiz. O Vercel serve o repositório inteiro e as notas internas (perguntas em aberto) ficariam públicas. Validado com `@vercel/routing-utils`.

**Descartado:** canvas fixo em tela cheia com planos sincronizados ao DOM (defasagem de scroll e conflito de z-index com texto); copiar o three inteiro (720 KB); distorção por mapa de profundidade (deforma a tatuagem).
