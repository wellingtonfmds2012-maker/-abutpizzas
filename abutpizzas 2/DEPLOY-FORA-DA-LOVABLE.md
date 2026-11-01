# ABUTPIZZAS — rodar e publicar fora da Lovable

Este ZIP contém o projeto inteiro: telas, componentes, fotos, estilos, testes e
configuração de build. Não precisa de nada da Lovable para funcionar.

## O que o cardápio precisa para funcionar

- **Nada de backend.** Não há banco de dados, login nem chaves de API.
- **Nenhuma variável de ambiente.** Não existe arquivo `.env` obrigatório.
- **Duas coisas externas**, ambas no navegador do cliente:
  - o WhatsApp, aberto pelo link `https://wa.me/...` montado em `src/lib/order.ts`;
  - a consulta de CEP da ViaCEP (`https://viacep.com.br/ws/.../json/`) em
    `src/components/menu/Checkout.tsx`.
- **Fotos:** os 11 arquivos `.jpg` em `src/assets/` (≈ 1,7 MB) já estão no ZIP.

## Requisitos

- Node.js 22 ou mais novo (o build da Netlify usa essa versão).
- npm (vem com o Node) — ou Bun, se preferir: o ZIP traz o `bun.lock`.

## Instalar e rodar no computador

```sh
npm ci        # instala exatamente as versões do package-lock.json
npm run dev   # abre o cardápio em http://localhost:8080
```

Outros comandos úteis:

```sh
npm run build   # gera a versão de produção em dist/
npm run preview # roda a versão de produção localmente
npm test        # roda os testes (validação do pedido, rota, mensagem do WhatsApp)
npm run lint    # verifica o código
```

## Publicar na Netlify

O build usa **Nitro**, que reconhece a Netlify sozinho e gera em `dist/` a
função que roda o servidor mais o `_redirects` de fallback. Por isso o
`netlify.toml` deste projeto só define o essencial:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

### Opção A — pelo Git (recomendada)

1. Descompacte o ZIP e crie um repositório com o conteúdo
   (ex.: `git init`, commit, e push para GitHub/GitLab/Bitbucket).
2. Na Netlify: **Add new site → Import an existing project** → escolha o repositório.
3. Confirme o build: command `npm run build`, publish directory `dist`.
   O `netlify.toml` já faz isso — normalmente basta clicar em **Deploy**.
4. Cada push na rama publicada gera um novo deploy.

### Opção B — pelo Netlify CLI, sem Git

```sh
npm install -g netlify-cli
cd abutpizzas
netlify login
netlify deploy --build --prod
```

O `--build` roda `npm run build` e envia o conteúdo de `dist/` (função +
arquivos estáticos). **Não** use o arrastar-e-soltar de uma pasta no painel da
Netlify: esse caminho só serve para sites estáticos e não executa o servidor do
TanStack Start.

### Depois de publicar

Abra o link gerado e confira:

- a home carrega com as fotos e os preços;
- adicionar um item mostra a barra do carrinho;
- "FINALIZAR PEDIDO PELO WHATSAPP" abre a conversa com o número
  (81) 99384-6296 e a mensagem completa do pedido;
- digitar um CEP preenche endereço, bairro e cidade.

## Outras hospedagens

O mesmo código roda em qualquer plataforma que o Nitro reconhece — ele escolhe o
alvo automaticamente quando está no ambiente daquela plataforma:

- **Vercel:** conecte o repositório; build `npm run build`, Node 22, sem
  precisar definir pasta de saída.
- **Cloudflare Pages:** build `npm run build`, output `dist`.
- **Servidor próprio / Docker:** rode `npm run build` e use o alvo `node` do
  Nitro com `NITRO_PRESET=node_server`, ou o `node`/Docker que servir o `dist/`.
- **Hospedagem 100% estática (só arquivos):** o cardápio não tem funções de
  servidor, então dá para gerar só HTML/CSS/JS. Esse modo precisa de um ajuste
  no build — me avise que eu preparo.

## Onde mexer no cardápio

| O que mudar | Arquivo |
| --- | --- |
| Nome, slogan, WhatsApp, telefone, endereço, horários, taxa de entrega, produtos e preços | `src/data/menu.ts` |
| Cálculo do pedido, validação dos campos e mensagem do WhatsApp | `src/lib/order.ts` |
| Carrinho (guardado no navegador do cliente) | `src/lib/cart.tsx` |
| Cartão de produto | `src/components/menu/ProductCard.tsx` |
| Tela do pedido / pagamento / entrega | `src/components/menu/Checkout.tsx` |
| Página do cardápio | `src/routes/index.tsx` |
| Cores, fontes e visual | `src/styles.css` |
| Fotos dos produtos | `src/assets/` |

Depois de qualquer mudança: `npm run build` e um novo deploy.
