<template>
    <dashboard v-if="$store.state.auth.user"/>
    <Login v-else/>
</template>

<script>

import dashboard from './Dashboard/Dashboard';
import Login from "./Login";
export default {
    name: 'home',
    components: {Login, dashboard},
    metaInfo() {
        return {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.home"),
        }
    },
    created(){
        if(!this.$store.state.auth.user){
            var homeModule = this.$store.getters.getHomeModule;
            if(homeModule){
                this.$router.push('/external-module/'+homeModule.name)
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
