import store from '@/store'
// 做一个混入对象
export default{
    // 混入对象是组件的选项对象
    methods:{
        // 检查权限 
        checkPermission(key){
            const { userInfo } = store.state.user
            if (userInfo.roles.points && userInfo.roles.points.length) {
                return userInfo.roles.points.some(item => item === key)
            }
            return false
        }
    }
}