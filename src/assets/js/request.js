import axios from 'axios'
import { Message,MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router'
// import { getToken ,getCurrentRoleCode} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 500000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    res.ok = res.ok === 'false' || !res.ok ? false : true
    if (res.code != '200') {
      if (res.msg) {
        // Message({
        //   message: res.msg,
        //   type: 'error',
        //   duration: 2 * 1000
        // })
      }
      // 未登录res.code === '-1' ||
      if ( res.code == 401) {
        router.replace('/error');
       
      }
      return response
    } else {
      return response
    }
  },
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    if (error.msg) {
      Message({
        message: error.msg,
        type: 'error',
        duration: 2 * 1000
      })
    } else {
      Message({
        message: error,
        type: 'error',
        duration: 2 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service

