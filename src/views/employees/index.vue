<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{page.total}}条记录</span>
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')" >excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData" >excel导出</el-button>
          <el-button icon="plus" size="small" type="primary" @click="showDialog = true" >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table  border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column width="120px"  label="头像" align="center">
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imgerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto "
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>

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
            <!-- <template slot-scope="{ row }"> -->
            <template v-slot="{row}">
              <el-button :disabled="!checkPermission('POINT-USER-UPDATE')" type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
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
    <!-- sync 修饰符  是 子组件 去改变父组件的数据的一个语法糖 -->
    <!-- 就不需要写 @update:showDialog -->
    <add-employees :showDialog.sync="showDialog" />
    <!-- 显示二维码 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 角色分配组件 -->
    <assign-role ref="assignRole" :showRoleDialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import {getEmployeeList,delEmployee} from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployees from './components/add-employee'
import {formatDate} from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role'
export default {
  components:{
    AddEmployees,
    AssignRole
  },
  data(){
    return{
      list:[],
      page:{
        page:1,
        size:10,
        total:0
      },
      loading:false,
      showDialog:false,
      showCodeDialog:false,
      showRoleDialog:false,
      userId:'',
      
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
    },
    // 删除
    async deleteEmployee(id){
      try{
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功')
      }catch(error){
        console.log(error)
      }
    },
    exportData(){
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel =>{
        const {rows} = await getEmployeeList({page:1,size:this.page.total})
        const data = this.formatJson(headers, rows)
        // console.log(rows,data)
        // debugger
        excel.export_json_to_excel({
          header:Object.keys(headers),
          data,
          filename:'员工信息表',
          autoWidth:true,
          bookType:'xlsx'
        })
      })
    },
    formatJson(headers, rows){
       // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
     
      return rows.map(item => {
        return Object.keys(headers).map(key =>{
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          }else if(headers[key] === 'formOfEmployment'){
            var en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        })
      })


      // 上面代码可以简写
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    },
    showQrCode(url){
      console.log(url)
      if(url){
        this.showCodeDialog = true
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      }else{
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole(id){
      this.userId = id // props传值 是异步的
      await this.$refs.assignRole.getUserDetailById(id) // 父组件调用子组件方法
      this.showRoleDialog = true
    }
  },

}
</script>

<style>

</style>
