

import Cookies from 'js-cookie';
export const history = () => {
  
};
export function getHeaders() {
  const cookieToken = Cookies.get('token');
  const token = 'Bearer ' + cookieToken;
  let headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = token;
  headers['Access-Control-Allow-Origin'] = '*';
  return headers;
}
export function showSnackBar(text) {
  const x = document.getElementById('snackbar');
  if (!isNullOrUndefined(x)) {
    x.className = 'show';
    x.innerHTML = text;
    setTimeout(() => {
      x.className = x.className.replace('show', '');
    }, 3000);
  }
}
export function isNullOrUndefined(val) {
  return val == null || val == undefined;
}