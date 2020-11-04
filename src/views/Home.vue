<template>
    <dashboard v-if="$store.state.auth.user"/>
    <Login v-else/>
</template>

<script>

import dashboard from './Dashboard';
import Login from "./Login";
export default {
    name: 'home',
    components: {Login, dashboard},
    metaInfo() {
        return {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.home"),
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
