---
tipo: modulo
status: ativo
arquivos: [index.html]
relacionado: [[css-styles]], [[js-main]], [[otimizar-fotos]], [[02-Arquitetura-e-Ligacoes]]
---

# index.html

Página única com 9 seções: hero, estilos, portfólio, disponíveis (oculta), artista, como funciona, FAQ, local, CTA final.

- Fotos: hero (anime-01, `fetchpriority="high"`), Estilos (`<figure class="estilo__foto" data-foto>` com srcset 480/960 e alt descritivo), portfólio (`<a class="obra" data-estilo>` com `<picture>`).
- `data-cena` marca as 4 cenas da camada 3D ([[imersivo]]): `.hero__cena` e cada `<li class="estilo">`; `data-foto` marca o figure que vira cartão.
- Em `alt`, usar aspas tipográficas (“ ”) para citações: aspas retas quebram o atributo.
- `#disponiveis` tem `hidden`; o modelo para reativar está no comentário dentro de `.disp__paineis`.
- Pendências marcadas com `TROCAR:` (domínio, bio, FAQ, endereço em [[js-main]]).
- Dados estruturados `TattooParlor` no JSON-LD: falta `streetAddress`.
