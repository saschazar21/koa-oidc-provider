export default `
const form = document.createElement('form');
form.setAttribute('method', 'POST');
form.setAttribute('action', '/login/finish');

function sendForm() {
  form.submit();
}

function parseHash(hash) {
  const obj = {};
  const hashString = hash.startsWith('#') ? hash.substring(1) : hash;
  const segments = hashString.split('&');
  segments.forEach((segment) => {
    const [key, value] = segment.split('=');
    obj[key] = value;
  });
  return obj;
}
if (window.location.hash) {
  const hash = parseHash(window.location.hash);
  Object.keys(hash).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = hash[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  sendForm();
}
`;
