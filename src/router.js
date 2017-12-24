import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress'

import Login from './components/Login/Login'
import Home from './components/Home/Home'
import Dashboard from './components/Dashboard/Dashboard'

import UserList from './components/UserList/UserList'

import TeacherList from './components/TeacherList/TeacherList'
import TeacherNew from './components/TeacherNew/TeacherNew'

// 注意：在模块化工程中必须显示的执行下面的代码
Vue.use(VueRouter)

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '', // 它将作为默认的 / 的出口组件
          component: Dashboard,
          meta: { requiresAuth: true } // 告诉导航钩子，我需要登陆权限
        },
        {
          path: '/users',
          component: UserList,
          meta: { requiresAuth: true } // 专门存储路由对象的特殊属性
        },
        {
          path: '/teachers',
          component: TeacherList,
          meta: { requiresAuth: true }
        },
        {
          path: '/teachers/new',
          component: TeacherNew,
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  nprogress.start()
  // 如果当前导航的路由需要登陆
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    // 该路由需要授权，检查是否已登录
    // 如果没有登陆，则跳转到登录页
    const isLogin = window.localStorage.getItem('bxg-token')
    if (!isLogin) {
      // 跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // query 对象会被转换为查询字符串放到 /login? 之后, 那么登陆成功之后应该跳转会这里
      })
    } else {
      // 登陆成功，通过
      next()
    }
  } else {
    next() // 不需要验证登陆权限的
  }
  nprogress.done()
})

// 这是全局的路由导航钩子函数
// 所有的路由在导航之前必须经过这里
// 我们可以在这里定制一些特殊的通用处理
// next 表示放行
// 在这里如果不调用 next 则请求就会停留在这里
// router.beforeEach((to, from, next) => {
//   // to 要去的路由
//   // from 从哪个路由来的
//   // 校验是否登陆
//   console.log(to)
//   // 只要请求路径不是 /login 则我就验证你的登陆权限
//   // if (!window.localStorage.getItem('bxg-token')) {
//   //   // 没有登陆
//   //   // console.log(111)
//   //   // 你在实例中的 this.$router 其实就是这里的 router 实例
//   //   // console.log(router.push)
//   //   console.log(111)
//   //   return router.push('/login')
//   // }
//   nprogress.start()
//   next()
//   nprogress.done()
// })

// 导出默认
export default router
