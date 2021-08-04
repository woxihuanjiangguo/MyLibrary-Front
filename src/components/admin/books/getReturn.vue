<template>
  <div id="base_getReserve">
    <el-container id="admin_home">
      <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
        <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
          <i class="el-icon-setting" style="margin-left: 15px"></i>
          <span style="margin-left: 30px;color: #e1f3d8">现场还书</span>
        </el-header>
        <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
          <!--template insertion-->
          <el-form :model="returnForm"
                   :ref="returnForm"
                   :rules="rule"
                   style="width: 100%"
          >
            <el-form-item label="副本编号" prop="cid">
              <el-input v-model="returnForm.cid"></el-input>
            </el-form-item>
          </el-form>
          <operation :list="list" ref="child" :view-type="5"></operation>
          <el-button type="primary" style="margin-top: 100px" @click="postReturnInfo">
            归还选中书本
          </el-button>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
import operation from '../../modules/details.vue'
export default {
  name: 'GetReturn',
  components: {
    operation
  },
  data () {
    return {
      rule: {
        cid: [{ required: true,
          message: '请输入正确的副本编号:ISBN-xxx',
          trigger: 'blur',
          pattern: /^\d{3}-\d-\d{3}-\d{5}-\d-\d{3}$/ }]
      },
      list: [],
      currentList:[],
      returnForm: {
        cid: ''
      }
    }
  },
  methods: {
    postReturnInfo () {
      this.$refs.child.postReturnInfo(this.returnForm.username, '/system/return')
    },
    handleInfo () {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].picFile.file = 'data:image/png;base64,' + this.list[i].picFile.file
      }
    }
  },
  watch: {
    returnForm: {
      deep: true,
      handler: function (val) {
        if (val.cid.match(/^\d{3}-\d-\d{3}-\d{5}-\d-\d{3}$/) && this.currentList.indexOf(val.cid) === -1) {
          let formData = new FormData()
          formData.append('cid', val.cid)
          this.$axios.post('/books/search/cid', formData).then(resp => {
            if (resp.data.copy !== null) {
              resp.data.copy.prototype.picFile.file = 'data:image/png;base64,' + resp.data.copy.prototype.picFile.file
              resp.data.copy.returnState = 'available'
              this.$set(this.list, this.list.length, resp.data.copy)
              this.$set(this.currentList, this.currentList.length, resp.data.copy.cid)
            } else {
              this.$message({showClose: true, type: 'warning', message: 'No such book'
              })
            }
          })
        }
      }
    }
  }
}
</script>
