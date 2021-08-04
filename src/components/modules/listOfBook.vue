<template>
  <!--组件：参数list绑定一个书本的数组,自动展示数组中所有图片 缩略图-->
  <div id="listOfBook">
    <el-row>
      <el-col :span="6" v-for="book in list.slice((this.currpage - 1) * this.pagesize, this.currpage * this.pagesize)" :key="book" :offset="1">
        <el-card :body-style="{ padding: '0px' }" style="margin:10px 10px 10px 60px; padding:20px">
          <img :src="book.picFile.file" class="image">
          <div style="padding: 14px; margin-top:20px">
            <!--STAR为评分-->
            <el-rate
              v-model="book.star"
              disabled
              text-color="#ff9900"
              show-score
              score-template="{value}"
            ></el-rate>
            <h3>书名：{{book.bookName}}</h3>
            <h3>作者：{{book.author}}</h3>
            <slot></slot>
          </div>
          <el-select v-model="book.copyNum" v-if="adminList" style="width: 70px; margin-bottom: 20px">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
          <el-button v-if="adminList" @click="addCopy(book.isbn, book.copyNum)">增加副本</el-button>
          <el-button @click="goToComments(book.isbn)">查看评论</el-button>
          <el-button @click="goTo(book.isbn)" v-if="adminList">副本状态</el-button>
          <el-button v-if="!adminList" @click="goTo(book.isbn)">预约书本</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination background layout="prev, pager, next, total"
                   id="footer"
                   :page-size="pagesize"
                   :total="list.length"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>
<script>
export default{
  props: {
    list: {
      type: Array,
      required: true
    },
    // adminList true 则为admin页面; false 则为普通用户界面
    adminList: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pagesize: 4,
      currpage: 1,
      starTexts: ['暂无评分','暂无评分','暂无评分','暂无评分','暂无评分']
    }
  },
  methods: {
    goTo (ISBN) {
      if (this.adminList) {
        this.$router.push({
          // 携带ISBN参数跳转，管理员查看的界面
          path: '/operationsOfBook',
          name: 'OperationsOfBook',
          query: {
            ISBN: ISBN
          }
        })
      } else {
        this.$router.push({
          // 携带ISBN参数跳转，用户查看的界面
          path: '/detailOfBook',
          name: 'DetailOfBook',
          query: {
            ISBN: ISBN
          }
        })
      }
    },
    goToComments (ISBN) {
      this.$router.push({
        // 携带ISBN参数跳转，用户查看的界面
        path: '/commentsOfBook',
        name: 'CommentsOfBook',
        query: {
          ISBN: ISBN
        }
      })
    },
    // 上传书本
    addCopy (ISBN, copyNum) {
      if (['1', '2', '3', '4', '5'].indexOf(copyNum) === -1) {
        this.$message({showClose: true, message: '请选择数量', type: 'warning'})
        return
      }
      let formData = new FormData()
      formData.append('token', this.$store.state.token)
      formData.append('bookNum', copyNum)
      formData.append('ISBN', ISBN)
      console.log(copyNum)
      this.$axios.post('/system/addCopy', formData).then(resp => {
        if (resp.data.message === 'success') {
          this.$message({showClose: true, message: '上传成功', type: 'success'})
        }
      })
    },
    handleCurrentChange (cpage) {
      this.currpage = cpage
      this.bookList = this.list.slice((this.currpage - 1) * this.pagesize, this.currpage * this.pagesize)
    },
    handleSizeChange (psize) {
      this.pagesize = psize
      this.bookList = this.list.slice((this.currpage - 1) * this.pagesize, this.currpage * this.pagesize)
    }
  }
}
</script>
<style scoped>
  .image {
    margin: auto;
    width: 80%;
    height: 80%;
    display: block;
  }
  .intro{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .el-card{
    width: 80%;
  }
  #footer{
    margin-top: 20px;
  }
</style>
