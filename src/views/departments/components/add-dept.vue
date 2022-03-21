<template>
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
        <!-- 匿名插槽 -->
        <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
            <el-form-item label="部门名称" prop="name">
                <el-input style="width:80%" placeholder="1-50个字符" v-model="formData.name"/>
            </el-form-item>
            <el-form-item label="部门编码" prop="code">
                <el-input style="width:80%" placeholder="1-50个字符" v-model="formData.code"/>
            </el-form-item>
            <el-form-item label="部门负责人" prop="manager">
                <!-- <el-select style="width:80%" placeholder="请选择" v-model="formData.manager" @focus="getEmployeeSimple"/>
                    <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username"></el-option>
                </el-select> -->
                 <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
                    <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
                    <!-- 注意  </el-option>  不 需要这个，否则会报错 -->
                    <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
                </el-select>
            </el-form-item>
            <el-form-item label="部门介绍" prop="introduce">
                <el-input style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" v-model="formData.introduce"/>
            </el-form-item>
        </el-form>
        <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
        <el-row slot="footer" type="flex" justify="center">
            <el-col :span='18' class="dialog-footer">
                <el-button type="primary" size="small" @click="btnOk">确定</el-button>
                <el-button size="small" @click="btnCancel">取消</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
import {getDepartments,getDepartDetail} from '@/api/departments'
import {getEmployeeSimple} from '@/api/employees'
export default {
    name: '',
    props:{
        showDialog:{
            type: Boolean,
            default: false
        },
        treeNode:{
            type: Object,
            default: null
        },
        
    },
    data(){
        // 检查部门是否重复
        const checkNameRepeat = async(rule,value,callback) =>{
            // value 是部门名称 要去和同级部门下的部门比较 有没有相同的 有的话不放过 没有就可以过
            const {depts} = await getDepartments()
            //  检查重复规则 需要支持两种 新增模式 / 编辑模式
            // depts是所有的部门数据
            // 如何去找技术部所有的子节点
            let isRepeat = false
            if(this.formData.id){
                // 有id就是编辑模式
                // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
                isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
            }else{
                // 找到同级部门的所有子部门
                // 没id就是新增模式
                isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item =>item.name === value)
            }
            
            // 为 true 说明找到了一样的名字
            isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)):callback()
        }
        // 检查编码重复性
        const checkCodeRepeat = async(rule, value, callback) => {
            // 先要获取最新的组织架构数据
            const { depts } = await getDepartments()
            let isRepeat = false
            if (this.formData.id) {
                // 编辑模式  因为编辑模式下 不能算自己
                isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
            }else{
                // 新增模式
                isRepeat = depts.some(item => item.code === value && value )// 这里加一个 value不为空 因为我们的部门有可能没有code
            }
            
            isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
        }
        return{
            formData:{
                name:'',
                code:'',
                manager:'',
                introduce:'', 
            },
            rules:{
                name:[{required:true,message:'部门名称不能为空',trigger:'blur'},
                    {min:1,max:50,message:'部门名称要求1-50个字符',trigger:'blur'},{
                    trigger:'blur',
                    validator:checkNameRepeat // 自定义函数的形式校验
                        
                    }],
                code:[{required:true,message:'部门编码不能为空',trigger:'blur'},
                    {min:1,max:50,message:'部门编码要求1-50个字符',trigger:'blur'},{
                        trigger:'blur',
                        validator:checkCodeRepeat
                    }],
                manager:[{required:true,message:'部门负责人不能为空',trigger:'blur'},
                    {}],
                introduce:[{required:true,message:'部门介绍不能为空',trigger:'blur'},
                    {min:1,max:300,message:'部门介绍要求1-300个字符',trigger:'blur'}], 
            },
            peoples:[],

            
        }
    },
    methods:{
        async getEmployeeSimple(){
            this.peoples = await getEmployeeSimple()
            // console.log(this.peoples)
        },
        btnOk(){
            this.$refs.deptForm.validate(async isOk => {
                if(isOk){
                    // 表示可以提交了
                    // 调用新增接口 添加父部门的id
                    // 分清楚现在是编译还是新增
                    if (this.formData.id){
                        // await updateDepartments(this.formData)
                        console.log('部门修改成功了')
                    }else{
                        // 新增模式
                        // await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
                        console.log('部门添加成功了')
                    }
                    
                    
                    // 告诉父组件 更新父组件
                    this.$emit('addDepts') 
                    // 子组件 update:固定写法 (update:props名称, 值)
                    this.$emit('update:showDialog',false)

                }
            })
        },
        btnCancel(){
            // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
            this.formData = {
                name: '',
                code: '',
                manager: '',
                introduce: ''
            }
            this.$refs.deptForm.resetFields()// 重置校验字段
            this.$emit('update:showDialog',false)


        },
        async getDepartDetail(id){
            this.formData = await getDepartDetail(id)
        }
        

    },
    computed:{
        showTitle(){
            return this.formData.id ? '编辑部门' : '新增子部门'
        }
    }

}
</script>

