<template>
  <div id="userInfo">
    <div class="customerDetail">
      <h4 style="text-align: left">用户信息:</h4>
      <div>
        <!--用户缩略图，图片，信息，信用分，用户名，邮箱-->
        <el-card style="display: inline-block; width: 100%; height: 400px">
          <img src="../../assets/teacher.jpg" v-if="this.type === 'Teacher'" class="image">
          <img src="../../assets/undergraduate.jpg" v-if="this.type === 'Undergraduate'" class="image">
          <img src="../../assets/postgraduate.jpg" v-if="this.type === 'Postgraduate'" class="image">
          <div style="text-align: left; display: inline-block; padding-top: 10px">
            <h3 style="padding-top: 15px">用户名：{{this.username}}</h3>
            <h3 style="padding-top: 15px">邮箱：{{this.email}}</h3>
            <h3 style="padding-top: 15px">用户类型：{{this.type}}</h3>
            <h3 style="padding-top: 15px">信用分：{{this.score}}</h3>
            <el-button type="primary" style="margin-top: 20px;margin-right: 30px" @click="goToMyComments">查看评论</el-button>
            <el-button type="primary" style="margin-top: 20px" @click="changePassword">修改密码</el-button>
          </div>
        </el-card>
      </div>
      <div>
        <fine1 :is-fine-log="false" :list="listOfFine"></fine1>
      </div>
      <div>
        <fine2 :is-fine-log="true" :list="listOfFineInfo"></fine2>
      </div>
      <div>
        <h4  style="text-align: left">借阅详情：</h4>
        <detail-show :list="list" :view-type="6" :is-select="false"></detail-show>
      </div>
    </div>
  </div>
</template>
<script>
import detail from '../modules/details.vue'
import fine1 from '../modules/fine.vue'
import fine2 from '../modules/fine.vue'
export default {
  name: 'UserInfo',
  components: {
    'detail-show': detail,
    fine1,
    fine2
  },
  data () {
    return {
      username: this.$store.state.username,
      email: (this.$store.state.username === 'admin') ? '暂无' : this.$store.state.username + '@fudan.edu.cn',
      list: [],
      listOfFine: [],
      listOfFineInfo: [],
      score: 0,
      type: ''
    }
  },
  methods: {
    // 获取操作信息
    changePassword (username) {
      this.$router.push({
        // 携带ISBN参数跳转
        path: '/changePassword'
      })
    },
    goToMyComments () {
      this.$router.push({
        path: '/myComments'
      })
    }
  },
  mounted () {
    let fd = new FormData()
    fd.append('token', this.$store.state.token)
    this.$axios.post('/reader/search/userInfo', fd).then(resp => {
      console.log(resp)
      this.score = resp.data.basicInfo.score
      this.type = resp.data.basicInfo.attributes.type
      this.list = resp.data.logList
      this.listOfFine = resp.data.copyList
      this.listOfFineInfo = resp.data.payLogList
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].picFile.file = 'data:image/png;base64,' + this.list[i].picFile.file
      }
      for (let i = 0; i < this.listOfFine.length; i++) {
        this.listOfFine[i].prototype.picFile.file = 'data:image/png;base64,' + this.listOfFine[i].prototype.picFile.file
      }
      for (let i = 0; i < this.listOfFineInfo.length; i++) {
        this.listOfFineInfo[i].picFile.file = 'data:image/png;base64,' + this.listOfFineInfo[i].picFile.file
      }
    })
  }
}
</script>

<style scoped>
  .customerDetail{
    width: 90%;
    margin: auto;
  }
  .image{
    width: 300px;
    height: 300px;
    display: inline-block;
    border-radius: 200px;
    float: left;
    margin: 30px 30px 10% 15%;
  }
</style>
