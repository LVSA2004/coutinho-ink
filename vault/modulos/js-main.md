---
tipo: modulo
status: ativo
arquivos: [js/main.js]
relacionado: [[index-html]], [[css-styles]]
---

# js/main.js

- Carregador da camada 3D: `import('./imersivo.min.js')` depois do `load` (ocioso), exceto com `prefers-reduced-motion` ou `saveData`. Ver [[imersivo]].
- Reveal (`.rv` → `.is-in`) por IntersectionObserver.
- Constante `ESTUDIO` (endereço e horário) alimenta texto, mapa e botão "Abrir no Maps". Ainda com `TROCAR:`.
- Filtro do portfólio por `data-estilo` e lightbox em `<dialog>` que abre o `href` de cada `.obra`.
- Fallback do parallax quando o navegador não tem `animation-timeline: view()`.
