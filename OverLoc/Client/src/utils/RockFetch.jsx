import { getHeaders } from './Global';

const cache = {};

export function ClearCache(url) {
  cache[url] = undefined;
}

// fetcher is simple function without hooks for situations where we dont need component refresh
export async function fetcher(
  url,
  method,
  body,
  asJson = false,
  forceFetch = false,
) {
  url = 'http://localhost:4051' + url;
  if (cache[url] && !forceFetch) {
    console.log('Returning from cache :', url);
    return cache[url].clone();
  }

  if (cache[url])
    console.log('Url in cache but not utilized! ', url)

  const headers = getHeaders();
  const response = await fetch(url, {
    method: method || 'get',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers,
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: toJson(body),
  });

  switch (response.status) {
    case 201:
    case 200:
      // if (method !== "POST") // dont cache POST request
      //   cache[url] = await response.clone(); // we dont save json response as Model.ts needs raw data 

        const responseJson = await response.json();
        return responseJson;
      break;
    case 401:
      return null;
      break;
    case 403:
    case 440:
    case 441:
    case 442:
      //const violation = response.headers.get('Licese Violation');
      if (asJson) {
        const responseJson = await response.json();
        return responseJson;
      }
      return response;
      break;
    case 500:
      return null;
      break;

    default:
      return null;
  }

  // if (response.status === 401) {
  //   // window.location.href = '/login'; //relative to domain
  //   history.push('/login');
  //   return null;
  // }
  // if (response.status === 500) {
  //   // window.location.href = '/login'; //relative to domain
  //   // history.push('/error')
  //   return null;
  // }
  // if (response.status === 200) {
  //   if(method !== "POST" ) // dont cache POST request
  //     cache[url] = await response.clone(); // we dont save json response as Model.ts needs raw data 

  //   if (asJson) {
  //     const responseJson = await response.json();
  //     return responseJson;
  //   } return response;
  // }

  //return null;
}

function toJson(str) {
  try {
    JSON.parse(str);
    return str
  } catch (e) {
    return JSON.stringify(str)
  }
}

// export async function refreshToken() {
//   const headers = getHeaders();
//   const refrestUrl = 'api/Authentication/refresh'
//     const token = Cookies.get('token')
//     const rToken = Cookies.get('refreshToken')
//     if (token === undefined || rToken === undefined)
//       return;
//     const refreshTokenBody = {
//       jwtToken: token,
//       refreshToken: rToken,
//     }
//     const refreshResponse = await fetch(refrestUrl, {
//       method: 'post',
//       mode: 'cors', // no-cors, *cors, same-origin
//       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//       credentials: 'same-origin', // include, *same-origin, omit
//       headers,
//       redirect: 'follow', // manual, *follow, error
//       referrerPolicy: 'no-referrer', // no-referrer, *client
//       body: JSON.stringify(refreshTokenBody),
//     });
//     if (refreshResponse.status === 200) {
//       const resp = await refreshResponse.clone().json();
//       if (resp !== null) {
//         Cookies.set('token', resp.jwtToken)
//         Cookies.set('refreshToken', resp.refreshToken)
//       }
//     }
// }

// generic hooks version for all request types
export function useRockFetch() {
  async function load(url, method, body, forceFetch = false) {
    const response = await fetcher(url, method, body, true, forceFetch);
    if (response) {
      //  const resp = await response.clone().json();
      return response;
    }
    return null;
  }
  return [load];
}

// DEPRECATED
export default function useRockFetchGet() {
  return useRockFetch();
}

// DEPRECATED
export function useRockFetchPost() {
  async function load(url, body) {
    const response = await fetcher(url, 'post', body, false, true);
    if (response) {
      // const resp = await response.clone().json();
      return response;
    }
    return null;
  }
  return [load];
}
