<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark" fixed="bottom" :sticky="false">
      <b-navbar-nav class="pl-5" />
      <b-navbar-brand :to="{name: 'Home'}"><b>Harta Banilor Publici</b></b-navbar-brand>
      <b-navbar-toggle target="nav_collapse" />
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto pr-5">
          <b-nav-item :to="{name: 'Home'}">Hartă</b-nav-item>
          <b-nav-item href="#">Info</b-nav-item>
          <b-nav-item href="#">Statistici</b-nav-item>
          <b-nav-item href="#">Contact</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid>
      <b-row id="main" no-gutters="true">
        <b-col><transition name='fade'> <router-view/> </transition></b-col>
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
#app { position: relative; }

#app > .container-fluid {
    padding: 0;
    height: 100%;
    top: 0; bottom: 0;
    padding-bottom: 100px;
}

#main {
    width: 100%; height: 100%;
}

.navbar {
  height: 100px;
}

.navbar-brand {
    font-size: 1.5em;
}

.navbar .nav-item {
    width: 75px;
    text-align: center;
}

.navbar .nav-item > a.active {
    border-bottom: 4px white solid;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
