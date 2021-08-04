<template>
  <!--书本展示搜索页-->
  <div id="base_searchAndShow">
    <el-form
    :inline="true"
    :model="searchForm"
    class="demo-form-inline"
    :ref="searchForm"
    :rules="rules"
    >
      <el-form-item label="搜索" prop="input">
        <el-input v-model="searchForm.input" placeholder="输入搜索目标"></el-input>
      </el-form-item>
      <el-form-item label="搜索方式" prop="action">
        <el-select v-model="searchForm.action" placeholder="选择搜索方式">
          <el-option label="书名" value="bookName"></el-option>
          <el-option label="ISBN" value="ISBN"></el-option>
          <el-option label="作者" value="author"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <!--这里引用组件，传入参数，展示图片-->
    <show-book :list="list" :admin-list="adminList"></show-book>
  </div>
</template>
<script>
import BookList from '../modules/listOfBook'
export default {
  name: 'searchAndShow',
  components: {
    'show-book': BookList
  },
  // 增加一个属性，判断能否有增加副本按钮
  props: {
    adminList: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: [],
      searchForm: {
        input: '',
        action: ''
      },
      rules: {
        input: [{required: true, message: '请先填写搜索内容', trigger: 'blur'}],
        action: [{required: true, message: '请选择搜索方式', trigger: 'blur'}]
      }
    }
  },
  methods: {
    getUrl () {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].picFile.file = 'data:image/png;base64,' + this.list[i].picFile.file
      }
    },
    getlist () {
      let fd = new FormData()
      fd.append('number', 'default')
      this.$axios.post('/books/search/all', fd).then(resp => {
        console.log(resp)
        // list存储传输的数组
        this.list = resp.data.prototypeList
        this.getUrl()
      }).catch(err => {
        console.log(err)
        this.$message({
          showClose: true,
          type: 'error',
          message: '请求超时，请稍后再试'
        })
      })
    },
    search () {
      this.$refs[this.searchForm].validate(valid => {
        if (valid) {
          let fd = new FormData()
          let method = this.searchForm.action
          fd.append(method, this.searchForm.input)
          this.$axios.post('/books/search/' + method + ((method === 'ISBN') ? '' : 'like'), fd).then(data => {
            // list存储传输的数组
            this.list = data.data.prototypeList
            this.getUrl()
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: '选择合适的类型，填入相应信息'
          })
        }
      })
    }
  },
  mounted () {
    this.getlist()
  }
}
</script>

<style scoped>
  #base_searchAndShow{
    width: 100%;
    margin-top: 30px;
  }
  .el-form{
    width: 100%;
    margin-left: 5%;
  }
  .el-form-item{
    width: 320px;
  }
</style>
