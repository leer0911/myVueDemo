import axios from 'axios'
import Qs from 'qs'
import cookie from 'js-cookie'

// 创建axios实例
const USER_ID = cookie.get('userId')
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000,          // 请求超时时间
  headers: { 'userId': USER_ID },
  paramsSerializer (params) { // 过滤为空参数
    let obj = {}
    for (var i in params) {
      if (params[i] !== '') {
        obj[i] = params[i]
      }
    }
    return Qs.stringify(obj, { arrayFormat: 'brackets' })
  }
})

// respone拦截器
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  }
)

export default service
