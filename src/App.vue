<template>
  <div class="container" id="app">
    <div class="row">
      <div class="col-xs-12"> <img src="./assets/logo.png"> </div>
    </div>
    <div class="row">
      <div class="col"> <router-view/> </div>
    </div>
    <div class="row">
      <div class="col"> © 2018 IR </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
