<template>
  <div id="base_add">
    <el-container id="admin_home">
      <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
        <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
          <i class="el-icon-setting" style="margin-left: 15px"></i>
          <span style="margin-left: 30px;color: #e1f3d8">增加管理员</span>
        </el-header>
        <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
          <!--template insertion-->
          <h3>请填写新管理员的信息</h3>
          <el-form :model="addForm" :rules="rules" :ref="addForm">
            <el-form-item prop="username">
              <el-input type="text" v-model="addForm.username"
                        auto-complete="off" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="addForm.password"
                        auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 40%;background: coral;border: none" @click="submit(addForm)">注册</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data () {
    return {
      addForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 6, max: 32, message: '用户名长度应为6-32位'},
          {pattern: /^[A-Za-z0-9]*$/, message: '用户名应为数字或字母'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 32, message: '密码长度应为6-32'},
          {pattern: /^[A-Za-z0-9]*$/, message: '密码应为数字或字母'}]
      }
    }
  },
  methods: {
    submit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$axios.post('/system/add', {username: this.addForm.username, password: this.addForm.password})
            .then(resp => {
              if (resp.data.message === 'success') {
                this.$message({showClose: true, type: 'success', message: 'Admin successfully added!'})
                window.location.reload()
              } else {
                this.$message({showClose: true, type: 'error', message: resp.data.message})
              }
            })
        } else {
          this.$message({showClose: true, type: 'error', message: 'Info to add an admin is invalid!'})
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
