---
tipo: decisao
status: ativo
data: 2026-10-20
relacionado: [[index-html]], [[otimizar-fotos]], [[04-Perguntas-em-Aberto]]
---

# Fotos reais no lugar dos vetores; Disponíveis oculta

**Contexto:** o site usava vetores placeholder (`img/ph/*.svg`). Chegaram 21 fotos de tatuagens já feitas.

**Escolhas**
1. Todas as fotos foram para o portfólio, classificadas em 6 anime, 7 blackwork e 8 fineline. Hero com a foto anime de preto chapado; miniaturas de Estilos com uma foto de cada estilo.
2. **Disponíveis ficou oculta** (`hidden` + link fora do menu) e os 5 painéis vetoriais e o balão do FLASH saíram. Motivo: as fotos são trabalhos feitos, não desenhos à venda; mostrar um "DISPONÍVEL!" que não existe engana o visitante.
3. O lettering "Hugo" entrou em blackwork (preto sólido, traço grosso).
4. `img/ph/` foi apagada; os SVGs inline decorativos (linha de tinta, linhas do hero) ficaram, porque são identidade e não placeholder.
5. `picture { display: contents }` em vez de reescrever o CSS de cada componente.

**Como reverter a escolha 2:** passos no README, seção "Desenhos disponíveis (seção oculta)".
