<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{page.total}}条记录</span>
        <template v-slot:after>
          <el-button size="small" type="warning" >excel导入</el-button>
          <el-button size="small" type="danger" >excel导出</el-button>
          <el-button size="small" type="primary" >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column :formatter="formatEmployment" prop="formOfEmployment" label="聘用形式" sortable="" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="" >
          <!-- 作用域插槽 -->
            <template slot-scope="obj">
              
              {{obj.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="" >
            <template slot-scope="{row}">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="center" align="middle" style="height:60px">
          <el-pagination 
            layout="prev, pager, next" 
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change ="changePage"

          />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getEmployeeList} from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
export default {
  data(){
    return{
      list:[],
      page:{
        page:1,
        size:10,
        total:0
      }
    }
  },
  created(){
    this.getEmployeeList()
  },
  methods:{
    async getEmployeeList(){
      const {total,rows} = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
    
    },
    changePage(newPage){
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index){
      // 找1 对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    }
  },

}
</script>

<style>

</style>
