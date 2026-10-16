# Ateliê Regina Feitosa — site

Publicado em https://rf-atelie.vercel.app

Versão sem pastas: todos os arquivos ficam juntos, na raiz do repositório do GitHub.
Isso facilita o envio pelo site do GitHub, que não envia pastas pelo botão "choose your files".

## Arquivos

- `index.html`: a página
- `style.css`: visual do site
- `precos.js`: **preços das peças** (é o único arquivo que você precisa editar para mudar valores)
- `script.js`: WhatsApp, menu, filtros e visualização ampliada (número, Instagram e mensagens no objeto `CONFIG`, no início do arquivo)
- `logo-atelie-regina-feitosa.png`: logotipo original
- `vestido-verde-oliva.png`, `bolsa-alca-circular.png`, `vestido-de-franjas.png`: fotos originais das peças
- `favicon.png`, `apple-touch-icon.png`, `icone-192.png`, `icone-512.png`: ícones do navegador e do celular
- `manifest.webmanifest`: permite "Adicionar à tela inicial" no celular
- `vercel.json`, `robots.txt`, `sitemap.xml`: configuração de publicação e Google

## Trocar ou adicionar uma peça

1. No GitHub: Add file → Upload files → envie a foto (nome sem espaços e sem acentos).
2. Para trocar a foto da bolsa, envie um arquivo com o mesmo nome, `bolsa-alca-circular.png`.
3. Para uma peça nova, edite o `index.html` (ícone de lápis), procure `PARA ADICIONAR UMA PEÇA`, copie um bloco `<article class="peca">` e troque o nome, a categoria e o nome da foto.

A Vercel publica as mudanças sozinha em cerca de um minuto.

## Alterar preços

1. Entre no GitHub com a sua conta e abra o repositório.
2. Clique no arquivo `precos.js` e depois no ícone de lápis (Edit).
3. Escreva o valor entre as aspas, ao lado do nome da peça: `"Vestido Verde-Oliva": "450",`
   (pode escrever `450`, `450,00` ou `R$ 450,00`). Aspas vazias `""` escondem o preço.
4. Clique em **Commit changes**. Em cerca de 1 minuto o site mostra o novo valor.

O preço aparece embaixo do nome da peça, na visualização ampliada e na mensagem automática do WhatsApp.
Só quem tem acesso à sua conta do GitHub consegue alterar os preços.
