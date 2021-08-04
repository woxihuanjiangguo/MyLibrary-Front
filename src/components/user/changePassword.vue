<template>
  <!--密码修改页面-->
  <div id="changePassword">
    <el-form
      label-width="80px"
      enctype="multipart/form-data"
      :model="alterForm"
      :rules="rules"
      ref="alterForm"
    class="change">
      <h3 class="login_title">修改密码</h3>
      <el-form-item label="用户名" prop="username">
        <el-input
          type="text"
          size="mini"
          v-model="alterForm.username"
          auto-complete="false"
          :value="alterForm.username"
          disabled
        >
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          size="mini"
          v-model="alterForm.password"
          auto-complete="false"
          placeholder="请输入密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="修改密码" prop="rePassword">
        <el-input
          type="password"
          size="mini"
          v-model="alterForm.rePassword"
          auto-complete="false"
          placeholder="请输入修改密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="subBth" style="width: 124px;">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'changePassword',
  data () {
    var passwordValid = (rule, value, callback) => {
      var role = localStorage.getItem('role')
      var reg = RegExp(this.alterForm.username)
      if (role === 'User') { // 用户
        if (value.match(reg) && (this.alterForm.username !== '')) {
          return callback(new Error('密码不能包含用户名'))
        }
        if (!value.match(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,32}$/)) {
          return callback(new Error('密码为字母、数字、特殊字符的6到32位组合'))
        }
      } else {
        if (!value.match(/[a-zA-Z0-9]{6,32}/)) {
          return callback(new Error('密码为6到32位的数字或字母'))
        }
      }
      return callback()
    }
    return {
      alterForm: {
        password: '',
        rePassword: '',
        username: this.$store.state.username
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        rePassword: [{required: true, message: '请输入密码', trigger: 'blur'},
          {validator: passwordValid, trigger: 'blur'}]
      }
    }
  },
  methods: {
    subBth () {
      this.$refs.alterForm.validate(valid => {
        if (valid) {
          let fd = new FormData()
          fd.append('password', this.alterForm.password)
          fd.append('rePassword', this.alterForm.rePassword)
          fd.append('token', this.$store.state.token)
          this.$axios.post('/changePassword', fd)
            .then(resp => {
              if (resp.data.message === 'success') {
                this.$message({showClose: true, type: 'success', message: resp.data.message})
                if (this.$store.state.role === 'Librarian' || this.$store.state.role === 'SuperLibrarian') {
                  this.$router.replace('/system')
                } else {
                  this.$router.replace('/userInfo')
                }
              } else {
                this.$message({ showClose: true, type: 'error', message: resp.data.message })
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: '请先填写信息'
          })
        }
      })
    }
  },
  mounted () {
    this.alterForm.username = this.$store.state.username
  }
}
</script>
<style>
  #changePassword{
    margin-top: 70px;

    background-position: center;
    height: 640px;
    width: 100%;
    position: fixed;
  }
  body{
    margin: 0px;
    padding: 0px;
  }
  .change{
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
    margin: 0px auto 40px auto;
    text-align: center;
    color: #494e8f;
  }
</style>
