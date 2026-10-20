---
tipo: decisao
status: ativo
data: 2026-10-20
relacionado: [[index-html]], [[css-styles]], [[imersivo]], [[2026-10-20-camada-3d-three]]
---

# Recortes em Estilos e palavras legíveis

**Problema:** os quadrados de Estilos pareciam ter muito branco e as palavras nem sempre davam para ler.

**Causas medidas**
1. `blackwork-01` tinha 33% de pixels quase brancos (papel-toalha); a moldura em papel e a sombra deslocada em papel somavam um "retângulo branco" maior que a tatuagem.
2. A textura do WebGL saía com a largura corrigida pela densidade (`img.naturalWidth` com `srcset`), menor que o arquivo.
3. A foto cobria até 41% das letras no mobile (o canto da foto girada sobe ~12 px) e o screentone era desenhado sobre as letras.

**Escolhas**
- **Recortes dedicados** `estilo-*` em volta da tatuagem (receita no README). Branco do blackwork: 33% → ~11%. A foto inteira segue no portfólio. Não se trocou a foto escolhida pelo dono.
- **Moldura sem branco:** borda de 2 px cinza claro; sombra do blackwork em `--tinta-3` (antes `--papel`); anime mantém a sombra hanko.
- **Textura em pixels reais:** uma `Image` própria (mesma URL, em cache) em vez do `<img>` com `srcset`. `canvas.dataset.textura` expõe a resolução para os testes.
- **Screentone desvia das letras:** uniforme `uT` com o retângulo da palavra e borda suave.
- **Palavras:** tamanhos para caber ao lado da foto (ANIME 12vw, BLACKWORK 6,8vw, FINELINE 7,5vw), parallax horizontal de ±2vw, FINELINE com contorno de 2 px, frase maior e mais clara. No mobile a foto desce `+0,2em` (positivo) para o canto girado só encostar na palavra.

**Como medir legibilidade (ver [[07-Testes]]):** renderizar o fallback CSS com a foto escondida e depois visível e contar quantos pixels das letras mudaram. Medir pela caixa da fonte ou pelo envelope do retângulo girado errou: dava 5% quando o olho via ~20%.

**Limite conhecido:** os recortes têm 560 a 740 px de largura; em tela de densidade 2 a foto de 480 px fica ~1,5× ampliada. Um original maior resolve ([[04-Perguntas-em-Aberto]]).
