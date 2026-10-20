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
- **Camada 3D** ([[imersivo]]): testar sempre num checkout limpo (`git archive HEAD` para uma pasta temporária, servida ali), com Chrome headless e `--use-angle=swiftshader --enable-unsafe-swiftshader` para ter WebGL. Conferir: as 4 cenas ganham `.gl`; o bundle só é pedido depois do `load`; mouse e scroll mudam a imagem; com `prefers-reduced-motion` não há canvas nem download do bundle; com o bundle bloqueado a página fica igual ao CSS; sem overflow horizontal em 390 px.
- **Estilos (fotos e leitura):** nos viewports 1920, 1440 (DPR 1 e 2), 1366, 1024, 768, 414, 390 e 360, com o bundle bloqueado renderizar cada linha com a foto escondida e depois visível e contar quantos pixels claros das letras mudaram (meta ≤ 10%); branco (pixels com R,G,B > 200) dentro do cartão ≤ 15%; `canvas.dataset.textura` com a largura do arquivo escolhido; palavra com 3D igual à do fallback (sem pontos sobre as letras). Não medir sobreposição pela caixa da fonte nem pelo envelope do retângulo girado: erram. Ver [[2026-10-20-recortes-e-leitura-em-estilos]].
- **Referências no git:** todo caminho de `src`, `srcset`, `href`, `url()` e `import()` precisa estar em `git ls-files` com a caixa idêntica (o Vercel é Linux, case-sensitive).
- **`vercel.json`:** validar com `@vercel/routing-utils` (`getTransformedRoutes`); caminhos internos redirecionam, `/`, `/img`, `/js`, `/css` não.
- **Atributos de `<img>`:** nenhum atributo fora de `src, srcset, sizes, width, height, alt, loading, fetchpriority, class` (aspas soltas em `alt` criam atributos falsos).
- **Otimizador:** `cd tools && node otimizar-fotos.mjs` (tem assert interno: toda foto sai em AVIF, WebP e JPG). Ver [[otimizar-fotos]].
