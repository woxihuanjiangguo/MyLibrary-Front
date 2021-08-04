<template>
  <!--传入参数list[]，用表格展示 组件 展示副本-->
  <div id="details">
    <el-table :data="list.slice((currpage - 1) * pagesize, currpage * pagesize)"
              border style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        v-if="isSelect"
        :selectable="checkSelectable"
        key="1"
        >
      </el-table-column>
      <el-table-column type="index" label="序号" key="2">
      </el-table-column>
      <!--以下为读者所查看的内容 其中
      图片
      isbn
      cid
      bookname
      region
      state都可以查看-->
      <el-table-column label="图书" key="3" v-if="flag([1,2,3,4,5,10,11])">
        <template slot-scope="scope">
          <img :src="scope.row.prototype.picFile.file" width="40" height="60"/>
        </template>
      </el-table-column>
      <el-table-column label="图书" key="4" v-if="flag([6,7,8,9])">
        <template slot-scope="scope">
          <img :src="scope.row.picFile.file" width="40" height="60"/>
        </template>
      </el-table-column>
      <el-table-column prop="prototype.isbn" label="ISBN" key="5" v-if="flag([1,2,3,4,5,10,11])">
      </el-table-column>
      <el-table-column prop="isbn" label="ISBN" key="6" v-if="flag([6,7,8,9])">
      </el-table-column>
      <el-table-column prop="cid" label="cid" key="7">
      </el-table-column>
      <el-table-column prop="prototype.bookName" label="书名" v-if="flag([1,3])" key="8">
      </el-table-column>
      <el-table-column prop="bookName" label="书名" v-if="flag([6,7,8,9])" key="9">
      </el-table-column>
      <el-table-column prop="prototype.author" label="作者" v-if="flag([1])" key="10">
      </el-table-column>
      <el-table-column prop="prototype.publishTime" label="出版时间" v-if="flag([1])" key="11">
      </el-table-column>
      <el-table-column prop="region" label="地区" v-if="flag([1,2,3,4])" key="13">
      </el-table-column>
      <el-table-column prop="state" label="状态" v-if="flag([1,2,3,4,5,10])" key="14">
      </el-table-column>
      <!--不要增加flag-->
      <el-table-column v-if="flag([1])" label="预约书本" key="15">
        <template slot-scope="scope" v-if="flag([1])">
          <el-button button :disabled="(scope.row.state !== 'available')" @click="onsubmit(scope.row.cid)">预约</el-button>
        </template>
      </el-table-column>
      <!-- 以下为管理员所查看的内容-->
      <el-table-column prop="reservedTime" label="预约时间" v-if="flag([6,9])" key="16">
      </el-table-column>
      <el-table-column prop="reserverId" label="预约人学号/工号" v-if="flag([2,4])" key="17">
      </el-table-column>
      <el-table-column prop="expectedBorrowTime" label="预计借阅时间" v-if="flag([2,4,10])" key="18">
      </el-table-column>
      <el-table-column prop="borrowedTime" label="借阅时间" v-if="flag([6,7,9])" key="19">
      </el-table-column>
      <el-table-column prop="borrowerId" label="借阅人学号、工号" v-if="flag([2,5,7])" key="20">
      </el-table-column>
      <el-table-column prop="expectedReturnTime" label="预计归还时间" v-if="flag([2,5,10])" key="21">
      </el-table-column>
      <el-table-column prop="borrowAdmin" label="借阅负责人" v-if="flag([7,9])" key="22">
      </el-table-column>
      <el-table-column prop="borrowRegion" label="借阅地区"  v-if="flag([6,7,9])" key="23">
      </el-table-column>
      <!--不要增加flag-->
      <el-table-column prop="returnState" label="书籍现状" v-if="flag([5])" key="24">
        <template slot-scope="scope" v-if="flag([5])">
          <el-select v-model="scope.row.returnState">
            <el-option value="available" label="完好"></el-option>
            <el-option value="damaged" label="损坏"></el-option>
            <el-option value="lost" label="遗失"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="returnTime" label="归还时间" v-if="flag([6,7,9])" key="25">
      </el-table-column>
      <el-table-column prop="returnAdmin" label="归还负责人" v-if="flag([7,9])" key="26">
      </el-table-column>
      <el-table-column prop="returnRegion" label="归还地区" v-if="flag([7,9])" key="27">
      </el-table-column>
      <el-table-column prop="pricePaid" label="所付金额" v-if="flag([8])" key="28">
      </el-table-column>
      <el-table-column prop="payTime" label="支付时间" v-if="flag([8])" key="29">
      </el-table-column>
      <el-table-column prop="cause" label="罚款原因" v-if="flag([8])" key="30">
      </el-table-column>
      <el-table-column prop="tempPrice" label="罚款金额" v-if="flag([11])" key="31">
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, sizes, total, jumper"
                   id="footer"
                   :page-size="pagesize"
                   :total="list.length"
                   :psge-sizes="6"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    /* 控制用户与管理员的视图
    * isSelect: 是否有多选的打勾框
    * viewType
    * 1-用户查看
    * 2-管理员查看
    * 3-管理员借阅
    * 4-管理员给出预约
    * 5-管理员收取归还
    * 6-用户个人
    * 7-管理员个人
    *  log相关
    * 8-管理员看用户罚款
    * 9-管理员看用户操作
    * 10-管理员看用户当前预约和借阅
    * 11-管理员看用户未付罚款
    * */
    viewType: {
      type: Number,
      default: 1
    },
    isSelect: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      pagesize: 10,
      currpage: 1,
      selected: [],
      cids: [],
      states:[],
      currentTime: ''
    }
  },
  computed: {
    // flag计算属性，如果数组中有viewType则显示
    flag () {
      return array => {
        return array.indexOf(this.viewType) > -1
      }
    }
  },
  methods: {
    // 预约书本
    onsubmit (cid) {
      let fd = new FormData()
      fd.append('cid', cid)
      fd.append('token', this.$store.state.token)
      this.$axios.post('/books/reserve', fd).then(resp => {
        if (resp.data.message === 'success') {
          this.$message({ showClose: true, type: 'success', message: '预约成功' })
          window.location.reload()
        } else {
          this.$message({ showClose: true, type: 'error', message: resp.data.message })
        }
      })
    },
    //  发送借阅信息
    postBorrowInfo (username, api) {
      this.initOperation(false)
      let formData = new FormData()
      formData.append('cid', this.cids)
      formData.append('token', this.$store.state.token)
      formData.append('borrowerId', username)
      this.$axios.post(api, formData).then(resp => {
        if (resp.data.message === 'success') {
          this.$message({showClose: true, type: 'success', message: '借阅成功'})
          window.location.reload()
        } else {
          this.$message({showClose: true, type: 'error', message: resp.data.message})
        }
      })
    },
    // 发送归还信息
    postReturnInfo (username, api) {
      this.initOperation(true)
      let formData = new FormData()
      formData.append('cid', this.cids)
      formData.append('state', this.states)
      formData.append('token', this.$store.state.token)
      this.$axios.post(api, formData).then(resp => {
        if (resp.data.message === 'success') {
          this.$message({showClose: true, type: 'success', message: '归还成功'})
          window.location.reload()
        } else {
          this.$message({showClose: true, type: 'error', message: resp.data.message})
        }
      })
    },
    handleCurrentChange (cpage) {
      this.currpage = cpage
    },
    handleSizeChange (psize) {
      this.pagesize = psize
    },
    handleSelectionChange (val) {
      this.selected = val
    },
    checkSelectable (row, index) {
      let flag = this.$store.state.region === row.region
      switch (this.viewType) {
        case 3:
          return (row.state === 'available') && flag
        case 4:
          return (row.state === 'reserved') && flag
        case 5:
          return row.state === 'borrowed'
      }
    },
    initOperation (isReturn) {
      // isReturn flag false则一般的；true是代表还书哦
      if (isReturn) {
        for (let i = 0; i < this.selected.length; i++) {
          this.states[i] = this.selected[i].returnState
        }
      }
      for (let i = 0; i < this.selected.length; i++) {
        this.cids[i] = this.selected[i].cid
      }
    }
  }
}
</script>

<style scoped>
  #footer{
    margin-top: 50px;
  }
</style>
