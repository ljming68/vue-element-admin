<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
      <el-checkbox-group v-model="roleIds">
           <!-- 选项 -->
           <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
               {{item.name}}
           </el-checkbox>
      </el-checkbox-group>
      <el-row type="flex" justify="center">
          <el-col :span="6">
              <el-button type="primary" size="small" @click="btnOK">确定</el-button>
              <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
      </el-row>
  </el-dialog>
</template>

<script>
import {getRoleList} from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import {assignRoles} from '@/api/employees'
export default {
  name: '',
  props:{
      showRoleDialog:{
          type:Boolean,
          default:false
      },
      userId:{
          type:String,
          default:null
      }
  },
  data(){
      return{
          list:[], //角色列表
          roleIds: []
      }
  },
  created(){
      this.getRoleList()
  },
  methods:{
      async getRoleList(){
        const { rows } = await getRoleList()
        
        this.list = rows
        console.log(this.list)
      },
      async getUserDetailById(id) {
        const { roleIds } = await getUserDetailById(id)
        this.roleIds = roleIds // 赋值本用户的角色
      },
      async btnOK() {
        // await assignRoles({ id: this.userId, roleIds: this.roleIds })
        //   关闭窗体
        this.$emit('update:showRoleDialog', false)
      },
      btnCancel() {
        this.roleIds = [] // 清空原来的数组
        this.$emit('update:showRoleDialog', false)
      }
  }
}
</script>

<style lang="less" scoped>

</style>
