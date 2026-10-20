---
tipo: arquitetura
status: ativo
atualizado: 2026-10-20
relacionado: [[00-Index]]
---

# Arquitetura e ligações

```
fotos/ (originais, fora do git e do ar)
   └─ [[otimizar-fotos]] ──► img/<nome>-{480,960,N}.{avif,webp,jpg}
                                   │  blocos <picture>
                                   ▼
                              [[index-html]] ◄── [[css-styles]] (layout, parallax, reveal)
                                   ▲
                              [[js-main]] (filtro, lightbox, endereço, fallback do parallax)
```

- `[[otimizar-fotos]]` lê `fotos/` e imprime o `<picture>` a colar no `[[index-html]]`. O prefixo do nome (`anime-`, `blackwork-`, `fineline-`) vira o `data-estilo`.
- `[[index-html]]` usa as fotos em três lugares: hero (anime-01), miniaturas de Estilos (anime-02, blackwork-01, fineline-01) e portfólio (21 obras).
- `[[js-main]]` filtra `.obra` por `data-estilo` e abre o `href` da obra (JPG maior) no `<dialog>` do lightbox.
- `[[css-styles]]` tem `picture { display: contents }`: o `<picture>` não vira caixa, então o `<img>` continua sendo o item de grid/flex que o CSS já esperava (`.estilo__thumb`, `.obra`, `.hero__panel`).
- Seção `#disponiveis` existe no HTML, mas está `hidden` (ver [[2026-10-20-fotos-reais-e-disponiveis-oculta]]).
