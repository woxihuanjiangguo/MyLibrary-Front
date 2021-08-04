<template>
  <div id="base_login">
    <el-form :model="loginForm"
             :rules="rules"
             class="login_container"
             label-position="left"
             label-width="0px"
             :ref="loginForm"
             v-loading="loading">
      <h3 class="login_title">登录</h3>
      <h4 style="opacity: 60%">admin</h4>
      <h4 style="opacity: 60%; margin-bottom: 30px">Di17zufuwuqi</h4>
      <el-form-item prop="username">
        <el-input type="text"
                  v-model="loginForm.username"
                  auto-complete="off"
                  placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  v-model="loginForm.password"
                  auto-complete="off"
                  placeholder="密码"></el-input>
      </el-form-item>
      <div style="" >
      <el-form-item>
        <el-radio v-model="radio" label="1">用户</el-radio>
        <el-radio v-model="radio" label="2">管理员</el-radio>
      </el-form-item>
      <el-form-item  prop="region" v-if="radio === '2'">
        <el-lable>地址：</el-lable>
        <el-select v-model="loginForm.region" uto-complete="false"  placeholder="请输入地址">
          <el-option label="邯郸" value="邯郸"></el-option>
          <el-option label="张江" value="张江"></el-option>
          <el-option label="江湾" value="江湾"></el-option>
          <el-option label="枫林" value="枫林"></el-option>
        </el-select>
      </el-form-item>
      </div>
      <el-form-item style="width: 100%">
        <el-button type="primary"
                   style="width: 40%;border: none"
                   v-on:click="login">登录</el-button>
      </el-form-item>
      <el-form-item style="text-align: right; margin-right: -20px; margin-bottom: -5px">
        <router-link to="register">
          <el-button type="primary" style="border: none" circle icon="el-icon-s-custom">
          </el-button>
        </router-link>
        <router-link to="/">
          <el-button type="info" style="border: none;color: antiquewhite" circle icon="el-icon-d-arrow-left">
          </el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      radio: '1',
      loginForm: {
        username: '',
        password: '',
        region: '',
        type: ''
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        region: [{required: true, message: '请选择地址', trigger: 'blur'}]
      },
      loading: false
    }
  },
  methods: {
    login () {
      this.loginForm.type = (this.radio === '1') ? 'user' : 'admin'
      this.$refs[this.loginForm].validate(valid => {
        if (valid) {
          this.$axios.post('/login', {
            username: this.loginForm.username,
            password: this.loginForm.password,
            region: this.loginForm.region,
            type: this.loginForm.type
          })
            .then(resp => {
              if (resp.status === 200 && resp.data.hasOwnProperty('token')) {
                // deal with region display locally
                resp.data.region = this.loginForm.region
                resp.data.username = this.loginForm.username
                this.$store.commit('login', resp.data)
                this.actionAfterSuccess(resp.data.role)
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: 'Unknown error'
                })
              }
            })
            .catch(error => {
              console.log(error)
              this.$message({
                showClose: true,
                type: 'error',
                message: error.message
              })
            })
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: '请先填写登录信息'
          })
        }
      })
    },
    actionAfterSuccess (role) {
      if (role === 'User') {
        this.$router.replace('/')
      } else if (role === 'Librarian' || role === 'SuperLibrarian') {
        this.$router.replace('/system')
      }
    }
  }
}
</script>

<style scoped>
  #base_login{
    margin-top: 70px;
    background: url("../assets/background.jpg");
    background-position: center;
    height: 640px;
    width: 100%;
    position: fixed;
  }
  body{
    margin: 0px;
    padding: 0px;
  }
  .login_container{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 20px auto;
    text-align: center;
    color: #494e8f;
  }
</style>
