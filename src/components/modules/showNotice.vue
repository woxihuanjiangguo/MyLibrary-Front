<template>
  <el-popover
    placement="right"
    width="400"
    trigger="hover"
  >
    <el-table :data="list" border style="width: 100%" >
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column label="图书">
        <template slot-scope="scope">
          <img :src="scope.row.prototype.picFile.file" width="40" height="60"/>
        </template>
      </el-table-column>
      <el-table-column prop="cid" label="cid" >
      </el-table-column>
      <el-table-column prop="prototype.bookName" label="书名" >
      </el-table-column>
      <el-table-column  label="提醒">
        <template slot-scope="scope" >
          <div v-if="scope.row.state == 'reserved'" style="color: #7fe5ff">待取书</div>
          <div v-else-if="scope.row.state == 'borrowed'" style="color: #ffa87f">待还书</div>
          <div v-else-if="scope.row.tag != ''" style="color:red">未付款</div>
        </template>
      </el-table-column>
    </el-table>
    <el-button slot="reference" style="color: coral">注意</el-button>
  </el-popover>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      list2: [],
    }
  },
  mounted () {
    let fd = new FormData()
    fd.append('token', localStorage.getItem('token'))
    this.$axios.post('/reader/search/showNotice', fd).then(resp => {
      console.log(resp)
      this.list = resp.data.copyListHandle
      this.list2 = resp.data.copyListUnpaid
      for (let i = 0;i < this.list2.length; i++) {
        this.list.push(this.list2[i])
      }
      for (let i = 0;i< this.list.length;i ++) {
        this.list[i].prototype.picFile.file = 'data:image/png;base64,' + this.list[i].prototype.picFile.file
      }
    })

  }
}
</script>

<style scoped>
</style>
