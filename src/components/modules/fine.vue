<template>
  <!--一个罚单组件-->
  <div v-if="list !== null && list[0] !== null">
    <h4 style="text-align: left" v-if="isFineLog">罚款记录：</h4>
    <h4 style="text-align: left" v-else>罚款详情：</h4>
    <el-table :data="list"
      border style="width: 100%" >
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column label="图书" v-if="!isFineLog">
        <template slot-scope="scope">
          <img :src="scope.row.prototype.picFile.file" width="40" height="60" />
        </template>
      </el-table-column>
      <el-table-column label="图书" v-if="isFineLog">
        <template slot-scope="scope">
          <img :src="scope.row.picFile.file" width="40" height="60" />
        </template>
      </el-table-column>
      <el-table-column prop="cid" label="cid">
      </el-table-column>
      <el-table-column prop="prototype.bookName" label="书名" v-if="!isFineLog">
      </el-table-column>
      <el-table-column prop="bookName" label="书名" v-if="isFineLog">
      </el-table-column>
      <el-table-column prop="tempPrice" label="需付金额" v-if="!isFineLog">
      </el-table-column>
      <el-table-column prop="pricePaid" label="所付金额" v-if="isFineLog">
      </el-table-column>
      <el-table-column prop="payTime" label="支付时间" v-if="isFineLog">
      </el-table-column>
      <el-table-column  label="提交罚款"  v-if="!isFineLog">
        <template slot-scope="scope" >
          <el-button  @click="payFine(scope.row.cid)">罚款</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    // true表示罚款记录
    isFineLog: Boolean,
    list: Array
  },
  data () {
    return {
    }
  },
  methods: {
    // 支付罚款
    payFine (cid) {
      let fd = new FormData()
      fd.append('cid', cid)
      fd.append('token', this.$store.state.token)
      this.$axios.post('/reader/pay', fd
      ).then(resp => {
        if (resp.data.message === 'success') {
          this.$message({
            showClose: true,
            type: 'success',
            message: resp.data.message
          })
          window.location.reload()
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: resp.data.message
          })
        }
      })
    }
  }
}
</script>
