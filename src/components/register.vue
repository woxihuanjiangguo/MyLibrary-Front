<template>
  <div id="base_register">
    <el-form :model="registerForm" :rules="rules" class="register_container" label-position="left"
             label-width="0px" v-loading="loading" :ref="registerForm">
      <h3 class="register_title">注册</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="registerForm.username"
                  auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="registerForm.password"
                  auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input type="email" v-model="registerForm.email"
                  auto-complete="off" placeholder="邮箱" disabled="false"></el-input>
      </el-form-item>
      <el-form-item prop="usertype">
        <el-radio-group v-model="registerForm.usertype" @change="userTypeChange">
          <el-radio label="Teacher"  border>教师</el-radio>
          <el-radio label="Postgraduate" border>研究生</el-radio>
          <el-radio label="Undergraduate" border>本科生</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="width: 100%" prop="securityCode">
        <el-input type="text" v-model="registerForm.securityCode" style="width: 70%" auto-complete="off" placeholder="验证码"></el-input>
        <el-button type="primary" style="width: 20%;border: none" v-on:click="sendEmail(registerForm)" :disabled="disableSecurityCode" :plain="disableSecurityCode">验证码</el-button>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 40%;border: none" v-on:click="register(registerForm)">注册</el-button>
      </el-form-item>
      <el-form-item style="text-align: right; margin-right: -20px; margin-bottom: -5px">
        <router-link to="login">
          <el-button type="primary" style="border: none" circle icon="el-icon-user">
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
  name: 'Register',
  data () {
    var passwordValid = (rule, value, callback) => {
      var reg = RegExp(this.registerForm.username)
      if (value.match(reg) && (this.registerForm.username !== '')) {
        return callback(new Error('密码不能包含用户名'))
      }
      if (!value.match(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,32}$/)) {
        return callback(new Error('密码为字母、数字、特殊字符的6到32位组合'))
      }
      return callback()
    }
    const dataValid = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Can\'t be empty'))
      }
      this.registerForm.email = this.registerForm.username + '@fudan.edu.cn'
      return callback()
    }
    return {
      registerForm: {
        username: '',
        password: '',
        email: '',
        usertype: '',
        securityCode: ''// 注册时的验证码
      },
      rules: {
        // blur 失去鼠标焦点时触发验证
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}, {validator: dataValid, trigger: 'blur'},
          {min: 11, max: 11, message: '用户名长度应为11位'}, {pattern: /^[0-9]*$/, message: '只能是工号或者学号'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'},
          {validator: passwordValid, trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱', trigger: 'blur'}, {validator: dataValid, trigger: 'blur'}, {type: 'email', message: '邮箱格式错误', trigger: 'blur'}],
        usertype: [{required: true, message: '请选择身份类型', trigger: 'blur'}, {validator: dataValid, trigger: 'blur'}],
        securityCode: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      },
      loading: false,
      disableSecurityCode: false
    }
  },
  methods: {
    userTypeChange () {
    },
    register (formName) {
      this.$refs[formName].validate(valid => {
        // 保证已经发送验证消息
        if (valid) {
          this.$axios.post('/register', {
            username: this.registerForm.username,
            password: this.registerForm.password,
            email: this.registerForm.email,
            readerType: this.registerForm.usertype,
            securityCode: this.registerForm.securityCode
          }
          )
            .then(resp => {
              console.log(resp)
              // 根据后端的返回数据修改
              if (resp.status === 200 && resp.data.hasOwnProperty('id')) {
                // 跳转到login
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '成功注册'
                })
                this.$router.replace('/login')
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: resp.data.message
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
            message: '注册信息错误'
          })
        }
      })
    },
    sendEmail (formName) {
      // 使其不为空
      this.disableSecurityCode = true
      this.registerForm.securityCode = '  '
      this.$refs[formName].validate(valid => {
        this.registerForm.securityCode = ''
        // 使securityCode不为空
        if (valid) {
          // 发送email
          this.$axios.post('/sendEmail', {
            email: this.registerForm.email
          }
          )
            .then(resp => {
              // 根据后端的返回数据修改
              if (resp.data.message === 'success') {
                // 跳转到login
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '发送成功'
                })
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: resp.data.message
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
            message: '注册信息错误'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  #base_register{
    margin-top: 70px;
    background: url("../assets/background.jpg");
    background-position: center;
    height: 640px;
    width: 100%;
    padding-top: 1px;
  }
  .register_container{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 60px auto;
    width: 400px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .register_title{
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
</style>
