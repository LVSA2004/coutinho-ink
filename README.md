# Coutinho Ink: site

Landing page do estúdio Coutinho Ink (Méier, RJ). É HTML, CSS e JS puro: não tem build, não tem servidor, não tem banco de dados.

```
index.html          a página
css/styles.css      visual
js/main.js          filtro, lightbox, animações, endereço
img/                imagens do site (geradas pelo script)
fotos/              fotos originais (NÃO vai para o ar)
tools/              script de otimizar fotos (NÃO vai para o ar)
```

## Ver no computador

Na pasta do projeto:

```
python -m http.server 8080
```

Abra http://localhost:8080 no navegador. Para parar, `Ctrl+C` no terminal.

## Adicionar ou trocar fotos

O portfólio, o hero e as miniaturas de Estilos já usam fotos reais (21 no portfólio: 6 anime, 7 blackwork, 8 fineline). Para acrescentar uma:

1. Salve o original em `fotos/`, com um destes nomes:
   - `anime-07.jpg`, `blackwork-08.jpg`, `fineline-09.jpg`, ... para o portfólio (o prefixo define o estilo);
   - `disponivel-<nome-do-desenho>.jpg` para os desenhos disponíveis (ex.: `disponivel-mascara-oni.jpg`). O nome vira o título e a mensagem do WhatsApp.
2. Rode o script (precisa do Node instalado):
   ```
   cd tools
   npm install
   node otimizar-fotos.mjs
   ```
   Ele cria em `img/` as versões leves de cada foto (AVIF, WebP e JPG em até 3 tamanhos) e imprime um bloco `<picture>` para cada uma.
3. No `index.html`, copie um `<a class="obra">` existente em `.portfolio__grade`, troque o bloco `<picture>` pelo novo e ajuste `data-estilo` e o `href` (o JPG maior, que abre ampliado) com os valores que o script mostra no comentário. Troque `alt="TROCAR: descreva a tatuagem"` por uma descrição de verdade (ex.: "Tatuagem fineline de lua crescente no antebraço").

## Desenhos disponíveis (seção oculta)

A seção `#disponiveis` está com o atributo `hidden` e fora do menu até existirem desenhos reais para vender. Para reativar: gere as fotos `disponivel-<nome>`, coloque um `<article class="painel rv">` por desenho dentro de `.disp__paineis` (o modelo está no comentário do `index.html`), tire o `hidden` da `<section>` e devolva `<a href="#disponiveis">Disponíveis</a>` ao `<nav>` do topo.

## Endereço e horário

- **Texto e mapa da página:** constante `ESTUDIO` no começo de `js/main.js`:
  ```js
  const ESTUDIO = { endereco: 'Méier, Rio de Janeiro - RJ', horario: 'Atendimento com hora marcada' };
  ```
  O mapa e o botão "Abrir no Maps" usam esse endereço automaticamente.
- **Google (dados estruturados):** no `index.html`, no bloco `<script type="application/ld+json">`, preencha `"streetAddress"` com rua e número.

## Pendências (`TROCAR:`)

Tudo o que falta confirmar está marcado com `TROCAR:` no código (bio do artista, respostas do FAQ, endereço, domínio). Para listar:

```
grep -rn TROCAR --exclude-dir=node_modules .
```

No Windows sem grep, no PowerShell: `Select-String -Path index.html,js\main.js,css\styles.css -Pattern TROCAR`.

## Publicar

O site é só uma pasta de arquivos estáticos. **Não publique `fotos/` nem `tools/`** (são pesadas e só servem para você).

- **Netlify Drop (mais fácil):** copie a pasta do projeto sem `fotos/` e `tools/`, entre em https://app.netlify.com/drop e arraste a pasta. Pronto, sai um link.
- **Vercel ou GitHub Pages:** suba o repositório e aponte para a raiz. Coloque `fotos/` e `tools/` no `.gitignore` (ou `.vercelignore`) para não irem junto.

Depois de ter o domínio final, troque `https://coutinhoink.com.br/` no `index.html` (canonical, Open Graph e JSON-LD).
