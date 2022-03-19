// 权限拦截再路由跳转 导航守卫
import router from '@/router'
import store from '@/store' // 和组件中的this.$store一样
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 不需要导出 export暴露 mian.js 中直接import 了
// 前置守卫
// next 是前置守卫必须要执行的钩子 next 必须执行 不执行 页面就死了
// next() 放过
// next（false） 跳转终止
// next（地址） 跳转到指定地址
const whiteList = ['/login','/404']
router.beforeEach((to,from,next)=>{
    nprogress.start() //开启进度条
    if(store.getters.token){
        // 有 token
        if (to.path === '/login'){
            next('/')
        }else{
            next()
        }
    }else{
        // 没 token
        if(whiteList.indexOf(to.path)>-1){
            // 去的地方在白名单上
            next()
        }else{
            next('/login')
        }
    }
    nprogress.done() //解决手动切换地址 进度条不关闭的问题
})

router.afterEach(()=>{
    nprogress.done()
})