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
/**
 * 获取用户的基本资料
 * @param {*} token 
 */
export function getUserInfo(token) {
    return request({
        url: '/sys/profile',
        method:'post'
    })
 
}
/**
 * 根据用户id 获取用户资料
 */
export function getUserDetailById(id){
    return request({
        url: `/sys/user/${id}`
    })
}
export function logout() {
  
}

