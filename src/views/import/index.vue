<template>
    <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
    methods:{
        success({header,results}){
            debugger
            // // 如果是导入员工
            // const userRelations = {
            // '入职日期': 'timeOfEntry',
            // '手机号': 'mobile',
            // '姓名': 'username',
            // '转正日期': 'correctionTime',
            // '工号': 'workNumber'
            // }
            // const arr = []
            // results.forEach(item =>{
            //     const userInfo = {}
            //     Object.keys(item).forEach(key =>{
            //         userInfo[userRelations[key]] = item[key]
            //     })
            //     arr.push(userInfo)
            // })
            // // await importEmployee(arr)
            // console.log('导入成功',arr)
            // this.$router.back()
        }
    }
}
</script>

<style>

</style>