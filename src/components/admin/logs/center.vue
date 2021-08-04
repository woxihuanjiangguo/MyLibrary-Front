<template>
  <div id="base_center">
    <el-container id="admin_home">
      <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
        <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
          <i class="el-icon-setting" style="margin-left: 15px"></i>
          <span style="margin-left: 30px;color: #e1f3d8">个人中心---您的操作记录</span>
        </el-header>
        <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
          <!--template insertion-->
          <operations :list="list" :is-select="false" :view-type="7"></operations>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import operations from '../../modules/details.vue'
export default {
  name: 'Center',
  components: {
    operations
  },
  data () {
    return {
      list: []
    }
  },
  created () {
    let formData = new FormData()
    formData.append('token', this.$store.state.token)
    this.$axios.post('/system/search/myLog', formData).then(resp => {
      console.log(resp.data)
      if (resp.data.logList.length === 0) {
        this.$message({showClose: true, type: 'warning', message: '您还没有操作记录'})
      } else {
        this.list = resp.data.logList
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].picFile.file = 'data:image/png;base64,' + this.list[i].picFile.file
        }
      }
    })
  }
}
</script>

<style scoped>

</style>
