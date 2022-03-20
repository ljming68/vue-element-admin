import {getToken,setToken,removeToken,setTimeStamp} from '@/utils/auth'
import {login,getUserInfo,getUserDetailById} from '@/api/user'
// 状态
const state = {
  token : getToken(), // 设置token 为共享状态 初始化vuex 的时候 就先从缓存中读
  userInfo:{}, // 设置成null 使用 null.name 会报错
}
// 修改状态
const mutations = {
  setToken(state,token){
    state.token = token 
    // 同步缓存
    setToken(token)
  },
  removeToken(state){
    state.token = null
    // 同步缓存
    removeToken() 
  },
 // 设置用户信息
  setUserInfo(state,result){
    state.userInfo = result // 是响应式
    // state.userInfo = {...result} // 是响应式 属于浅拷贝
    // state.userInfo['username'] = result  这种不是响应式的
  },
  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 登录接口
  async login(context,data){
    // // 实际上就是一个promise  result就是执行的结果
    const result = await login(data)
    // axios默认给数据加了一层data  request 中结解构出了 data
    // if(result.data.success){
    //   context.commit('setToken', result.data.data)
    // }
    context.commit('setToken', result)
    setTimeStamp() // 将当前的最新时间写入缓存

  },
  // 获取用户信息
  async getUserInfo(context){
    const result = await getUserInfo()
    // 获取用户详情信息
    const baseInfo = await getUserDetailById(result.userId)
    const obj = {...result,...baseInfo}
    console.log("用户详细信息",obj)
    context.commit('setUserInfo',obj)
    return result  // 这里是后期给做权限留下的伏笔
  },
  // 退出登录
  logout(context){
    context.commit('removeToken')
    context.commit('reomveUserInfo')

  }
  
}

export default{
  namespaced:true,
  state,
  mutations,
  actions
}