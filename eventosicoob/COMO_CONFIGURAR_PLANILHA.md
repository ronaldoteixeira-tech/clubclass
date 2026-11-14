# Guia: Como Conectar o Formulário do ClubClass ao Google Sheets

Este guia ensina o passo a passo para criar a automação com **Google Apps Script** (gratuito, sem necessidade de servidores externos ou Zapier/Make).

---

## Passo 1: Criar a Planilha no Google Sheets
1. Acesse o [Google Sheets](https://sheets.new) com a sua conta Google.
2. Dê um nome para a planilha, por exemplo: `Cadastros ClubClass - Sicoob`.
3. (Opcional) Não precisa preencher cabeçalhos, o script criará automaticamente na primeira resposta recebida.

---

## Passo 2: Adicionar o Código do Webhook
1. No menu superior da planilha, clique em **Extensões** > **Apps Script**.
2. No editor que abrir, apague qualquer código existente (como `function myFunction() { ... }`).
3. Abra o arquivo [`google-sheets-script.js`](file:///c:/Users/Ronaldo/Desktop/Projetos/clubclass/eventosicoob/google-sheets-script.js) deste projeto, copie todo o conteúdo e cole no editor do Apps Script.
4. Clique no ícone de salvar (💾) ou pressione `Ctrl + S`.

---

## Passo 3: Publicar o Webhook (Implantar)
1. No canto superior direito do Apps Script, clique no botão azul **Implantar** (ou *Deploy*) > **Nova implantação** (*New deployment*).
2. Na engrenagem ao lado de "Selecione o tipo", escolha **App da Web** (*Web app*).
3. Preencha os campos exatamente assim:
   - **Descrição:** `Webhook Cadastros ClubClass`
   - **Executar como:** `Eu (seu-email@gmail.com)`
   - **Quem pode acessar:** `Qualquer pessoa` *(Anyone)*  
     ⚠️ **Atenção:** É fundamental escolher **"Qualquer pessoa"**, senão o navegador do visitante não conseguirá enviar os dados.
4. Clique em **Implantar**.
5. Se for solicitado, clique em **Autorizar acesso**, escolha sua conta Google e aprove as permissões (se aparecer aviso de aplicativo não verificado pelo Google, clique em *Avançado* e depois em *Acessar [Nome do Projeto] (não seguro)*).
6. Copie a **URL do app da Web** gerada (algo parecido com `https://script.google.com/macros/s/AKfycb.../exec`).

---

## Passo 4: Colar a URL no Formulário
1. Abra o arquivo [`eventosicoob/index.html`](file:///c:/Users/Ronaldo/Desktop/Projetos/clubclass/eventosicoob/index.html).
2. Procure por `window.CLUBCLASS_CONFIG`:
   ```javascript
   window.CLUBCLASS_CONFIG = Object.assign({
     endpoint: 'SUA_URL_DO_APPS_SCRIPT_AQUI',
     privacyNoticeApproved: true,
     approvalRequired: false
   }, window.CLUBCLASS_CONFIG || {});
   ```
3. Cole a URL no campo `endpoint`.
4. Salve o arquivo e faça o commit/push no GitHub!

Pronto! Cada novo cadastro enviado pelo formulário será automaticamente inserido como uma nova linha na sua planilha em tempo real.
