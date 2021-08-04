<template>
  <!-- 一个用户缩略图组件 -->
    <div id="base_center">
      <el-container id="admin_home">
        <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
          <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
            <i class="el-icon-setting" style="margin-left: 15px"></i>
            <span style="margin-left: 30px;color: #e1f3d8">用户记录查询</span>
          </el-header>
          <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
            <!--template insertion-->
            <!--所有用户展示搜索页-->
            <div id="base_searchAndShow">
              <el-form
                :inline="true"
                :model="userForm"
                class="demo-form-inline"
                :ref="userForm"
                :rules="rules"
              >
                <el-form-item label="搜索" prop="username" v-if="userForm.action === 'username'">
                  <el-input v-model="userForm.username" placeholder="输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="搜索" prop="type" v-if="userForm.action === 'type'">
                  <el-select v-model="userForm.type">
                    <el-option label="教师" value="Teacher" ></el-option>
                    <el-option label="研究生" value="Postgraduate"></el-option>
                    <el-option label="本科生" value="Undergraduate"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="搜索方式" prop="action">
                  <el-select v-model="userForm.action" placeholder="选择搜索方式">
                    <el-option label="读者用户名" value="username"></el-option>
                    <el-option label="读者用户类型" value="type"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchUser">查询</el-button>
                </el-form-item>
              </el-form>
              <!--这里引用组件，传入参数，展示图片-->
              <list-of-user :users="this.users"></list-of-user>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script>
import listOfUser from '../listOfUser'
export default {
  name: 'userSearch',
  components: {
    'list-of-user': listOfUser
  },
  data () {
    return {
      users: [],
      userForm: {
        username: '',
        type: 'Teacher',
        action: 'username'
      },
      rules: {
        input: [{required: true, message: '请先填写搜索内容', trigger: 'blur'}],
        action: [{required: true, message: '请选择搜索方式', trigger: 'blur'}]
      }
    }
  },
  methods: {
    listChecker (respList) {
      if (respList.length === 0 || respList[0] === null) {
        this.users.splice(0)
        this.$message({showClose: true, type: 'warning', message: '没有这样的用户！'})
      } else {
        this.users = respList
      }
    },
    searchUser () {
      switch (this.userForm.action) {
        case 'username':
          let fd1 = new FormData()
          fd1.append('username', this.userForm.username)
          this.$axios.post('/system/search/oneUser',fd1).then(resp=>{
            this.listChecker(resp.data.readerList)
          })
          break
        case 'type':
          let fd2 = new FormData()
          fd2.append('type', this.userForm.type)
          this.$axios.post('/system/search/oneTypeUser', fd2).then(resp=>{
            this.listChecker(resp.data.readerList)
          })
          break
      }
    }
  },
  mounted () {
    this.$axios.post('/system/search/allUsers').then(resp=>{
      this.listChecker(resp.data.readerList)
    })
  }
}
</script>

<style scoped>

</style>
