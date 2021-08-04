<template>
  <div id="listOfUser">
    <el-row>
      <el-col :span="6" v-for="user in users.slice((this.currpage - 1) * this.pagesize, this.currpage * this.pagesize)"
              :key="user" :offset="1">
        <el-card :body-style="{ padding: '0px' }" style="margin:10px 10px 10px 60px; padding:20px">
          <img src="../../assets/teacher.jpg" v-if="user.attributes.type === 'Teacher'" class="image">
          <img src="../../assets/undergraduate.jpg" v-if="user.attributes.type === 'Undergraduate'" class="image">
          <img src="../../assets/postgraduate.jpg" v-if="user.attributes.type === 'Postgraduate'" class="image">
          <div style="padding: 14px; margin-top:20px">
            <h3>用户名：{{user.username}}</h3>
            <h3 v-if="user.attributes.type === 'Teacher'">教师</h3>
            <h3 v-if="user.attributes.type === 'Postgraduate'">研究生</h3>
            <h3 v-if="user.attributes.type === 'Undergraduate'">本科生</h3>
            <h3>信用分：{{user.score}}</h3>
          </div>
          <el-button @click="goTo(user.username, 'readerLogs')">已完成事务</el-button>
          <el-button @click="goTo(user.username, 'readerOps')">进行中事务</el-button>
          <el-button @click="goTo(user.username, 'readerComments')" style="margin-top: 20px">查看评论</el-button>
          <el-button @click="showDialog(user.username)" type="danger" style="margin-top: 20px">重置信用分</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination background layout="prev, pager, next, total"
                   id="footer"
                   :page-size="pagesize"
                   :total="users.length"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
    >
    </el-pagination>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :append-to-body="true">
      <span>您确认要重置用户：{{this.resetUsername}} 的信用分吗？</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handinReset">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'listOfUser',
    props: {
      users: {
        type: Array
      }
    },
    data() {
      return {
        pagesize: 4,
        currpage: 1,
        dialogVisible: false,
        resetUsername: ''
      }
    },
    methods: {
      handinReset() {
        this.dialogVisible = false
        let fd = new FormData()
        fd.append('username', this.resetUsername)
        this.$axios.post('/system/reset', fd).then(resp => {
          if (resp.data.message === 'success') {
            this.$message({showClose: true, message: '重置分数成功', type: 'success'})
            window.location.reload()
          } else {
            console.log(resp)
            this.$message({showClose: true, message: resp.data.message, type: 'warning'})
          }
        })
      },
      showDialog(username) {
        this.resetUsername = username
        this.dialogVisible = true
      },
      goTo(UID, infoType) {
        this.$router.push({
          // 携带ISBN参数跳转，管理员查看的界面
          path: '/logsOfUser',
          name: 'UserLogs',
          query: {
            UID: UID,
            infoType: infoType
          }
        })
      },
      handleCurrentChange(cpage) {
        this.currpage = cpage
        this.users = this.list.slice((this.currpage - 1) * this.pagesize, this.currpage * this.pagesize)
      },
      handleSizeChange(psize) {
        this.pagesize = psize
        this.users = this.list.slice((this.currpage - 1) * this.pagesize, this.currpage * this.pagesize)
      }
    }
  }
</script>

<style scoped>
  .image {
    margin: auto;
    width: 80%;
    height: 80%;
    border-radius: 120px;
    display: block;
  }

  .intro {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .el-card {
    width: 100%;
  }

  #footer {
    margin-top: 20px;
  }
</style>
