document.getElementById('generateBtn').addEventListener('click', generatePassword);
document.getElementById('clearClipboardBtn').addEventListener('click', clearClipboard);

function generatePassword() {
  const mainKey = document.getElementById('mainKey').value;
  const siteKey = document.getElementById('siteKey').value;

  if (!mainKey || !siteKey) {
    alert('Please enter both Main Key and Site Key.');
    return;
  }

  const password = derivePassword(mainKey, siteKey);

  copyToClipboard(password);
}

function derivePassword(mainKey, siteKey) {
  const hashedSiteKey = simpleHash(siteKey);
  const combinedKey = hashedSiteKey + mainKey;
  return simpleHash(combinedKey);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Action confirmed!');
  });
}

function clearClipboard() {

  navigator.clipboard.writeText('').then(() => {
    alert('Clipboard cleared!');
  });

  document.getElementById('mainKey').value = '';
  document.getElementById('siteKey').value = '';
}
