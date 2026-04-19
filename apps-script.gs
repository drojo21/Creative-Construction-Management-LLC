/**
 * Creative Construction Management LLC — Lead Capture v2
 * ROC 355392 · KB-1 Dual Building Contractor
 *
 * Handles: form submission → Google Sheet + email to owner + auto-reply to customer.
 * Also supports a daily 8am summary email.
 *
 * SETUP (one-time, ~10 minutes):
 *  1. Go to https://script.google.com → "New project".
 *  2. Delete any starter code, paste this entire file.
 *  3. Click Save. Name the project: "Creative Construction Lead Capture".
 *  4. From the function dropdown, select `setupSheet` → click Run.
 *     Authorize when prompted. This creates the formatted "Leads" spreadsheet.
 *  5. Select `testSubmission` → click Run. Confirm you get:
 *        - A test row in the new spreadsheet
 *        - A test owner-notification email at ccmanagementaz@gmail.com
 *        - A test auto-reply email at ccmanagementaz@gmail.com
 *  6. Click Deploy → New deployment → Type: Web app
 *        Execute as: Me | Who has access: Anyone | Deploy.
 *     Copy the Web app URL.
 *  7. Open index.html, find: const GOOGLE_SHEET_URL = 'TBD';
 *     Replace 'TBD' with the URL from step 6. Save and redeploy the site.
 *  8. (Optional) Enable daily 8am summary: Triggers → Add Trigger →
 *     Function: sendDailySummary | Time-driven | Day timer | 8am-9am.
 */

const CONFIG = {
  SHEET_NAME: 'Leads',
  NOTIFICATION_EMAIL: 'ccmanagementaz@gmail.com',
  BUSINESS_NAME: 'Creative Construction Management LLC',
  BUSINESS_PHONE: '(520) 273-9295',
  BUSINESS_PHONE_TEL: '+15202739295',
  ROC_NUMBER: '355392',
  LICENSE_CLASS: 'KB-1 Dual Building Contractor',
  OWNER_FIRST_NAME: 'Jesus',
  AUTO_REPLY: true,
  DAILY_SUMMARY: true,
  TIMEZONE: 'America/Phoenix'
};

const HEADERS = ['Timestamp', 'Name', 'Phone', 'Email', 'Service Type', 'Project Description', 'Timeline', 'City', 'Status', 'Notes', 'Source'];

// ===== Web app handlers =====

function doGet() {
  return ContentService.createTextOutput('Creative Construction Management · ROC 355392 · Lead capture endpoint live.').setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    sheet.appendRow([
      new Date(), data.name || '', data.phone || '', data.email || '',
      data.service || '', data.message || '', data.timeline || '',
      data.city || '', 'New', '', data.source || 'website'
    ]);
    if (CONFIG.AUTO_REPLY && data.email) sendAutoReply(data);
    sendNotificationEmail(data);
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error('Lead capture error:', err);
    try {
      MailApp.sendEmail({
        to: CONFIG.NOTIFICATION_EMAIL,
        subject: '[Website] Lead capture ERROR — check Apps Script logs',
        body: 'Error: ' + err.message + '\n\nRaw payload:\n' + ((e && e.postData && e.postData.contents) || 'no payload')
      });
    } catch (_) {}
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== Sheet setup =====

function setupSheet() {
  const ss = SpreadsheetApp.create('Creative Construction Management — Leads');
  const sheet = ss.getActiveSheet();
  sheet.setName(CONFIG.SHEET_NAME);

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length).setBackground('#1f2937').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);

  const widths = [160, 140, 130, 220, 180, 360, 130, 100, 110, 260, 100];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Contacted', 'Quoted', 'Won', 'Lost', 'Follow-up'], true)
    .setAllowInvalid(false).build();
  sheet.getRange(2, 9, sheet.getMaxRows() - 1, 1).setDataValidation(statusRule);

  const statusRange = sheet.getRange('I2:I1000');
  const rules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('New').setBackground('#dbeafe').setFontColor('#1e40af').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Won').setBackground('#d1fae5').setFontColor('#065f46').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Lost').setBackground('#fee2e2').setFontColor('#991b1b').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Quoted').setBackground('#fef3c7').setFontColor('#92400e').setRanges([statusRange]).build()
  ];
  sheet.setConditionalFormatRules(rules);

  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  Logger.log('Sheet created: ' + ss.getUrl());
  return ss.getUrl();
}

function getOrCreateSheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id).getSheetByName(CONFIG.SHEET_NAME);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active.getSheetByName(CONFIG.SHEET_NAME) || active.getActiveSheet();
  setupSheet();
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')).getSheetByName(CONFIG.SHEET_NAME);
}

// ===== Owner notification email =====

function sendNotificationEmail(data) {
  const timeline = (data.timeline || '').toLowerCase();
  let urgency = { label: 'STANDARD', color: '#3b82f6', bg: '#dbeafe' };
  if (timeline.indexOf('asap') !== -1) urgency = { label: 'ASAP', color: '#dc2626', bg: '#fee2e2' };
  else if (timeline.indexOf('1-3') !== -1 || timeline.indexOf('1 - 3') !== -1) urgency = { label: 'SOON', color: '#d97706', bg: '#fef3c7' };

  const subject = '[' + urgency.label + '] New Lead: ' + (data.name || 'Unknown') + ' — ' + (data.service || 'Project');
  const phoneDigits = (data.phone || '').replace(/\D/g, '');
  const phoneLink = phoneDigits ? 'tel:+1' + phoneDigits : '#';

  const html = '<!DOCTYPE html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;max-width:600px;margin:0 auto;">'
    + '<div style="background:' + urgency.color + ';color:#fff;padding:20px 24px;">'
    + '<div style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;opacity:.85;">Priority · ' + urgency.label + '</div>'
    + '<h2 style="margin:4px 0 0;font-size:22px;">New Lead from Website</h2></div>'
    + '<div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:none;">'
    + '<table style="width:100%;border-collapse:collapse;font-size:15px;color:#1f2937;">'
    + row('Name', '<strong>' + esc(data.name) + '</strong>')
    + row('Phone', '<a href="' + phoneLink + '" style="color:#3b82f6;text-decoration:none;">' + esc(data.phone) + '</a>')
    + row('Email', '<a href="mailto:' + esc(data.email) + '" style="color:#3b82f6;text-decoration:none;">' + esc(data.email) + '</a>')
    + row('Service', esc(data.service))
    + row('Timeline', '<span style="display:inline-block;padding:3px 10px;background:' + urgency.bg + ';color:' + urgency.color + ';border-radius:4px;font-size:13px;font-weight:600;">' + esc(data.timeline || '—') + '</span>')
    + row('City', esc(data.city || '—'))
    + '</table>'
    + '<div style="margin-top:20px;padding:16px;background:#f9fafb;border-left:4px solid ' + urgency.color + ';border-radius:4px;">'
    + '<div style="font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">Project details</div>'
    + '<div style="font-size:15px;line-height:1.6;color:#1f2937;white-space:pre-wrap;">' + esc(data.message || '—') + '</div></div>'
    + '<div style="margin-top:24px;text-align:center;">'
    + '<a href="' + phoneLink + '" style="display:inline-block;padding:12px 20px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:0 4px;">Call ' + esc(data.name || 'Customer') + '</a>'
    + '<a href="mailto:' + esc(data.email) + '" style="display:inline-block;padding:12px 20px;background:#1f2937;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:0 4px;">Email Reply</a>'
    + '</div></div>'
    + '<div style="padding:16px 24px;color:#9ca3af;font-size:12px;text-align:center;">'
    + CONFIG.BUSINESS_NAME + ' · ROC ' + CONFIG.ROC_NUMBER + ' · ' + CONFIG.BUSINESS_PHONE + '<br/>'
    + 'Submitted ' + new Date().toLocaleString('en-US', { timeZone: CONFIG.TIMEZONE })
    + '</div></body></html>';

  MailApp.sendEmail({
    to: CONFIG.NOTIFICATION_EMAIL,
    subject: subject,
    htmlBody: html,
    replyTo: data.email || CONFIG.NOTIFICATION_EMAIL
  });
}

function row(label, value) {
  return '<tr><td style="padding:8px 0;width:110px;color:#6b7280;">' + label + '</td><td style="padding:8px 0;">' + value + '</td></tr>';
}

// ===== Customer auto-reply =====

function sendAutoReply(data) {
  const firstName = esc((data.name || '').split(' ')[0] || 'there');
  const service = esc((data.service || 'project').toLowerCase());
  const city = data.city ? ' in ' + esc(data.city) : '';

  const html = '<!DOCTYPE html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;max-width:600px;margin:0 auto;">'
    + '<div style="background:#1f2937;color:#fff;padding:28px 24px;text-align:center;">'
    + '<div style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;opacity:.75;margin-bottom:6px;">' + CONFIG.BUSINESS_NAME + '</div>'
    + '<h2 style="margin:0;font-size:22px;font-weight:700;">Thanks, ' + firstName + '.</h2></div>'
    + '<div style="padding:28px 24px;background:#fff;border:1px solid #e5e7eb;border-top:none;color:#1f2937;font-size:15px;line-height:1.65;">'
    + '<p>We received your ' + service + ' request' + city + ' and will reach out within <strong>one business day</strong> to schedule a walkthrough and get you a written estimate.</p>'
    + '<p>If it\'s urgent, feel free to call me directly at <a href="tel:' + CONFIG.BUSINESS_PHONE_TEL + '" style="color:#3b82f6;">' + CONFIG.BUSINESS_PHONE + '</a>.</p>'
    + '<div style="margin:24px 0;padding:16px;background:#f9fafb;border-radius:8px;font-size:13px;color:#6b7280;">'
    + '<strong style="color:#1f2937;display:block;margin-bottom:6px;">What happens next</strong>'
    + '1. We review your request today or tomorrow morning<br/>'
    + '2. We call or email to ask a few quick questions<br/>'
    + '3. We schedule a free on-site walkthrough<br/>'
    + '4. You get a written, line-item estimate within 3–5 days</div>'
    + '<p style="margin-top:24px;">Thanks again,<br/><strong>' + CONFIG.OWNER_FIRST_NAME + '</strong><br/>'
    + '<span style="color:#6b7280;font-size:13px;">' + CONFIG.BUSINESS_NAME + '<br/>AZ ROC ' + CONFIG.ROC_NUMBER + ' · ' + CONFIG.LICENSE_CLASS + '</span></p>'
    + '</div>'
    + '<div style="padding:14px 24px;color:#9ca3af;font-size:12px;text-align:center;background:#f9fafb;">'
    + CONFIG.BUSINESS_NAME + ' · Tucson, AZ · ' + CONFIG.BUSINESS_PHONE
    + '</div></body></html>';

  MailApp.sendEmail({
    to: data.email,
    subject: 'Thanks for contacting ' + CONFIG.BUSINESS_NAME + ' — we\'ve got your request',
    htmlBody: html,
    replyTo: CONFIG.NOTIFICATION_EMAIL,
    name: CONFIG.BUSINESS_NAME
  });
}

// ===== Daily 8am summary =====

function sendDailySummary() {
  if (!CONFIG.DAILY_SUMMARY) return;
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return;

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  let newLeads = 0, totalOpen = 0;
  const statusCounts = { New: 0, Contacted: 0, Quoted: 0, Won: 0, Lost: 0, 'Follow-up': 0 };
  const recent = [];

  for (let i = 1; i < data.length; i++) {
    const ts = data[i][0], status = data[i][8];
    if (status in statusCounts) statusCounts[status]++;
    if (ts instanceof Date && ts > yesterday) {
      newLeads++;
      recent.push({ name: data[i][1], phone: data[i][2], service: data[i][4], timeline: data[i][6] });
    }
    if (status && status !== 'Won' && status !== 'Lost') totalOpen++;
  }

  if (newLeads === 0 && totalOpen === 0) return;

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: CONFIG.TIMEZONE });
  const recentRows = recent.map(function(l) {
    return '<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;">' + esc(l.name) + '</td>'
      + '<td style="padding:8px;border-bottom:1px solid #e5e7eb;">' + esc(l.phone) + '</td>'
      + '<td style="padding:8px;border-bottom:1px solid #e5e7eb;">' + esc(l.service) + '</td>'
      + '<td style="padding:8px;border-bottom:1px solid #e5e7eb;">' + esc(l.timeline) + '</td></tr>';
  }).join('') || '<tr><td colspan="4" style="padding:12px;color:#9ca3af;text-align:center;">No new leads in the last 24 hours.</td></tr>';

  const html = '<!DOCTYPE html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;max-width:640px;margin:0 auto;">'
    + '<div style="background:#1f2937;color:#fff;padding:24px;"><div style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;opacity:.75;">Daily Lead Summary</div>'
    + '<h2 style="margin:4px 0 0;font-size:20px;">' + dateStr + '</h2></div>'
    + '<div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:none;">'
    + '<div style="display:flex;gap:12px;margin-bottom:24px;">'
    + stat(newLeads, 'New · 24h', '#dbeafe', '#1e40af')
    + stat(totalOpen, 'Open pipeline', '#fef3c7', '#92400e')
    + stat(statusCounts.Won, 'Won · total', '#d1fae5', '#065f46')
    + '</div>'
    + '<h3 style="font-size:15px;color:#1f2937;margin:0 0 8px;">New leads in the last 24 hours</h3>'
    + '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
    + '<thead><tr style="background:#f9fafb;">'
    + '<th style="padding:8px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Name</th>'
    + '<th style="padding:8px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Phone</th>'
    + '<th style="padding:8px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Service</th>'
    + '<th style="padding:8px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Timeline</th></tr></thead>'
    + '<tbody>' + recentRows + '</tbody></table>'
    + '<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280;">'
    + 'Pipeline: New ' + statusCounts.New + ' · Contacted ' + statusCounts.Contacted + ' · Quoted ' + statusCounts.Quoted + ' · Follow-up ' + statusCounts['Follow-up']
    + '</div></div>'
    + '<div style="padding:14px;color:#9ca3af;font-size:11px;text-align:center;">' + CONFIG.BUSINESS_NAME + ' · ROC ' + CONFIG.ROC_NUMBER + '</div>'
    + '</body></html>';

  MailApp.sendEmail({
    to: CONFIG.NOTIFICATION_EMAIL,
    subject: 'Daily summary · ' + newLeads + ' new lead' + (newLeads === 1 ? '' : 's') + ' · ' + dateStr,
    htmlBody: html
  });
}

function stat(num, label, bg, color) {
  return '<div style="flex:1;padding:16px;background:' + bg + ';border-radius:8px;text-align:center;">'
    + '<div style="font-size:28px;font-weight:700;color:' + color + ';">' + num + '</div>'
    + '<div style="font-size:12px;text-transform:uppercase;color:' + color + ';letter-spacing:.08em;">' + label + '</div></div>';
}

// ===== Test =====

function testSubmission() {
  const testData = {
    name: 'Test Customer',
    phone: '(520) 555-0100',
    email: CONFIG.NOTIFICATION_EMAIL,
    service: 'Kitchen Remodel',
    timeline: '1-3 months',
    city: 'Tucson',
    message: 'This is a test lead submitted from the Apps Script editor. If you received this email and see a new row in the Leads sheet, everything is working.',
    source: 'test'
  };
  const response = doPost({ postData: { contents: JSON.stringify(testData) } });
  Logger.log('Test response: ' + response.getContent());
  Logger.log('Check ' + CONFIG.NOTIFICATION_EMAIL + ' for two test emails (owner notification + auto-reply)');
}

// ===== Helpers =====

function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
