<template>
  <div id="base_center">
    <el-container id="admin_home">
      <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
        <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
          <i class="el-icon-setting" style="margin-left: 15px"></i>
          <span style="margin-left: 30px;color: #e1f3d8">发送邮件提醒</span>
        </el-header>
        <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
          <!--template insertion-->
          <div>
            <el-row>
              <!--未付罚款-->
              <el-col :span="7" :offset="4">
                <el-card style="padding:20px">
                  <img src="../../../assets/unpaid.jpg" width="260px" height="260px" class="image">
                  <div style="padding: 14px; margin-top:20px">
                    <h3>未付罚款</h3>
                    <h3>条目数量：{{this.copyListUnpaid.length}}</h3>
                  </div>
                </el-card>
              </el-col>
              <!--过期书本-->
              <el-col :span="7" :offset="2">
                <el-card>
                  <img src="../../../assets/overdue.jpg" width="260px" height="260px" class="image">
                  <div style="padding: 14px; margin-top:20px">
                    <h3>过期书本</h3>
                    <h3>条目总数：{{this.copyListBorrowOverdue.length + this.copyListReserveOverdue.length}}</h3>
                    <h3>借阅超期：{{this.copyListBorrowOverdue.length}}</h3>
                    <h3>预约超期：{{this.copyListReserveOverdue.length}}</h3>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <el-button @click="sendMessageToAll" style="margin-top: 50px" type="warning">发送统一提醒邮件</el-button>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "warning",
    data() {
      return {
        copyListBorrowOverdue: [],
        copyListReserveOverdue: [],
        copyListUnpaid: []
      }
    },
    methods: {
      sendMessageToAll() {
        if (this.copyListBorrowOverdue.length + this.copyListReserveOverdue.length + this.copyListUnpaid.length === 0) {
          this.$message({showClose:true, type: 'warning', message: '没有需要提醒的对象'})
          return
        }
        this.$axios.post('/system/checkOverdue').then(resp => {
          console.log(resp)
          if (resp.data.message === 'success') {
            this.$message({showClose: true, type: 'success', message: '邮件发送成功'})
          } else {
            this.$message({showClose: true, type: 'success', message: '邮件发送失败'})
          }
        })
      }
    },
    mounted() {
      this.$axios.post('/system/search/allBadThings').then(resp => {
        console.log(resp)
        this.copyListBorrowOverdue = resp.data.copyListBorrowOverdue
        this.copyListReserveOverdue = resp.data.copyListReserveOverdue
        this.copyListUnpaid = resp.data.copyListUnpaid
      })
    }
  }

</script>

<style scoped>
.image{
  border-radius: 120px;
}
</style>
