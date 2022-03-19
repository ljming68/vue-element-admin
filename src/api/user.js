import request from '@/utils/request'

/**
 * 登录接口封装
 * @param {*} data 
 */
export function login(data) {
    // 返回一个promise 对象
    return request({
        url: '/sys/login',
        method:'post',
        data //  data:data  Es6 可以简写
    })
}

export function getInfo(token) {
 
}

export function logout() {
  
}
