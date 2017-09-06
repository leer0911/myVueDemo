import fetch from './fetch'

// --------------------------- 用户登录
export const apiLogin = (params) => { return fetch({ url: '/api/account/login', method: 'get', params: params }) }
