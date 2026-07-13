var CONTACT_SHEET = 'Sheet1';
var GUESTBOOK_SHEET = 'Guestbook';
var GUESTBOOK_MAX_ENTRIES = 30;

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';
  if (action === 'guestbook') return getGuestbook();
  return handleResponse(e);
}

function doPost(e) {
  return handleResponse(e);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getSpreadsheet() {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  return SpreadsheetApp.openById(spreadsheetId);
}

function getContactSheet(ss) {
  return ss.getSheetByName(CONTACT_SHEET) || ss.getSheets()[0];
}

function getGuestbookSheet(ss) {
  var sheet = ss.getSheetByName(GUESTBOOK_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(GUESTBOOK_SHEET);
    // Put anything in "hide" (e.g. x) to suppress an entry without deleting it.
    sheet.appendRow(['timestamp', 'name', 'message', 'submissionId', 'hide']);
  }
  return sheet;
}

// GET ?action=guestbook — latest entries, newest first, for display on the site.
function getGuestbook() {
  try {
    var sheet = getGuestbookSheet(getSpreadsheet());
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return json({ result: 'success', entries: [] });

    // Read more rows than needed so hidden entries don't shrink the list.
    var count = Math.min(GUESTBOOK_MAX_ENTRIES * 2, lastRow - 1);
    var values = sheet.getRange(lastRow - count + 1, 1, count, 5).getValues();

    var entries = values
      .filter(function (row) { return !row[4]; }) // "hide" column empty
      .map(function (row) {
        return {
          ts: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
          name: String(row[1] || '').slice(0, 40),
          msg: String(row[2] || '').slice(0, 200),
          id: String(row[3] || ''),
        };
      })
      .filter(function (e) { return e.name && e.msg; })
      .reverse()
      .slice(0, GUESTBOOK_MAX_ENTRIES);

    return json({ result: 'success', entries: entries });
  } catch (error) {
    return json({ result: 'error', message: error.message });
  }
}

function handleResponse(e) {
  try {
    var data = (e && e.parameter) || {};

    if (!data.submissionId) {
      return json({ result: 'error', message: 'Missing submission ID' });
    }

    var isGuestbook = data.formType === 'guestbook';
    var ss = getSpreadsheet();
    var sheet = isGuestbook ? getGuestbookSheet(ss) : getContactSheet(ss);

    // Duplicate check — submissionId lives in col 4 (guestbook) / col 5 (contact)
    var idColumn = isGuestbook ? 3 : 4;
    var values = sheet.getDataRange().getValues();
    for (var i = 0; i < values.length; i++) {
      if (values[i][idColumn] === data.submissionId) {
        return json({ result: 'warning', message: 'Duplicate submission' });
      }
    }

    // Verify Turnstile token server-side
    var secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET_KEY');
    var verifyResp = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post',
      payload: { secret: secret, response: data['cf-turnstile-response'] || '' },
      muteHttpExceptions: true,
    });
    var verify = JSON.parse(verifyResp.getContentText());
    if (!verify.success) {
      return json({ result: 'error', message: 'Verification failed' });
    }

    var timestamp = new Date();

    if (isGuestbook) {
      var guestName = String(data.name || '').slice(0, 40);
      var guestMsg = String(data.message || '').slice(0, 200);
      sheet.appendRow([timestamp, guestName, guestMsg, data.submissionId]);
      try { sendGuestbookNotification(guestName, guestMsg, timestamp); } catch (mailErr) {
        console.error('Guestbook mail failed: ' + mailErr.message);
      }
      return json({ result: 'success', message: 'Signed!' });
    }

    sheet.appendRow([timestamp, data.name, data.email, data.message, data.submissionId]);
    sendContactNotification(data, timestamp);
    return json({ result: 'success', message: 'Data successfully saved!' });
  } catch (error) {
    console.error('Error: ' + error.message);
    return json({ result: 'error', message: error.message });
  }
}

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function sendGuestbookNotification(name, msg, timestamp) {
  MailApp.sendEmail({
    to: 'nurahmadkhatim@gmail.com',
    subject: 'New guestbook signature: ' + name,
    name: 'Website Guestbook',
    htmlBody:
      '<p><b>' + esc(name) + '</b> signed your guestbook:</p>' +
      '<blockquote>' + esc(msg).replace(/\n/g, '<br>') + '</blockquote>' +
      '<p><small>' + esc(timestamp.toISOString()) + ' — to hide it, put an x in the Hide column of the Guestbook sheet.</small></p>',
  });
}

function sendContactNotification(data, timestamp) {

  MailApp.sendEmail({
    to: 'nurahmadkhatim@gmail.com',
    subject: 'New contact form submission',
    replyTo: data.email || '',
    name: 'Website Contact Form',
    htmlBody:
      '<p>You received a new submission:</p>' +
      '<ul>' +
      '<li><b>Name:</b> ' + esc(data.name) + '</li>' +
      '<li><b>Email:</b> ' + esc(data.email) + '</li>' +
      '<li><b>Submission ID:</b> ' + esc(data.submissionId) + '</li>' +
      '<li><b>Timestamp:</b> ' + esc(timestamp.toISOString()) + '</li>' +
      '</ul>' +
      '<p><b>Message:</b><br>' + esc(String(data.message || '').replace(/\n/g, '<br>')) + '</p>',
  });
}
