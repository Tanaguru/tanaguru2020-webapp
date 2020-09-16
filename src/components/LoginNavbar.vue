<template>
    <div>
        <template v-for="navbarLink in showableNavbarLinks">
            <router-link exact v-if="navbarLink.isInternal" :to="navbarLink.url" class="btn btn--default">
                <span>{{navbarLink.i18n && navbarLink.i18n[$i18n.locale] ? navbarLink.i18n[$i18n.locale] : $t(navbarLink.name)}}</span>
            </router-link>
            <a v-else :href="navbarLink.url" class="btn btn--default">
                <span>{{navbarLink.i18n && navbarLink.i18n[$i18n.locale] ? navbarLink.i18n[$i18n.locale] : $t(navbarLink.name)}}</span>
            </a>

        </template>
    </div>
</template>

<script>
    export default {
        name: 'loginNavbar',
        computed: {
            showableNavbarLinks() {
                return this.NAVBAR_LINKS.filter((navbarLink) =>{
                    return navbarLink.showOffline;
                })
            }
        }
    }
</script>
