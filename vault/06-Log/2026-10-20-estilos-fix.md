---
tipo: log
data: 2026-10-20
branch: feat/estilos-fix
relacionado: [[2026-10-20-camada-3d]], [[2026-10-20-recortes-e-leitura-em-estilos]], [[imersivo]], [[03-Tasks]]
---

# Sessão 2026-10-20 (3): fotos de Estilos e leitura das palavras

**Pedido:** as fotos de Estilos pareciam ter muito branco (a imagem menor que o retângulo branco) e era preciso conseguir ler o que está escrito na seção.

**Decisões do dono:** recortar em volta da tatuagem (mantendo as fotos); a foto só pode encostar numa ponta da palavra (até ~10%).

**O que mudou**
- `img/estilo-*` novos (recortes de anime-02, blackwork-01, fineline-01) e [[index-html]] apontando para eles.
- [[css-styles]]: moldura sem branco, tamanhos das palavras, margem do mobile, contorno do FINELINE, frase mais legível, parallax da palavra ±2vw.
- [[imersivo]]: textura por `Image` própria (pixels reais), `dataset.textura`, uniforme `uT` (screentone fora das letras). Bundle refeito.

**Verificado** (checkout limpo, Chrome headless com WebGL por software; viewports 1920, 1440 em DPR 1 e 2, 1366, 1024, 768, 414, 390, 360): branco no cartão: 0 a 2% (anime e fineline) e 10 a 12% (blackwork); letras cobertas 0 a 8,6% no desktop/tablet (pior caso: blackwork a 768 px) e até 0,5% no celular (pixels); palavra idêntica ao fallback (sem pontos sobre as letras); textura com a resolução real do arquivo.

**Não verificado:** GPU real e celular físico.
