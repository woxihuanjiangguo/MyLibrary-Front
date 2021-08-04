<template>
  <el-container id="admin_home">
    <el-container id="admin_home_right" style="margin-right: 50px;margin-top: 15px;opacity: 90%;border-radius: 15px;">
      <el-header style="text-align: left;font-size: 20px; color: #d9d9d9;background-color: #545c64;
    color: #333;line-height: 60px;border-radius: 15px;">
        <i class="el-icon-setting" style="margin-left: 15px"></i>
        <span style="margin-left: 30px;color: #e1f3d8">主页</span>
      </el-header>
      <el-main style="height: 680px; background: #c6e2ff;opacity: 99%;border-radius: 15px;margin-top: 30px;">
        <div style="text-align: left">今日事务：暂无</div>
        <!--template insertion-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'AdminHome'
}
</script>

<style scoped>
</style>
