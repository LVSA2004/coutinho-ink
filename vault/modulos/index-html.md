---
tipo: modulo
status: ativo
arquivos: [index.html]
relacionado: [[css-styles]], [[js-main]], [[otimizar-fotos]], [[02-Arquitetura-e-Ligacoes]]
---

# index.html

Página única com 9 seções: hero, estilos, portfólio, disponíveis (oculta), artista, como funciona, FAQ, local, CTA final.

- Fotos: hero (anime-01, `fetchpriority="high"`), miniaturas de Estilos (versão 480, `alt=""`), portfólio (`<a class="obra" data-estilo>` com `<picture>`).
- `#disponiveis` tem `hidden`; o modelo para reativar está no comentário dentro de `.disp__paineis`.
- Pendências marcadas com `TROCAR:` (domínio, bio, FAQ, endereço em [[js-main]]).
- Dados estruturados `TattooParlor` no JSON-LD: falta `streetAddress`.
