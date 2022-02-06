

import Cookies from 'js-cookie';
export const history = () => {
  
};
export function getHeaders() {
  const cookieToken = Cookies.get('token');
  const token = cookieToken;
  let headers = { 'Content-Type': 'application/json' };
  if (token) headers['x-access-token'] = token;
  headers['Access-Control-Allow-Origin'] = '*';
  return headers;
}
export function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
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
  return val === '' || val === null || val === undefined;
}

export function clearCookies() {
  Cookies.remove('userTypeId');
  Cookies.remove('userId');
  Cookies.remove('token');
}