<template>
  <div id="base_home">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3>Welcome to FUDAN library!</h3>
      </el-carousel-item>
    </el-carousel>
    <div style="margin-left: 4%">
      <el-row>
        <el-col :span="6" v-for="proto in protoList" :key="o" :offset="1">
          <el-card style="margin:10px; margin-left: 60px; height: 330px" v-if="proto !== null">
            <img :src="proto.picFile.file" style="height: 200px; width: 150px; object-fit: cover; border-radius: 20px">
            <div style="padding: 10px">
              <h1 style="font-size: 20px">{{proto.bookName}}</h1>
              <div class="bottom clearfix">
                <h2 class="time">{{proto.author}}</h2>
              </div>
            </div>
          </el-card>
          <el-card style="margin:10px; margin-left: 60px; height: 330px" v-else>
            <img src="../assets/logo.jpg" style="height: 200px; width: 150px; object-fit: cover; border-radius: 20px">
            <div style="padding: 10px">
              <h1 style="font-size: 20px">暂无</h1>
              <div class="bottom clearfix">
                <h2 class="time">暂无</h2>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        protoList: [],
      }
    },
    created() {
      let fd = new FormData()
      fd.append('number', 'default')
      this.$axios.post('/books/search/all', fd).then(resp => {
          console.log(resp)
          // 暂未实现
          for (let i = 0; i < resp.data.prototypeList.length; i++) {
            this.$set(this.protoList, i, resp.data.prototypeList[i])
            this.protoList[i].picFile.file = 'data:image/png;base64,' + this.protoList[i].picFile.file
          }
          while (this.protoList.length < 6) {
            this.$set(this.protoList, this.protoList.length, null)
          }
        }
      )
    }
  }
</script>

<style scoped>
  #base_home {
    background: url("../assets/background.jpg") repeat center;
    background-size: cover;
    width: 100%;
    height: 100%;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel, .el-row {
    width: 70%;
    margin: auto;
  }

  .el-carousel {
    margin-top: 30px;
    height: 400px;
    padding-top: 50px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .el-card {
    width: 80%;
  }

  h2.time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    margin: auto;
    width: 90%;
    height: 90%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
