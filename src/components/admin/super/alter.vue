<template>
  <div id="base_center">
    <el-container id="admin_home">
      <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
        <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
          <i class="el-icon-setting" style="margin-left: 15px"></i>
          <span style="margin-left: 30px;color: #e1f3d8">更改用户属性</span>
        </el-header>
        <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
          <!--template insertion-->
          <el-row style="margin-top: 20px">
            <el-col :span="7" v-for="one in attrs" :key="one" :offset="1">
              <el-card :body-style="{ padding: '0px' }" style="margin:0 10px 10px -20px; padding:30px; width: 300px">
                <img src="../../../assets/teacher.jpg" v-if="one.type === 'Teacher'" class="image" width="128px" height="128px">
                <img src="../../../assets/undergraduate.jpg" v-if="one.type === 'Undergraduate'" class="image" width="128px" height="128px">
                <img src="../../../assets/postgraduate.jpg" v-if="one.type === 'Postgraduate'" class="image" width="128px" height="128px">
                <div style="padding: 14px; margin-top:20px">
                  <h2 v-if="one.type === 'Teacher'">老师</h2>
                  <h2 v-if="one.type === 'Postgraduate'">研究生</h2>
                  <h2 v-if="one.type === 'Undergraduate'">本科生</h2>
                </div>
                <div style="margin-top:20px">
                  <div style="margin-top: 10px">
                    <span style="font-weight: bold; margin-right: 10px">最大借阅本数</span>
                    <el-input v-model="one.maxBorrow" style="width: 55px"></el-input>
                  </div>
                  <div style="margin-top: 10px">
                    <h4 style="font-weight: bold">预约超期时长</h4>
                    <el-input v-model="one.reserveDuration[0]" style="width: 50px"></el-input>
                    <span>天</span>
                    <el-input v-model="one.reserveDuration[1]" style="width: 50px"></el-input>
                    <span>时</span>
                    <el-input v-model="one.reserveDuration[2]" style="width: 50px"></el-input>
                    <span>分</span>
                    <el-input v-model="one.reserveDuration[3]" style="width: 50px"></el-input>
                    <span>秒</span>
                  </div>
                  <div style="margin-top: 10px; margin-bottom: 20px">
                    <h4 style="font-weight: bold; margin-right: 10px">借阅超期时长</h4>
                    <el-input v-model="one.borrowDuration[0]" style="width: 50px"></el-input>
                    <span>天</span>
                    <el-input v-model="one.borrowDuration[1]" style="width: 50px"></el-input>
                    <span>时</span>
                    <el-input v-model="one.borrowDuration[2]" style="width: 50px"></el-input>
                    <span>分</span>
                    <el-input v-model="one.borrowDuration[3]" style="width: 50px"></el-input>
                    <span>秒</span>
                  </div>
                  <el-button @click="alter(one.type, one.maxBorrow, one.reserveDuration, one.borrowDuration)">修改属性</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "alter",
  data () {
    return {
      attrs:[]
    }
  },
  methods: {
    alter (type, maxBorrow, reserveDuration, borrowDuration) {
      for (let i = 0;i < 4;i ++) {
        if (reserveDuration[i] == '' || borrowDuration[i] == '') {
          this.$message({showClose: true, type: 'error', message: '空格内不能为空' })
          return
        }
      }
      let time1 = reserveDuration[0] + ',' +reserveDuration[1] + ',' + reserveDuration[2] + ',' + reserveDuration[3]
      let time2 = borrowDuration[0] + ',' +borrowDuration[1] + ',' + borrowDuration[2] + ',' + borrowDuration[3]
      let fd = new FormData()
      fd.append('type', type)
      fd.append('maxBorrow', maxBorrow)
      fd.append('reserveDuration', time1)
      fd.append('borrowDuration', time2)
      if (reserveDuration[0] < 0 || borrowDuration[0] < 0) {
        this.$message({showClose: true, type: 'error', message: '天数：大于等于0的整数' })
        return
      }
      if (reserveDuration[1] < 0 || borrowDuration[1] < 0 || reserveDuration[1] > 23 || borrowDuration[1] > 23) {
        this.$message({showClose: true, type: 'error', message: '小时：0-23的整数' })
        return
      }
      for(let i = 2; i < 4;i++){
        if (reserveDuration[i] < 0 || borrowDuration[i] < 0 || reserveDuration[i] > 59 || borrowDuration[i] > 59) {
          this.$message({showClose: true, type: 'error', message: '分与秒：0-59的整数' })
          return
        }
      }
      this.$axios.post('/system/alterAttributes',fd).then(resp => {
        if (resp.data.message === 'success') {
          this.$message({showClose: true, type: 'success', message: '您已成功修改' })
        } else {
          this.$message({showClose: true, type: 'error', message: '修改失败，存在错误' })
        }
      })
    }
  },
  mounted () {
    this.$axios.post('/system/search/attributes').then(resp => {
      resp.data.attr1.reserveDuration = resp.data.attr1.reserveDuration.split(',')
      resp.data.attr1.borrowDuration = resp.data.attr1.borrowDuration.split(',')
      resp.data.attr2.reserveDuration = resp.data.attr2.reserveDuration.split(',')
      resp.data.attr2.borrowDuration = resp.data.attr2.borrowDuration.split(',')
      resp.data.attr3.reserveDuration = resp.data.attr3.reserveDuration.split(',')
      resp.data.attr3.borrowDuration = resp.data.attr3.borrowDuration.split(',')
      this.$set(this.attrs, 0, resp.data.attr1)
      this.$set(this.attrs, 1, resp.data.attr2)
      this.$set(this.attrs, 2, resp.data.attr3)
    })
  }
}
</script>

<style scoped>

</style>
