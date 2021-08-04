<template>
  <!--一个评论的组件-->
  <div>
    <el-timeline>
      <el-timeline-item
        v-for="(comment, index) in this.comments"
        :key="index"
        :timestamp="comment.date"
        placement="top"
      >
        <el-card>
          <div id="cardLeft">
            <img src="../../assets/teacher.jpg" v-if="comment.reader.attributes.type === 'Teacher'" class="image">
            <img src="../../assets/undergraduate.jpg" v-if="comment.reader.attributes.type === 'Undergraduate'"
                 class="image">
            <img src="../../assets/postgraduate.jpg" v-if="comment.reader.attributes.type === 'Postgraduate'"
                 class="image">
            <h3>{{comment.reader.username}}</h3>
          </div>
          <div id="cardRight">
            <h3>打分：</h3>
            <el-rate
              v-model="comment.star"
              disabled
              text-color="#ff9900"
              show-score
              score-template="{value}"
            ></el-rate>
            <h3>评论：</h3>
            <p class="myContent" v-if="!comment.isBad">{{comment.content}}</p>
            <el-alert type="info" title="该评论涉嫌违规，已被管理员删除" :closable="false" v-if="comment.isBad"
                      style="margin-bottom: 10px"></el-alert>
            <el-collapse v-if="allow === 1">
              <!--回复-->
              <el-collapse-item title="回复评论" :disabled="comment.isBad">
                <div>
                  <el-input type="textarea" v-model="comment.replyContent" :rows="3"
                            style="width: 90%;display: inline-block"></el-input>
                  <el-button type="success" style="display: inline-block; margin-bottom: 20px; margin-left: 5px"
                             circle icon="el-icon-check"
                             @click="sendDiscussion(comment.replyContent, comment.reader.username, comment.commentId)"></el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-button type="danger" @click="deleteComment(comment.commentId)" style="margin-bottom: 10px"
                       v-if="allow === 2" :disabled="comment.isBad">删除不良评论
            </el-button>
            <el-collapse v-if="comment.discussionList.length !== 0">
              <el-collapse-item title="查看回复">
                <div v-for="discussion in comment.discussionList">
                  <h3><span style="color: #494e8f; font-weight: normal">{{discussion.reader.username}}</span> 回复 <span
                    style="color: #494e8f; font-weight: normal">{{discussion.reply}} :</span></h3>
                  <p style="font-weight: normal;text-indent: 20px" class="myContent" v-if="!discussion.isBad">
                    {{discussion.content}}</p>
                  <el-alert type="info" title="该评论涉嫌违规，已被管理员删除" :closable="false" v-if="discussion.isBad"
                            style="margin-bottom: 10px"></el-alert>
                  <el-button type="danger" @click="deleteDiscussion(discussion.discussionId)" v-if="allow === 2"
                             :disabled="discussion.isBad">
                    删除不良回复
                  </el-button>
                  <el-collapse v-if="allow === 1">
                    <!--回复-->
                    <el-collapse-item title="回复评论" :disabled="discussion.isBad">
                      <div>
                        <el-input type="textarea" v-model="discussion.replyContent" :rows="3"
                                  style="width: 90%;display: inline-block"></el-input>
                        <el-button type="success" style="display: inline-block; margin-bottom: 20px; margin-left: 5px"
                                   circle icon="el-icon-check"
                                   @click="sendDiscussion(discussion.replyContent, discussion.reader.username, comment.commentId)"></el-button>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-card v-if="comments.length === 0">
      <h3>暂时没有相关的评论、讨论记录</h3>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "commentsGeneral",
    props: {
      comments: {
        type: Array,
        required: true
      },
      allow: {
        type: Number,
        required: true
      }
    },
    methods: {
      deleteDiscussion(discussionId) {
        let fd = new FormData()
        fd.append('discussionId', discussionId)
        this.$axios.post('/system/deleteBadDiscussion', fd).then(resp => {
          if (resp.data.message === 'success') {
            this.$message({showClose: true, type: 'success', message: '评论成功'})
            window.location.reload()
          } else {
            console.log(resp)
            this.$message({showClose: true, type: 'error', message: resp.data.message})
          }
        })
      },
      deleteComment(commentId) {
        let fd = new FormData()
        fd.append('commentId', commentId)
        this.$axios.post('/system/deleteBadComment', fd).then(resp => {
          if (resp.data.message === 'success') {
            this.$message({showClose: true, type: 'success', message: '评论成功'})
            window.location.reload()
          } else {
            console.log(resp)
            this.$message({showClose: true, type: 'error', message: resp.data.message})
          }
        })
      },
      sendDiscussion(replyContent, username, commentId) {
        let fd = new FormData()
        fd.append('token', this.$store.state.token)
        fd.append('content', replyContent)
        fd.append('reply', username)
        fd.append('commentId', commentId)
        this.$axios.post('/reader/discussion', fd).then(resp => {
          if (resp.data.message === 'success') {
            this.$message({showClose: true, type: 'success', message: '评论成功'})
            window.location.reload()
          } else {
            console.log(resp)
            this.$message({showClose: true, type: 'error', message: resp.data.message})
          }
        })
      }
    }
  }
</script>

<style scoped>
  .image {
    margin: auto;
    border-radius: 80px;
    width: 80px;
    height: 80px;
  }
  .myContent {
    width: 97%;
    height: auto;
    word-break: break-all;
    overflow: hidden;
    word-wrap: break-word;
  }
  #cardLeft {
    display: inline-block;
    float: left;
    margin: 20px 20px 20px 40px;
    text-align: center;
  }
  #cardRight {
    display: inline-block;
    width: 70%;
    margin-left: 30px;
    text-align: left;
  }
</style>
