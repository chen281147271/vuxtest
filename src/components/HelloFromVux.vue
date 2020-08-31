<template>
  <el-container>
    <el-header>考勤查询</el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="QueryAtt" theme="dark" v-bind:router="true">
          <el-menu-item index="/">考勤查询</el-menu-item>
          <el-menu-item index="ValidateATT">出勤记录统计</el-menu-item>
          <el-menu-item index="userinfo">出勤人员维护</el-menu-item>
          <el-menu-item index="YGInfo">员工信息</el-menu-item>

        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>rsszy.com</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!',
    }
  },
  watch:{
    '$route' (to, from) {
      // 对路由变化作出响应...
      console.log(to);
    }
  },
  computed:{
    indexUrl(){
      return this.$store.state.indexUrl
    }
  }
}
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
