---
tipo: testes
status: ativo
atualizado: 2026-10-20
relacionado: [[00-Index]]
---

# Testes

Não há suíte automatizada. A verificação é manual e por script:

- **Referências de imagem:** todo `src`, `srcset` e `href` que começa com `img/` no `index.html` precisa existir em disco.
- **Servidor local:** `python -m http.server 8765 --bind 127.0.0.1` na raiz (a 8080 pode estar ocupada).
- **Filtro do portfólio:** Anime 6, Blackwork 7, Fineline 8, Todos 21.
- **Lightbox:** clicar numa obra abre o JPG maior do `href`.
- **Console e rede:** nenhum 404 nem erro de JS ao rolar a página inteira em 1440 px e 390 px.
- **Disponíveis:** `display: none` e sem link no menu enquanto estiver `hidden`.
- **Otimizador:** `cd tools && node otimizar-fotos.mjs` (tem assert interno: toda foto sai em AVIF, WebP e JPG). Ver [[otimizar-fotos]].
