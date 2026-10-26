# Automação n8n: Formulário ClubClass para Google Sheets

Este guia ensina como importar o fluxo pronto no seu **n8n**, conectar a sua planilha do **Google Sheets** e ligar o webhook à página.

---

## 1. O que este fluxo do n8n faz
1. **Webhook:** Recebe o envio do formulário em tempo real com suporte a CORS (`Access-Control-Allow-Origin: *`).
2. **Formatar Dados:** Limpa e formata CNPJ (`00.000.000/0000-00`), Telefone (`(31) 99999-9999`) e gera a data/hora exata no fuso de Brasília.
3. **Google Sheets:** Insere uma nova linha na planilha selecionada.
4. **Responder ao Site:** Devolve a confirmação JSON `{ "success": true, "status": "confirmed" }` para a página exibir a tela de sucesso para o participante.

---

## 2. Como Importar o Fluxo no n8n

1. Abra o seu **n8n**.
2. No menu lateral ou canto superior direito, clique em **Add Workflow** (ou crie um novo).
3. Clique nos **3 pontinhos (...)** no canto superior direito do canvas e selecione **"Import from File"** (ou copie o conteúdo do arquivo [`eventosicoob/n8n-workflow-clubclass.json`](file:///c:/Users/Ronaldo/Desktop/Projetos/clubclass/eventosicoob/n8n-workflow-clubclass.json) e dê `Ctrl + V` diretamente na tela do n8n).
4. O fluxo com os 4 blocos aparecerá na tela:
   - `Webhook Formulário`
   - `Formatar Dados`
   - `Salvar no Google Sheets`
   - `Responder ao Site`

---

## 3. Preparar a sua Planilha no Google Sheets

Crie uma planilha no Google Sheets (ex: `Cadastros ClubClass - Sicoob`) com os seguintes nomes na **Linha 1** (cabeçalho):

| Data/Hora | Razão Social | CNPJ | Nome do Responsável | Telefone | Evento | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

---

## 4. Conectar o Google Sheets no n8n

1. Dê dois cliques no nó **Salvar no Google Sheets**.
2. Em **Credential to connect with**, selecione sua credencial do Google (Google Sheets OAuth2 ou Service Account).
3. Em **Document**, selecione a planilha criada (ex: `Cadastros ClubClass - Sicoob`).
4. Em **Sheet Name**, selecione a aba (ex: `Página1` ou `Sheet1`).
5. As colunas já estão mapeadas para os campos formatados.

---

## 5. Pegar a URL do Webhook e Ativar

1. Dê dois cliques no nó **Webhook Formulário**.
2. Você verá duas URLs:
   - **Test URL:** Use para testar uma vez no n8n clicando em "Listen for Test Event".
   - **Production URL:** Use no site oficial (ex: `https://seu-n8n.com/webhook/clubclass-rsvp`).
3. Clique no botão **Save** no topo do n8n e mude o status do workflow de **Inactive** para **Active** (ligar a chavinha no topo).

---

## 6. Colar a URL no Site

1. Abra o arquivo [`eventosicoob/index.html`](file:///c:/Users/Ronaldo/Desktop/Projetos/clubclass/eventosicoob/index.html#L160-L165).
2. Cole a URL de Produção do n8n no campo `endpoint`:
   ```javascript
   window.CLUBCLASS_CONFIG = Object.assign({
     endpoint: 'https://seu-n8n.com/webhook/clubclass-rsvp',
     privacyNoticeApproved: true,
     approvalRequired: false
   }, window.CLUBCLASS_CONFIG || {});
   ```
3. Salve o arquivo e faça o push no Git:
   ```bash
   git add .
   git commit -m "conecta webhook n8n"
   git push
   ```
