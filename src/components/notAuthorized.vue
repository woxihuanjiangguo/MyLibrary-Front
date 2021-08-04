<template>
  <div id="base_notAuthorized">
    <h1>You are not authorized to browse this page!</h1>
    <router-link to="/">
      <el-button type=""
                 style="width: 40%;background: #afb4db;border: none;color: antiquewhite">返回主页</el-button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotAuthorized'
}
</script>

<style scoped>
  #base_notAuthorized{
    margin-top: 200px;
  }
</style>
