<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
          <el-tabs>
              <el-tab-pane label="登陆账号设置">
                  <!-- 放置表单 -->
                  <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
                      <el-form-item label="姓名" prop="username">
                          <el-input v-model="userInfo.username" style="width:300px"></el-input>
                      </el-form-item>
                       <el-form-item label="密码" prop="password2">
                          <el-input v-model="userInfo.password2" style="width:300px" type="password"></el-input>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary" @click="saveUser">更新</el-button>
                      </el-form-item>
                  </el-form>
              </el-tab-pane>
              <el-tab-pane label="个人详情">
                  <!-- <user-info /> -->
                  <!-- vuejs 中内置了一个组件 component 可以是任何组件  -->
                  <!-- 动态组件 可以实现动态切换组件  is必须是变量-->
                  <component :is="UserComponent" />
              </el-tab-pane>
              <el-tab-pane label="岗位信息" >
                  <component :is="JobComponent" />
              </el-tab-pane>
          </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getUserDetailById} from '@/api/user'
import {saveUserDetailById} from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
    components:{
        UserInfo,
        JobInfo

    },
    data(){
        return{
            UserComponent:'user-info', // 配合使用 component
            JobComponent:'job-info',
            userId:this.$route.params.id,
            userInfo:{
                username:'',
                password2:''
            },
            rules:{
                username:[{required: true, message: '姓名不能为空', trigger: 'blur'}],
                password2:[{required: true, message: '密码不能为空', trigger: 'blur'},
                {min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur'}]
            
            },
        }
    },
    created(){
        this.getUserDetailById()
    },
    methods:{
        async getUserDetailById(id){
            this.userInfo = await getUserDetailById(this.userId)
            
        },
        async saveUser(){
            try{
                await this.$refs.userForm.validate()
                // 将新密码的值替换原密码的值
                // await saveUserDetailById({...this.userInfo,password:this.userInfo.password2})
                this.$message.success('保存成功')
            }catch(error){
                console.log(error)
            }
            
        }
    }
}   
</script>

<style>

</style>
