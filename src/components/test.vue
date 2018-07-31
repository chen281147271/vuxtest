<template>
  <h1>
    {{Hello}}
  </h1>
</template>

<script>
    export default {
        name: "test",
      data() {
        return {
          Hello:'HelloWorld!'
        }
      }
    }
</script>

<style scoped>
h1{
  text-align: center;
}
</style>
