<template>
  <el-row type="flex" justify="space-between" align="middle" style="height:40px;width: 100%">
    <el-col>
      <!-- 左侧内容 -->
      <span>{{treeNode.name}}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{treeNode.manager}}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>
              操作
              <i class="el-icon-arrow-down"></i>
            </span>
            <!--具名插槽  -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>


<script>
import { delDepartments } from '@/api/departments';
export default {
  name: "",
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    treeNode: {
      type: Object,
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //  点击 编辑 删除 新增 时触发
    operateDepts(command) {
      if (command === "add") {
        this.$emit('addDepts',this.treeNode)
      } else if (command === "edit") {
        this.$emit('editDepts',this.treeNode)
      } else {
        // 删除 
        this.$confirm('确定要删除该部门吗','删除部门',{cancelButtonText:'取消',confirmButtonText:'确定'}).then(()=>{
            // 如果点击了确定就会进入then
            return delDepartments(this.treeNode.id)
        }).then(()=>{
            //  如果删除成功了  就会进入这里
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    },
  }
};
</script>


