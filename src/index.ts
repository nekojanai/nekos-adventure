import dialogPolyfill from 'dialog-polyfill';
import './style.scss';

const button = document.createElement('button');
button.innerText = 'ayy lmao';
button.addEventListener('click', function() {
  const dialog = document.createElement('dialog');
  const closeButton = document.createElement('button');
  closeButton.innerText = 'x';
  document.body.appendChild(dialog);
  dialog.appendChild(closeButton);
  dialog.innerHTML += 'A winrar is you!';
  dialogPolyfill.registerDialog(dialog);
  dialog.showModal();
  closeButton.addEventListener('click', function(){ dialog.close(); console.log('uwu')});
});
document.body.appendChild(button);