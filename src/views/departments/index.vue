<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容 -->
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts"/>
        <!-- 树形组件 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
           <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts"/>
        </el-tree>
        <!-- 新增部门 -->
        <add-dept ref="addDept" :showDialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments"/>

      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import {getDepartments} from '@/api/departments'
import {tranListToTreeData} from '@/utils/index'

import AddDept from './components/add-dept'
export default {
  components:{
    TreeTools,
    AddDept,
  },
  data(){
    return{
      company: {  },
      defaultProps:{
        label:'name', // 设置根节点 从这里开始显示内容
        children:'children' // 从这里开始找子节点
      },
      departs:[
        // { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        // { name: '行政部', manager: '刘备' },
        // { name: '人事部', manager: '孙权' }
      ],
      showDialog:false,
      node:{},
    }
  },
  created(){
    this.getDepartments()
  },
  methods:{
    async getDepartments(){
      const result = await getDepartments()
      // console.log(result)
      this.company = {name:result.companyName,manager: '负责人',id:''}
      this.departs = tranListToTreeData(result.depts, '')
      // this.departs = result.depts
    },

    addDepts(node){
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
      // console.log(node)
    },
    editDepts(node){
      this.showDialog = true
      this.node = node
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id

    }
  }

}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
