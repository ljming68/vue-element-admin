import {getToken,setToken,removeToken} from '@/utils/auth'
import {login} from '@/api/user'
// 状态
const state = {
  token : getToken() // 设置token 为共享状态 初始化vuex 的时候 就先从缓存中读
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
  }
}
// 执行异步
const actions = {
  async login(context,data){
    // // 实际上就是一个promise  result就是执行的结果
    const result = await login(data)
    // axios默认给数据加了一层data  request 中结解构出了 data
    // if(result.data.success){
    //   context.commit('setToken', result.data.data)
    // }
    context.commit('setToken', result)

  }
}

export default{
  namespaced:true,
  state,
  mutations,
  actions
}