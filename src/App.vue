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
        </b-navbar-nav>
        <b-navbar-nav class='ml-auto'>
          <b-nav-item href="#">Contact</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid>
      <b-row id="main" no-gutters="true">
        <b-col><transition name='fade'> <router-view/> </transition></b-col>
      </b-row>
      <b-row>
        <b-col class="align-self-end"> © 2018 IR </b-col>
      </b-row>
      <b-row>
        <b-col>© 2018 IR</b-col>
      </b-row>
    </b-container>
    
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

body, html, #app { height: 100%; }
</style>
