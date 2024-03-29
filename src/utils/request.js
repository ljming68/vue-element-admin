import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store'
import {getTimeStamp} from '@/utils/auth'
import router from '@/router'
const TimeOut = 36000000000000 // 定义超时时间 3600

const service = axios.create({
    // 如果执行 npm run dev  值为 /api 正确  /api 跨域代理
    // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,
})
// 请求拦截器
service.interceptors.request.use(config=>{
    // config 是请求配置信息
    // 注入 token
    if(store.getters.token){
        // 只有在有token的情况下 才有必要去检查时间戳是否超时
        if(IsCheckTimeOut()){
            store.dispatch('user/logout')
            router.push('/login')
            return Promise.reject(new Error('token超时了'))
        }
        // 如果token存在 注入token
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置

},error=>{
    return Promise.reject(error)
})
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
     // error 信息 里面 response的对象
    if (error.response && error.response.data && error.response.data.code === 10002){
         // 当等于10002的时候 表示 后端告诉我token超时了
        store.dispatch('user/logout') // 登出action 删除token
        router.push('/login')
    }else{
        // 提示错误信息
        Message.error(error.message)
        
    }
    // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
    return Promise.reject(error)
})

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut(){
    var currentTime = Date.now() // 当前时间戳
    var timeStamp = getTimeStamp() // 缓存时间戳
    return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service