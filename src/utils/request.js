import axios from 'axios'
import {Message} from 'element-ui'
const service = axios.create({
    // 如果执行 npm run dev  值为 /api 正确  /api 跨域代理
    // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,
})

service.interceptors.request.use()
// 响应拦截器
service.interceptors.response.use(response =>{
    console.log(response)
    const {success,message,data} = response.data
    // 要根据success的成功与否决定下面的操作
    if(success){
        return data
    }else{
        // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
        Message.error(message)
        return Promise.reject(new Error(message))
    }
},error=>{
    // 提示错误信息
    Message.error(error.message)
    // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
    return Promise.reject(error)
})


export default service