<template>
  <div id="base_upload">
    <el-container id="admin_home">
      <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px">
        <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
          <i class="el-icon-setting" style="margin-left: 15px"></i>
          <span style="margin-left: 30px;color: #e1f3d8">图书上新</span>
        </el-header>
        <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px">
          <!--template insertion-->
          <el-form
            label-width="80px"
            enctype="multipart/form-data"
            :model="addForm"
            :rules="rules"
            ref="addForm"
          >
            <el-form-item label="书名" prop="bookName">
              <el-input
                size="mini"
                v-model="addForm.bookName"
                auto-complete="false"
                placeholder="请输入图书名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input
                size="mini"
                v-model="addForm.author"
                auto-complete="false"
                placeholder="请输入作者"
              ></el-input>
            </el-form-item>
            <el-form-item label="ISBN" prop="ISBN">
              <el-input
                size="mini"
                v-model="addForm.ISBN"
                auto-complete="false"
                placeholder="请输入编号"
              ></el-input>
            </el-form-item>
            <el-form-item label="出版时间" prop="publishTime">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择时间" v-model="addForm.publishTime"
                                style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="图书价格" prop="priceInt" style="width: 450px; display: inline-block">
              <el-input
                size="mini"
                v-model="addForm.priceInt"
                auto-complete="false"
                placeholder="请输入图书价格整数"
              ></el-input>
            </el-form-item>
            <span>.</span>
            <el-form-item prop="priceFloat" style="display: inline-block">
              <el-input
                size="mini"
                v-model="addForm.priceFloat"
                auto-complete="false"
                style="width: 50px"
              ></el-input>
            </el-form-item>
            <el-form-item label="图书数量" prop="bookNum">
              <el-input
                size="mini"
                v-model="addForm.bookNum"
                auto-complete="false"
                placeholder="请输入图书数量"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="图书详情" prop="intro">
              <el-input
                size="mini"
                v-model="addForm.intro"
                auto-complete="false"
                placeholder="请输入图书介绍"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="图书封面" prop="fileImg">
              <el-upload
                name="fileImg"
                class="avatar-uploader"
                action=""
                :auto-upload='false'
                :limit="1"
                :data="addForm"
                :show-file-list="false"
                accept="image/png,image/gif,image/jpg,image/jpeg"
                :on-change="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :on-remove="remove"
                ref="upload"
              >
                <img v-if="updateUrl" :src="updateUrl" @click="preview" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过2MB
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="submitBtn" style="width: 124px;">提 交</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  data () {
    return {
      addForm: {
        fileImg: '',
        // 编辑时数据
        token: localStorage.getItem('token'),
        // bid: '0'
        bookName: '',
        author: '',
        intro: '',
        ISBN: '',
        publishTime: '',
        bookNum: 0,
        priceInt: '0',
        priceFloat: '00'
      },
      fd: '',
      updateUrl: '',
      rules: {
        fileImg: [{required: true, message: '请上传图片', trigger: 'blur'}],
        bookName: [{required: true, message: '请输入书名', trigger: 'blur'}],
        author: [{required: true, message: '请输入作者', trigger: 'blur'}],
        intro: [{required: true, message: '请填写介绍', trigger: 'blur'}],
        // xxx-x-xxx-xxxxx-x
        ISBN: [{required: true, message: '请输入编号', trigger: 'blur'}, {pattern: /^\d{3}-\d-\d{3}-\d{5}-\d$/, message: 'xxx-x-xxx-xxxxx-x', trigger: 'blur'}],
        publishTime: [{required: true, message: '请输入发布时间', trigger: 'blur'}],
        bookNum: [{required: true, message: '请输入本数', trigger: 'blur'}, {
          pattern: /[0-9]+/,
          message: '请输入数字',
          trigger: 'blur'
        }],
        priceInt: [{required: true, message: '请输入价格', trigger: 'blur'},{pattern: /^[1-9][0-9]*$/, message: '请输入正确数字', trigger: 'blur'}],
        priceFloat: [{required: true, message: '请输入价格', trigger: 'blur'},{pattern: /^[0-9]{2}$/, message: '请输入两位数字', trigger: 'blur'}]
      }
    }
  },
  methods: {
    // 成功时调用
    handleAvatarSuccess (res, file) {
    },
    remove () {
      this.updateUrl = ''
      this.addForm.fileImg = ''
    },
    // 点击图片后能跟换图片
    preview (file) {
      this.$refs['upload'].clearFiles()
      this.remove()
    },
    // 在查找图片时调用，on_change函数
    beforeAvatarUpload (file, filelist) {
      const isLt2M = file.size / 1024 / 1024 < 2
      filelist = []
      if (!isLt2M) {
        this.$message.warning('上传头像图片大小不能超过 2MB!')
        this.preview()
        return
      } else {
        this.updateUrl = URL.createObjectURL(file.raw)
      }
      this.addForm.fileImg = file.raw
      return isLt2M
    },
    // 上传时调用
    submitBtn () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          var fd = new FormData()
          if (this.addForm.fileImg != null) {
            fd.append('fileImg', this.addForm.fileImg)
          }
          fd.append('bookName', this.addForm.bookName)
          fd.append('author', this.addForm.author)
          fd.append('intro', this.addForm.intro)
          fd.append('ISBN', this.addForm.ISBN)
          fd.append('publishTime', this.addForm.publishTime)
          fd.append('price', this.addForm.priceInt + '.' + this.addForm.priceFloat)
          this.$axios.post('/system/upload',
            fd)
            .then(resp => {
              console.log(resp)
              if (resp.data.message === 'success') {
                this.$message({showClose: true, type: 'success', message: '上传成功'})
                window.location.reload()
              } else {
                this.$message({showClose: true, type: 'error', message: resp.data.message})
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: '请检查表单信息的正确性'
          })
          return false
        }
      })
    }
  }
}

</script>

<style>
  input[type="file"] {
    display: none;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 170px;
    height: 178px;
    display: block;
  }
  .el-form{
    width: 600px;
    margin: auto;
    margin-top: 50px;
  }
</style>
