/**
 * ============================================================================
 * WEBHOOK GOOGLE APPS SCRIPT -> GOOGLE SHEETS
 * Projeto: ClubClass - Lançamento Sicoob
 * ============================================================================
 * 
 * INSTRUÇÕES RÁPIDAS DE INSTALAÇÃO:
 * 1. Crie uma nova planilha no Google Sheets (ex: "Cadastros ClubClass - Sicoob")
 * 2. No menu superior, clique em: Extensões -> Apps Script
 * 3. Apague o código que estiver lá e cole todo este arquivo
 * 4. Clique no ícone de Salvar (💾)
 * 5. Clique no botão azul no canto superior direito: "Implantar" (Deploy) -> "Nova implantação"
 * 6. Na engrenagem (Selecionar tipo), escolha: "App da Web" (Web app)
 * 7. Configure:
 *    - Descrição: Webhook Formulário ClubClass
 *    - Executar como: Eu (seu email)
 *    - Quem pode acessar: Qualquer pessoa (Anyone)  <-- ESSENCIAL!
 * 8. Clique em "Implantar", autorize as permissões da sua conta Google
 * 9. Copie a "URL do app da Web" gerada (termina com /exec)
 * 10. Cole a URL no arquivo 'eventosicoob/index.html' no campo window.CLUBCLASS_CONFIG.endpoint
 */

function doPost(e) {
  // Trava para evitar conflito caso várias pessoas enviem no mesmo segundo
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Cria cabeçalhos formatados caso a planilha esteja vazia
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Data/Hora",
        "Razão Social",
        "CNPJ",
        "Nome do Responsável",
        "Telefone",
        "Evento",
        "Status"
      ];
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#d8ad3d");
      headerRange.setFontColor("#090909");
      sheet.setFrozenRows(1);
    }

    // Extrai os dados enviados pelo formulário
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Formata a data e hora no fuso horário de Brasília
    var dataHora = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");

    var razaoSocial = (data.razao_social || "").toString().trim();
    var cnpj = (data.cnpj || "").toString().trim();
    var nomeResponsavel = (data.nome_responsavel || "").toString().trim();
    var telefone = (data.telefone || "").toString().trim();
    var evento = (data.evento || "clubclass-lancamento-2026-10-28").toString().trim();

    // Formata o CNPJ se vier só em números
    if (cnpj.length === 14 && /^\d+$/.test(cnpj)) {
      cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }

    // Formata o telefone se vier só em números
    if (/^\d+$/.test(telefone)) {
      if (telefone.length === 11) {
        telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
      } else if (telefone.length === 10) {
        telefone = telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
      }
    }

    // Adiciona a linha na planilha (o apóstrofo garante que números com zero à esquerda fiquem como texto)
    sheet.appendRow([
      dataHora,
      razaoSocial,
      "'" + cnpj,
      nomeResponsavel,
      "'" + telefone,
      evento,
      "Confirmado"
    ]);

    // Retorno de sucesso exigido pela página
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        status: "confirmed",
        message: "Cadastro registrado com sucesso!"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        status: "error",
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Resposta amigável caso a URL seja acessada diretamente no navegador
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "Webhook do ClubClass está ativo e pronto para receber cadastros via POST."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
