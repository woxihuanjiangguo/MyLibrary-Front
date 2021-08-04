<template>
  <div id="app">
    <el-container v-if="$route.meta.keepAlive === 1" id="user_nav">
        <el-menu
          :default-active="activeUser"
          class="el-menu-demo"
          mode="horizontal"
          @select="console.log(1)"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          name="nav-bar">
          <el-menu-item index="0" @click="routerDispatch(0)">首页</el-menu-item>
          <el-submenu index="100" :disabled = "this.$store.state.token === null">
            <template slot="title">用户中心</template>
            <el-menu-item index="1" @click="routerDispatch(1)">密码修改</el-menu-item>
            <el-menu-item index="2" @click="routerDispatch(2)" :disabled="checkRole(['Librarian', 'SuperLibrarian'])">个人信息</el-menu-item>
            <el-menu-item index="5" @click="routerDispatch(5)" :disabled="checkRole(['Librarian', 'SuperLibrarian'])">评论反馈</el-menu-item>
          </el-submenu>
          <el-menu-item index="3" @click="routerDispatch(3)" :disabled="checkRole(['Librarian', 'SuperLibrarian'])">书籍浏览</el-menu-item>
          <el-menu-item index="4" @click="routerDispatch(4)" v-if="checkRole(['Librarian','SuperLibrarian'])">管理员页</el-menu-item>
          <el-menu-item @click="loginLogout" v-text="(this.$store.state.token !== null) ? '退出' : '登录'"></el-menu-item>
          <el-menu-item style="float: right">
            <notice v-if="token !== null && role === 'User'"></notice>
          </el-menu-item>
        </el-menu>
    </el-container>
    <el-container v-if="$route.meta.keepAlive === 2" id="admin_nav">
        <el-menu
          style="height: 700px; width: 100px;border-radius: 10px"
          :collapse="true"
          :default-active="activeAdmin"
          background-color="#545c64"
          @select="console.log(2)"
          text-color="#fff"
          active-text-color="#ffd04b">
          <!-- 校区 -->
          <el-menu-item index="0" @click="routerDispatchAdmin(0)">
            <i class="el-icon-location"></i>
            <span slot="title">{{regionChara}}</span>
          </el-menu-item>
          <!-- 学生事务处理 -->
          <el-submenu index="100">
            <template slot="title">
              <i class="el-icon-reading"></i>
              <span>学生事务</span>
            </template>
            <el-menu-item-group title="书本出馆">
              <el-menu-item index="1" @click="routerDispatchAdmin(1)"><i class="el-icon-collection"></i>取预约书</el-menu-item>
              <el-menu-item index="2" @click="routerDispatchAdmin(2)"><i class="el-icon-collection"></i>现场借书</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="书本入馆">
              <el-menu-item index="3" @click="routerDispatchAdmin(3)"><i class="el-icon-document-checked"></i>现场还书</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 书本事务处理 -->
          <el-menu-item index="4" @click="routerDispatchAdmin(4)">
            <i class="el-icon-s-platform"></i>
            <span slot="title">查看书本</span>
          </el-menu-item>
          <el-menu-item index="5" @click="routerDispatchAdmin(5)">
            <i class="el-icon-circle-plus"></i>
            <span slot="title">图书上新</span>
          </el-menu-item>
          <!-- 总记录查询处 -->
          <el-submenu index="200">
            <template slot="title">
              <i class="el-icon-data-analysis"></i>
              <span>记录查询</span>
            </template>
            <el-menu-item-group title="各项记录查询">
              <el-menu-item index="6" @click="routerDispatchAdmin(6)">
                <i class="el-icon-s-custom"></i>
                <span slot="title">您的个人记录</span>
              </el-menu-item>
              <el-menu-item index="7" @click="routerDispatchAdmin(7)">
                <i class="el-icon-s-custom"></i>
                <span slot="title">用户个人纪录</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 超管的特权-->
          <el-submenu index="999" :disabled="this.$store.state.role !== 'SuperLibrarian'">
            <template  slot="title">
              <i class="el-icon-s-cooperation"></i>
              <span>超管特权</span>
            </template>
            <el-menu-item-group title="超管特权">
              <el-menu-item index="8" @click="routerDispatchAdmin(8)">
                <i class="el-icon-s-tools"></i>
                <span slot="title">增加管理员</span>
              </el-menu-item>
              <el-menu-item index="9" @click="routerDispatchAdmin(9)">
                <i class="el-icon-s-tools"></i>
                <span slot="title">读者属性</span>
              </el-menu-item>
              <el-menu-item index="10" @click="routerDispatchAdmin(10)">
                <i class="el-icon-s-tools"></i>
                <span slot="title">发送提醒</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="11" @click="routerDispatchAdmin(11)">
            <i class="el-icon-user"></i>
            <span slot="title">用户界面</span>
          </el-menu-item>
          <el-menu-item index="300" @click="adminLogOut">
            <i class="el-icon-unlock"></i>
            <span slot="title">退出</span>
          </el-menu-item>
        </el-menu>
    </el-container>
    <router-view/>
  </div>
</template>

<script>
import notice from '@/components/modules/showNotice'
export default {
  name: 'App',
  components:{
    notice
  },
  data () {
    return {
      activeUser: '0',
      /* 所有的用户跳转
      * 0-主页
      * 1-修改密码
      * 2-个人信息
      * 3-浏览书本
      * 4-管理员页
      * 5-评论页
      * 其中：普通用户与超管都能访问；
      *  管理员不能浏览书本或者进入个人中心
      * */
      myPaths: ['/', '/changePassword', '/userInfo', '/searchAndShow', '/system', '/myComments'],
      /* 所有的管理员跳转
      * 0-主页
      * 1-借预约书
      * 2-借书
      * 3-还书
      * 4-查看书
      * 5-上传
      * 6-加人
      * 7-中心
      * 8-用户界面
      * */
      adminPaths: ['/system', '/systemReserve', '/systemBorrow', '/systemReturn',
        '/systemBooks', '/systemUpload',
        '/systemCenter', '/systemUserSearch',
        '/systemAdd', '/systemAlter', '/systemWarning',
        '/'],
      regionChara: '',
      activeAdmin: '0',
      token: this.$store.state.token,
      role: this.$store.state.role
    }
  },
  methods: {
    routerDispatchAdmin (key) {
      this.$router.replace(this.adminPaths[key])
      this.activeAdmin = key.toString()
    },
    adminLogOut () {
      this.$store.commit('logout')
      window.location.reload()
    },
    loadByPathAdmin () {
      if (this.adminPaths.indexOf(this.$route.path)) {
        this.activeAdmin = this.adminPaths.indexOf(this.$route.path).toString()
      }
    },
    checkRole (array) {
      return (array.indexOf(this.$store.state.role) > -1)
    },
    routerDispatch (key) {
      // 此处统一控制所有的跳转，除了登录与登出
      this.activeUser = key.toString()
      this.$router.replace(this.myPaths[key])
    },
    loginLogout () {
      this.activeUser = '0'
      if (this.$store.state.token !== null) {
        this.$store.commit('logout')
        window.location.reload()
      } else {
        this.$router.replace('/login')
      }
    },
    loadPath () {
      if (!this.$route.path.match(/\/detailOfBook/) && this.myPaths.indexOf(this.$route.path) > -1) {
        this.activeUser = this.myPaths.indexOf(this.$route.path).toString()
      }
    }
  },
  mounted () {
    this.regionChara = this.$store.state.region + '校区'
  },
  watch: {
    '$route' (to, from) {
      this.loadByPathAdmin()
      this.loadPath()
      window.location.reload()
    }
  },
  created () {
    this.loadPath()
    this.loadByPathAdmin()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#user_nav .el-menu{
  width: 100%;
}
#admin_nav{
  float: left;
  margin-right: 50px;
  margin-top: 50px;
}
.el-aside{
  opacity: 97%;
}
.el-menu-item{
  border-radius: 10px;
}
#helloTag{
  width: 170px;
}
#helloTag:hover{
  cursor:default;
}
</style>
