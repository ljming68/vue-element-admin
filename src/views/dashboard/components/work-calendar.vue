<template>
  <div>
      <el-row type="flex" justify="end">
        <el-select v-model="currentYear" size="small" style="width: 120px" >
            <el-option v-for="item in yearList" :key="item" :label="item" :value="item">{{ item }}</el-option>
        </el-select>
        <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" >
            <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{ item }}</el-option>
        </el-select>
      </el-row>
      <el-calendar />

  </div>
</template>

<script>
export default {
  name: '',
  props:{
      startDate:{
          type:Date,
          default:()=>{
              return new Date()
          }
      }
  },
  data(){
      return{
          yearList:[],
          currentYear:null,
          currentMonth:null,
      }
  },
  created(){
      this.currentYear = this.startDate.getFullYear() //得到当前的年份
      this.currentMonth = this.startDate.getMonth() + 1
    //  快速生成数组的方法
    this.yearList = Array.from(Array(11),(v,i) => this.currentYear + i - 5 )


  }
}
</script>

<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
