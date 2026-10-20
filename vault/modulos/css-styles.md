---
tipo: modulo
status: ativo
arquivos: [css/styles.css]
relacionado: [[index-html]], [[js-main]]
---

# css/styles.css

Tokens em OKLCH, tipografia, componentes (`.btn`, `.obra`, `.painel`, `.balao`, `.lightbox`) e parallax com scroll-driven animations (`.px`, fallback em [[js-main]]). Regras de design em `DESIGN.md`.

- `picture { display: contents }` (logo após o reset de `img, svg`): mantém o `<img>` como item de layout dos componentes de [[index-html]].
- `[hidden] { display: none !important }` é o que mantém a seção Disponíveis oculta.
- Pilha de z-index no hero e em Estilos: fundo 0, palavras e detalhes 1, foto/canvas 2, textos 3. Os detalhes do hero ficam atrás da foto.
- `.hero__panel` e `.estilo__foto` definem a moldura por `--cartao-borda`, `--cartao-sombra`, `--cartao-desloc`, `--cartao-bw`; o fallback CSS e o WebGL ([[imersivo]]) leem as mesmas variáveis.
- `.cena__canvas` e `.gl`: com `.gl` o canvas aparece e o `[data-foto]` do DOM some (mas continua no DOM).
- Estilos: tamanho da palavra por linha em `--palavra`; foto alterna lado (direita, esquerda, direita).
