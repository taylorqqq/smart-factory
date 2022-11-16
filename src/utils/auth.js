import Cookies from 'js-cookie'

const TokenKey = 'X-Hengtao-Admin-Token'

export function getToken() {
  // return "safs";
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
