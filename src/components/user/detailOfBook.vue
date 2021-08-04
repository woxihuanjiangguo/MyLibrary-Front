<template>
  <!--书本详情页 展示副本 包含details组件-->
  <div id="detailOfBook">
    <detail-show :list="list" :view-type="viewType" :is-select="false"></detail-show>
  </div>
</template>
<script>
import detail from '../modules/details.vue'
export default {
  name: 'detailOfBook',
  components: {
    'detail-show': detail
  },
  data () {
    return {
      list: [],
      viewType: 1
    }
  },
  methods: {
    // 处理一些信息，比如图片格式
    handleInfo () {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].prototype.picFile.file = 'data:image/png;base64,' + this.list[i].prototype.picFile.file
        if (this.list[i].state !== 'available' && this.list[i].state !== 'reserved') {
          this.list[i].region = null
        }
      }
    },
    getList (ISBN) {
      let fd = new FormData()
      fd.append('ISBN', ISBN)
      this.$axios.post('/books/search/ISBNCopy', fd).then(data => {
        console.log(data)
        // list存储传输的数组
        this.list = data.data.copyList
        this.handleInfo()
      }).catch(err => {
        console.log(err)
        this.$message({
          showClose: true,
          type: 'error',
          message: '请求超时，请稍后再试'
        })
      })
    }
  },
  mounted () {
    // 根据路由选择进入的页面
    if (this.$route.path === '/operationsOfBook') {
      this.viewType = 2
    } else if (this.$route.path === '/detailOfBook') {
      this.viewType = 1
    }
    this.bookISBN = this.$route.query.ISBN
    this.getList(this.bookISBN)
  }
}
</script>
