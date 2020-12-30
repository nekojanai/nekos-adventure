const dialogPolyfill = require('dialog-polyfill')
const button = document.createElement('button');
button.innerText = 'sayy hello!';
button.onclick = function() {
  const dialog = document.createElement('dialog');
  dialog.open = true;
  dialog.innerHTML = 'A winrar is you!';
  document.body.appendChild(dialog);
  dialogPolyfill.registerDialog(dialog);
};
document.body.appendChild(button);