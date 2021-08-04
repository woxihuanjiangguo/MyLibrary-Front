<template>
  <div id="base_borrow">
    <el-container id="admin_home">
      <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
        <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
          <i class="el-icon-setting" style="margin-left: 15px"></i>
          <span style="margin-left: 30px;color: #e1f3d8">现场借书</span>
        </el-header>
        <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
          <!--template insertion-->
          <el-form
            style="width: 100%"
            :model="borrowForm"
            :ref="borrowForm"
            :rules="rule"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="borrowForm.username"></el-input>
            </el-form-item>
            <el-form-item label="副本编号" prop="bookCid">
              <el-input v-model="borrowForm.bookCid"></el-input>
            </el-form-item>
            <operation ref="child" :list="list" :view-type="3"></operation>
            <el-button type="primary" style="margin-top: 100px" @click="borrow">
              借出选中书本
            </el-button>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import operation from '../../modules/details.vue'
export default {
  name: 'GetBorrow',
  components: {
    operation
  },
  methods: {
    borrow () {
      this.$refs.child.postBorrowInfo(this.borrowForm.username, '/system/borrow')
    }
  },
  data () {
    return {
      borrowForm: {
        username: '',
        bookCid: ''
      },
      rule: {
        username: [{ required: true,
          message: '请输入正确的学号、工号',
          trigger: 'blur',
          pattern: /^[0-9]{11}$/}],
        bookCid: [{ required: true,
          message: '请输入正确的副本编号',
          trigger: 'blur',
          pattern: /^\d{3}-\d-\d{3}-\d{5}-\d-\d{3}$/ }]
      },
      list: [],
      currentList: []
    }
  },
  watch: {
    borrowForm: {
      // 实时检测cid的输入，如果符合 x - ddd的形式 就发送请求
      handler: function (val) {
        if (val.bookCid.match(/^\d{3}-\d-\d{3}-\d{5}-\d-\d{3}$/) && (this.currentList.indexOf(val.bookCid) === -1)) {
          // get cid
          let formData = new FormData()
          formData.append('cid', val.bookCid)
          this.$axios.post('/books/search/cid', formData).then(resp => {
            if (resp.data.copy === null) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: '没有这个副本编号的书'
              })
            } else {
              resp.data.copy.prototype.picFile.file = 'data:image/png;base64,' + resp.data.copy.prototype.picFile.file
              this.$set(this.list, this.list.length, resp.data.copy)
              this.$set(this.currentList, this.currentList.length, resp.data.copy.cid)
            }
          })
        }
      },
      deep: true
    }
  }
}
</script>
