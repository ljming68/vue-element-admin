// 导出员工路由的规则
import Layout from "@/layout"
export default {
  // 路由规则
  path: '/approvals', // 路由地址 /approvals
  name: 'approvals', // 给模块的一级路由加一个name 属性 这个属性 后面会再做权限的时候用到
  component: Layout,
  children: [
    {
      // 二级路由 的path 为空的时候 此时她表示二级路由的默认路由
      path: '',
      name: 'approvals',
      component: () => import('@/views/approvals'),
      // 路由元信息  其实是一个存储数据的地方  可以放任何内容 
      meta: {
        title: '审批', //  左导航栏会读取这个属性
        icon: 'tree-table'
      }
    },
    {
      path: 'salaryApproval/:id',
      component: () => import('@/views/approvals/salary'),
      name: 'salaryApproval',
      hidden: true,
      meta: {
        title: '工资审核',
        icon: 'approval', noCache: true }
    },
    {
      path: 'enterApproval/:id',
      component: () => import('@/views/approvals/enter'),
      name: 'enterApproval',
      hidden: true,
      meta: {
        title: '入职审核',
        icon: 'approval', noCache: true }
    },
    {
      path: 'leaveApproval/:id',
      component: () => import('@/views/approvals/leave'),
      name: 'leaveApproval',
      hidden: true,
      meta: {
        title: '申请请假',
        icon: 'approval', noCache: true }
    },
    {
      path: 'quitApproval/:id',
      component: () => import('@/views/approvals/quit'),
      name: 'quitApproval',
      hidden: true,
      meta: {
        title: '申请离职',
        icon: 'approval', noCache: true }
    },
    {
      path: 'overtimeApproval/:id',
      component: () => import('@/views/approvals/overtime'),
      name: 'overtimeApproval',
      hidden: true,
      meta: {
        title: '加班申请',
        icon: 'approval', noCache: true }
    },
    {
      path: 'securitySetting',
      component: () => import('@/views/approvals/security'),
      name: 'securitySetting',
      hidden: true,
      meta: {
        title: '设置',
        icon: 'approval', noCache: true }
    }




  ]
}