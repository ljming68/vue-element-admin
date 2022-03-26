<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="姓名" prop="username">
              <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
              <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="入职时间" prop="timeOfEntry">
              <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
          </el-form-item>
          <el-form-item label="聘用形式" prop="formOfEmployment">
              <el-select  v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择" >
              <!-- 遍历只能遍历组件的数据 -->
                <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
              </el-select>
          </el-form-item>
          <el-form-item label="工号" prop="workNumber">
              <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="部门" prop="departmentName">
              <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
              <!-- 放置一个tree 组件 -->
              <el-tree
                v-if="showTree"
                v-loading="loading"
                :data="treeData"
                default-expand-all=""
                :props="{ label: 'name' }"
                @node-click="selectNode"
              />
          </el-form-item>
          <el-form-item label="转正时间" prop="correctionTime">
              <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
          </el-form-item>
      </el-form>
      <!-- footer 插槽 -->
      <template v-slot:footer>
          <el-row type="flex" justify="center">
              <el-col :span="18" class="dialog-footer">
                  <el-button size="small" @click="btnCancel">取消</el-button>
                  <el-button type="primary" size="small" @click="btnOK">确定</el-button>
              </el-col>
          </el-row>
      </template>
  </el-dialog>
</template>

<script>
import {getDepartments} from "@/api/departments"
import {tranListToTreeData} from "@/utils/index"
import EmployeeEnum from '@/api/constant/employees'
import {addEmployee} from '@/api/employees'

export default {
  name: '',
  props:{
      showDialog:{
          type:Boolean,
          default:false
      }
  },
    data(){
        return{
            EmployeeEnum,
            formData:{
                username: '',
                mobile: '',
                formOfEmployment: '',
                workNumber: '',
                departmentName: '',
                timeOfEntry: '',
                correctionTime: ''
            },
            rules:{
                username: [{required: true, message: '用户姓名不能为空', trigger: 'blur' },
                {min: 1, max: 4, message: '用户姓名为1-4位'}],
                mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, 
                {pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'}],
                formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
                workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
                departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
                timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }],
            },
            treeData:[], // 定义数组接收树形数据
            showTree:false,
            loading: false, // 控制树的显示或者隐藏进度条
        }
    },
    methods:{
        async getDepartments(){
            this.showTree = true
            this.loading = true
            // depts是数组  他需要转换成树形结构 才可以被 el-tree 显示
            const { depts } = await getDepartments()
            this.treeData = tranListToTreeData(depts,'')
            
            this.loading = false
            
        },
        selectNode(node){
            this.formData.departmentName = node.name
            console.log(this.formData)
            this.showTree = false
        },
        async btnOK(){
            try{
                await this.$refs.addEmployee.validate()
                // 校验成功
                // await addEmployee()
                console.log("员工添加成功")
                // 告诉父组件更新数据
                // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
                // this.$emit
                this.$parent.getEmployeeList()
                this.$parent.showDialog = false
                // 这里不用重置表单 是因为 关闭弹层触发了 close事件 close事件绑定了btnCancel方法
            }catch(error){
                console.log(error)
            }
        },
        btnCancel(){
            // 重置原来的数据
            this.formData = {
                username: '',
                mobile: '',
                formOfEmployment: '',
                workNumber: '',
                departmentName: '',
                timeOfEntry: '',
                correctionTime: ''
            }
            this.$refs.addEmployee.resetFields() // 重置校验结果
            // update：props名称 这样写的话 可以在父组件 直接使用sync 修饰符处理
            this.$emit('update:showDialog',false)
        },
    }
}
</script>

