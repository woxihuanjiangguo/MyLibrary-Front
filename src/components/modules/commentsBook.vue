<template>
  <div id="commentsWhole">
    <div id="commentsUp">
      <el-card class="elCardInCommentsUp">
        <div class="leftPart">
          <img :src="this.book.picFile.file" style="width: 200px;object-fit: cover; height: 300px">
          <el-rate
            v-model="book.star"
            disabled
            text-color="#ff9900"
            show-score
            score-template="{value}"
            style="margin-top: 30px"
          ></el-rate>
          <h4 style="color: #8c939d; margin-top: 20px; margin-bottom: -20px" v-if="book.star === 0">暂无评论</h4>
        </div>
        <div style="text-align: left; display: inline-block; width: 50%">
          <h4 style="padding-top: 30px">ISBN：{{this.book.isbn}}</h4>
          <h4 style="padding-top: 15px">名称：{{this.book.bookName}}</h4>
          <h4 style="padding-top: 15px">作者：{{this.book.author}}</h4>
          <h4 style="padding-top: 15px">价格：{{this.book.price}}</h4>
          <h4 style="padding-top: 15px">出版时间：{{this.book.publishTime}}</h4>
          <h4 style="padding-top: 15px" class="myContent">书籍详情：{{this.book.intro}}</h4>
        </div>
      </el-card>
    </div>
    <div id="commentsDown" style="margin-top: 40px; width: 95%;height: auto">
      <commentsGeneral :comments="book.commentList" :allow="allow"></commentsGeneral>
    </div>
  </div>
</template>

<script>
  import commentsGeneral from "./commentsGeneral";
  export default {
    name: 'comments',
    components: {
      commentsGeneral
    },
    data() {
      return {
        book: '',
        allow: 0 // 0为游客，1为读者，2为管理员
      }
    },
    created() {
      if (this.$store.state.token) {
        if (this.$store.state.role === 'SuperLibrarian' || this.$store.state.role === 'Librarian') {
          this.allow = 2
        } else {
          this.allow = 1
        }
      }
      if (this.$route.query.ISBN) {
        let fd = new FormData()
        fd.append('ISBN', this.$route.query.ISBN)
        this.$axios.post('/books/search/ISBN', fd).then(resp => {
          console.log(resp)
          // list存储传输的数组
          this.book = resp.data.prototypeList
          this.book.picFile.file = 'data:image/png;base64,' + this.book.picFile.file
        })
      }
    }
  }
</script>

<style scoped>
  #commentsWhole {
    width: 80%;
    margin: auto;
    margin-top: 20px;
  }

  .leftPart {
    width: 300px;
    height: auto;
    display: inline-block;
    float: left;
    margin: 30px 10% 12% 5%;
  }

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
  .elCardInCommentsUp{
    display: inline-block;
    width: 100%;
    height: auto
  }
</style>
