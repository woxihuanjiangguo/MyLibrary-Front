<template>
    <div id="base_notFound">
      <h1>404 Not Found!</h1>
      <router-link to="/">
        <el-button type=""
                   style="width: 40%;background: #afb4db;border: none;color: antiquewhite">返回主页</el-button>
      </router-link>
    </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
#base_notFound{
  margin-top: 200px;
}
</style>
