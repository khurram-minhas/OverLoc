

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
export function getWeeksInMonths(weeksInMonth) {
  const splittedWeeks = weeksInMonth.split(',');
  var filteredWeeks = ['1','2','3','4'].filter(function(obj) { return splittedWeeks.indexOf(obj) == -1; });
  let str = '';
  filteredWeeks.map(w=> str += w + ', ');
  str = str.substring(0, str.length - 2);
  return str;
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

export function TextAbstract(text, length = 200) {
  if (text == null) {
      return "";
  }
  if (text.length <= length) {
      return text;
  }
  text = text.substring(0, length);
  let last = text.lastIndexOf(" ");
  text = text.substring(0, last);
  return text + "...";
}