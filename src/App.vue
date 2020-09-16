<template>
  <div id="app">
    <Header></Header>
    <router-view :key="$route.fullPath"></router-view>
	<Footer></Footer>
    <session-popup :bus="bus"/>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
import SessionPopup from "./components/SessionPopup";
import {bus} from './main';
export default {
  components: {
    SessionPopup,
    Header,
	  Footer,
    bus
  },
    data(){
      return {
          bus:bus
      }
    }
}
</script>

<style lang="scss">
@import "@/scss/style.scss";
</style>
