<template>
  <!-- 用户的详细界面，根据参数请求 paylog 或者 操作log -->
  <div id="base_center">
    <el-container id="admin_home">
      <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
        <el-header style="text-align: left;font-size: 20px;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
          <i class="el-icon-setting" style="margin-left: 15px"></i>
          <span style="margin-left: 30px;color: #e1f3d8">用户详细记录</span>
          <span style="margin-left: 30px;color: #e1f3d8" v-if="this.infoType === 'readerLogs'">已完成事务</span>
          <span style="margin-left: 30px;color: #e1f3d8" v-else-if="this.infoType === 'readerOps'">进行中事务</span>
          <span style="margin-left: 30px;color: #e1f3d8" v-else-if="this.infoType === 'readerComments'">与读者相关的评论、讨论</span>
          <span style="margin-left: 30px;color: #e1f3d8">{{UID}}</span>
        </el-header>
        <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
          <!--template insertion-->
          <div v-if="this.infoType === 'readerLogs'">
            <h3>书籍记录</h3>
            <operation2 :is-select="false" :view-type="9" :list="list1"></operation2>
            <h3>罚款记录</h3>
            <operation1 :is-select="false" :view-type="8" :list="list2"></operation1>
          </div>
          <div v-if="this.infoType === 'readerOps'">
            <h3>当前预约/借阅</h3>
            <operation3 :is-select="false" :view-type="10" :list="list1"></operation3>
            <h3>未付罚款</h3>
            <operation4 :is-select="false" :view-type="11" :list="list2"></operation4>
          </div>
          <div v-if="this.infoType === 'readerComments'">
            <commentsGeneral :comments="list1" :allow="2"></commentsGeneral>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import operation1 from "../../modules/details";
  import operation2 from "../../modules/details";
  import operation3 from "../../modules/details";
  import operation4 from "../../modules/details";
  import commentsGeneral from "../../modules/commentsGeneral";

  export default {
    name: 'UserLogs',
    components: {
      operation1,
      operation2,
      operation3,
      operation4,
      commentsGeneral
    },
    data() {
      return {
        list1: [],
        list2: [],
        UID: this.$route.query.UID,
        infoType: this.$route.query.infoType
      }
    },
    methods: {
      handleArray() {
        for (let i = 0; i < this.list1.length; i++) {
          this.list1[i].picFile.file = 'data:image/png;base64,' + this.list1[i].picFile.file
        }
        for (let i = 0; i < this.list2.length; i++) {
          this.list2[i].picFile.file = 'data:image/png;base64,' + this.list2[i].picFile.file
        }
      },
      getInfo() {
        let fd = new FormData()
        fd.append('username', this.$route.query.UID)
        if (this.infoType === 'readerLogs') {
          this.$axios.post('/system/search/readerLog', fd).then(resp => {
            this.list1 = resp.data.logList
            this.list2 = resp.data.payLogList
            this.handleArray()
          })
        } else if (this.infoType === 'readerOps') {
          this.$axios.post('/system/search/readerOperation', fd).then(resp => {
            this.list1 = resp.data.copyList
            this.list2 = resp.data.unpaidList
            for (let i = 0; i < this.list1.length; i++) {
              this.list1[i].prototype.picFile.file = 'data:image/png;base64,' + this.list1[i].prototype.picFile.file
            }
            for (let i = 0; i < this.list2.length; i++) {
              this.list2[i].prototype.picFile.file = 'data:image/png;base64,' + this.list2[i].prototype.picFile.file
            }
          })
        } else {
          this.$axios.post('/system/search/commentAndDiscussion', fd).then(resp => {
            this.list1 = resp.data.commentList
          })
        }
      }
    },
    mounted() {
      this.getInfo()
    }
  }
</script>

<style scoped>

</style>
