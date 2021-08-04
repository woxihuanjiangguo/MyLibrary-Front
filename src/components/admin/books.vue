<template>
  <div id="base_books">
    <el-container id="admin_home">
      <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
        <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    line-height: 60px;border-radius: 15px;">
          <i class="el-icon-setting" style="margin-left: 15px"></i>
          <span style="margin-left: 30px;color: #e1f3d8">查看书本</span>
        </el-header>
        <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
          <!--template insertion-->
          <thumbnails style="width: 100%" :admin-list="true"></thumbnails>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import thumbnails from '../user/searchAndShow.vue'
export default {
  name: 'Books',
  components: {
    thumbnails
  }
}
</script>

<style scoped>
</style>
