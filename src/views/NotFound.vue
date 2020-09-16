<template>
    <main role="main" id="page" class="wrapper not-found">
        <h1 class="not-found__title">{{$t('page.notFound')}}</h1>
        <router-link class="link-independent link-independent--icon" to="/">
			<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
			<span>{{$t('action.backHome')}}</span>
		</router-link>
    </main>
</template>

<script>
import IconBaseDecorative from '../components/icons/IconBaseDecorative'
import IconArrowBlue from '../components/icons/IconArrowBlue'

export default {
	name: 'NotFound',
	components: {
		IconBaseDecorative,
		IconArrowBlue
	},
	metaInfo(){
    return {
        // if no subcomponents specify a metaInfo.title, this title will be used
      title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.notFound"),
    }
  },
}
</script>

<style lang="scss" scoped>
.not-found {
	.not-found__title {
		margin-top: 8rem;
	}
}
</style>
