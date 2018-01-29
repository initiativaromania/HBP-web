<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark" fixed="top" :sticky="true">
      <b-navbar-toggle target="nav_collapse" />
      <b-navbar-brand :to="{name: 'Home'}">HBP</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav>
          <b-nav-item :to="{name: 'Home'}">Hartă</b-nav-item>
          <b-nav-item href="#">Info</b-nav-item>
          <b-nav-item href="#">Top</b-nav-item>
          <b-nav-item href="#">Contact</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-12"> <router-view/> </div>
      </div>
      <div class="row">
        <div class="col"> © 2018 IR </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
} */
</style>
