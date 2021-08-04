<template>
  <div id="base_getReserve">
    <el-container id="admin_home">
      <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
        <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
          <i class="el-icon-setting" style="margin-left: 15px"></i>
          <span style="margin-left: 30px;color: #e1f3d8">取预约书</span>
        </el-header>
        <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
          <!--template insertion-->
          <el-form :model="reserveForm"
                   :ref="reserveForm"
                   :rules="rule"
                   style="width: 100%"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="reserveForm.username"></el-input>
            </el-form-item>
          </el-form>
          <operation :list="list" ref="child" :view-type="4"></operation>
          <el-button type="primary" style="margin-top: 100px" @click="lendReservedBook">
            借出选中书本
          </el-button>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import operation from '../../modules/details.vue'
export default {
  name: 'GetReserve',
  components: {
    operation
  },
  data () {
    return {
      rule: {
        username: [{ required: true,
          message: '请输入正确的学号、工号',
          trigger: 'blur',
          pattern: /^[0-9]{11}$/ }]
      },
      list: [],
      reserveForm: {
        username: ''
      }
    }
  },
  methods: {
    lendReservedBook () {
      this.$refs.child.postBorrowInfo(this.reserveForm.username, '/system/getReserved')
    }
  },
  watch: {
    reserveForm: {
      handler: function (val) {
        // 此处对于超级管理员的判断应该被修改，暂时如此实现
        if (val.username.length === 11 || val.username === 'admin') {
          let formData = new FormData()
          formData.append('reserver', val.username)
          this.$axios.post('/books/search/reserver', formData).then(resp => {
            if (resp.data.copyList.length !== 0) {
              this.list = resp.data.copyList
              for (let i = 0; i < this.list.length; i++) {
                this.list[i].prototype.picFile.file = 'data:image/png;base64,' + this.list[i].prototype.picFile.file
              }
            } else {
              this.$message({
                showClose: true,
                type: 'warning',
                message: '用户还没有预约过书本'
              })
            }
          })
        }
      },
      deep: true
    }
  }
}
</script>
