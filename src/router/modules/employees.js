// 导出员工路由的规则
import Layout from "@/layout"
export default{
    // 路由规则
    path:'/employees', // 路由地址 /employees
    name:'employees', // 给模块的一级路由加一个name 属性 这个属性 后面会再做权限的时候用到
    component:Layout,
    children:[{
        // 二级路由 的path 为空的时候 此时她表示二级路由的默认路由
        path:'',
        component:()=>import('@/views/employees'),
        // 路由元信息  其实是一个存储数据的地方  可以放任何内容 
        meta:{
            title:'员工管理', //  左导航栏会读取这个属性
            icon: 'people'
        }
        },
        {
            path:'detail/:id?',  // ? 的含义是表示该参数可传可不穿   动态路由参数
            component:() =>import('@/views/employees/detail'),
            hidden:true, // 不在左侧菜单显示
            meta:{
                title:'员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
            }
        },
        {
            path:'print/:id?',
            component: () => import('@/views/employees/print'), // 按需加载
            hidden:true,
            meta:{
                title:'打印',
                icon:'people'
            }
        }
    ]
}


