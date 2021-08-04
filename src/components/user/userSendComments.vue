<template>
  <div style="width: 80%; margin: auto; margin-top: 20px">
    <div id="commentsUp">
      <h3 style="text-align: left">未评论书本：</h3>
      <div v-for="prototype in uncommentedList">
        <el-card style="margin-top: 20px; padding:10px">
          <div class="protoLeft">
            <img :src="prototype.picFile.file" style="object-fit: cover; width: 100px; height: 150px">
            <h3>书名：{{prototype.bookName}}</h3>
            <h3>作者：{{prototype.author}}</h3>
          </div>
          <div class="protoRight">
            <el-rate
              v-model="prototype.newStar"
              text-color="#ff9900"
              show-score
              score-template="{value}"
              style="float: left; margin-left: 50px;margin-bottom: 30px"
            ></el-rate>
            <div>
              <el-input type="textarea" v-model="prototype.newComment" :rows="7"
                        style="display: inline-block; width: 90%"></el-input>
              <el-button type="success" style="display:inline-block; width: 5%;margin-left: 20px;margin-bottom: 65px"
                         circle icon="el-icon-check"
                         @click="sendComment(prototype.isbn, prototype.newStar, prototype.newComment)"></el-button>
            </div>
          </div>
        </el-card>
      </div>
      <div v-if="uncommentedList.length === 0">   <!--针对prototype-->
        <el-card>
          <h3>您暂时没有需要评论的书本</h3>
        </el-card>
      </div>
    </div>
    <div id="commentsDown">
      <h3 style="text-align: left;margin-top: 30px">与我相关的评论、讨论：</h3>
      <commentsGeneral :comments="commentList" :allow="1"></commentsGeneral>
    </div>
  </div>

</template>

<script>
  import commentsGeneral from "../modules/commentsGeneral";
  export default {
    name: "userSendComments",
    components: {
      commentsGeneral
    },
    data() {
      return {
        uncommentedList: [],    // prototype
        commentList: []         // comment
      }
    },
    methods: {
      sendComment(ISBN, newStar, newComment) {
        if (newStar === 0 || !newComment) {
          this.$message({showClose: true, message: '请给书本打分并评论！', type: 'warning'})
          return
        }
        let fd = new FormData()
        fd.append('token', this.$store.state.token)
        fd.append('ISBN', ISBN)
        fd.append('star', newStar)
        fd.append('content', newComment)
        this.$axios.post('/reader/comment', fd).then(resp => {
          if (resp.data.message === 'success') {
            this.$message({showClose: true, message: '评论成功', type: 'success'})
            window.location.reload()
          } else {
            this.$message({showClose: true, message: resp.data.message, type: 'error'})
          }
        })
      }
    },
    created() {
      let fd = new FormData()
      fd.append('token', this.$store.state.token)
      this.$axios.post('/reader/search/commentAndDiscussion', fd).then(resp => {
        this.uncommentedList = resp.data.uncommentedList
        this.commentList = resp.data.commentList
        for (let i = 0; i < this.uncommentedList.length; i++) {
          this.uncommentedList[i].picFile.file = 'data:image/png;base64,' + this.uncommentedList[i].picFile.file
        }
      })
    }
  }
</script>

<style scoped>
  .protoLeft {
    display: inline-block;
    float: left;
    margin-left: 5%;
    width: 15%;
  }

  .protoRight {
    display: inline-block;
    width: 70%;
    margin-top: 10px;
    margin-right: 2%;
    padding-left: 3%;
  }
</style>
