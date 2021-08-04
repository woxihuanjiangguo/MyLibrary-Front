import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login'
import Register from '../components/register'
import store from '../store'
import Home from '../components/home'
import NotFound from '../components/notFound'
import NotAuthorized from '../components/notAuthorized'
import UserInfo from '../components/user/userInfo'
import SearchAndShow from '../components/user/searchAndShow'
import ChangePassword from '../components/user/changePassword'
import DetailOfBook from '../components/user/detailOfBook'
import AdminCenter from '../components/admin/logs/center'
import AdminHome from '../components/admin/admin-home'
import AdminAdd from '../components/admin/super/add'
import AdminBooks from '../components/admin/books'
import AdminUpload from '../components/admin/upload'
import AdminBorrow from '../components/admin/books/getBorrow'
import AdminReserve from '../components/admin/books/getReserve'
import AdminReturn from '../components/admin/books/getReturn'
import UserSearch from '../components/admin/logs/userSearch'
import UserLogs from '../components/admin/logs/userLogsAndOps'
import Alter from '../components/admin/super/alter'
import Warning from '../components/admin/super/warning'
import CommentsOfBook from '../components/modules/commentsBook'
import readerComments from '../components/user/userSendComments'

Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        keepAlive: 1
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/notFound',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/notAuthorized',
      name: 'NotAuthorized',
      component: NotAuthorized
    },
    {
      path: '/userInfo',
      name: 'UserInfo',
      component: UserInfo,
      meta: {
        keepAlive: 1,
        requireAuth: true,
        roles: ['User']
      }
    },
    {
      path: '/myComments',
      name: 'MyComments',
      component: readerComments,
      meta: {
        keepAlive: 1,
        requireAuth: true,
        roles: ['User']
      }
    },
    {
      path: '/searchAndShow',
      name: 'SearchAndShow',
      component: SearchAndShow,
      meta: {
        keepAlive: 1
      }
    },
    {
      path: '/commentsOfBook',
      name: 'CommentsOfBook',
      component: CommentsOfBook,
      meta: {
        keepAlive: 1
      }
    },
    {
      path: '/changePassword',
      name: 'ChangePassword',
      component: ChangePassword,
      meta: {
        keepAlive: 1,
        requireAuth: true,
        roles: ['User', 'SuperLibrarian', 'Librarian']
      }
    },
    {
      path: '/detailOfBook',
      name: 'DetailOfBook',
      component: DetailOfBook,
      meta: {
        keepAlive: 1,
        requireAuth: true,
        roles: ['User']
      }
    },
    {
      path: '/operationsOfBook',
      name: 'OperationsOfBook',
      component: DetailOfBook,
      meta: {
        keepAlive: 1,
        requireAuth: true,
        roles: ['Librarian', 'SuperLibrarian']
      }
    },
    {
      path: '/system',
      component: AdminHome,
      meta: {
        requireAuth: true,
        keepAlive: 2,
        roles: ['Librarian', 'SuperLibrarian']
      }
    },
    {
      path: '/systemAdd',
      component: AdminAdd,
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['SuperLibrarian']
      }
    },
    {
      path: '/systemAlter',
      component: Alter,
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['SuperLibrarian']
      }
    },
    {
      path: '/systemWarning',
      component: Warning,
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['SuperLibrarian']
      }
    },
    {
      path: '/systemCenter',
      component: AdminCenter,
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['Librarian', 'SuperLibrarian']
      }
    },
    {
      path: '/systemUserSearch',
      component: UserSearch,
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['Librarian', 'SuperLibrarian']
      }
    },
    {
      path: '/logsOfUser',
      component: UserLogs,
      name: 'UserLogs',
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['Librarian', 'SuperLibrarian']
      }
    },
    {
      path: '/systemUpload',
      component: AdminUpload,
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['Librarian', 'SuperLibrarian']
      }
    },
    {
      path: '/systemBooks',
      component: AdminBooks,
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['Librarian', 'SuperLibrarian']
      }
    },
    {
      path: '/systemReserve',
      component: AdminReserve,
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['Librarian', 'SuperLibrarian']
      }
    },
    {
      path: '/systemBorrow',
      component: AdminBorrow,
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['Librarian', 'SuperLibrarian']
      }
    },
    {
      path: '/systemReturn',
      component: AdminReturn,
      meta: {
        keepAlive: 2,
        requireAuth: true,
        roles: ['Librarian', 'SuperLibrarian']
      }
    }
  ]
})

// 前端登录拦截
router.beforeEach(function (to, from, next) {
  if (to.matched.some(record => record.meta.requireAuth)) {
    /* 需要权限的部分：
    *  1. 验证有没有token，若没有则进入login
    *  2. 验证role是否符合，若不符合进入notAuthorized（其中可以跳回到主页）
    * */
    if (store.state.token) {
      (to.meta.roles.indexOf(store.state.role) > -1) ? next() : next({path: '/notAuthorized'})
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 登录成功之后重新跳转到该路由
      })
    }
  } else {
    /* 不需要权限的界面
    * 1. 已经有了token，仍然去访问login和register，则跳到主页
    * 2. 一个不知名的url，跳到404
    * */
    if ((to.name === 'Login' || to.name === 'Register') && store.state.token !== null) {
      next({
        path: '/'
      })
    } else if (to.matched.length === 0) {
      // 不存在的URL
      //next('/notFound')
    } else {
      next()
    }
  }
})
