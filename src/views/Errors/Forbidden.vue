<template>
    <main role="main" id="page" class="wrapper forbidden">
        <h1 class="forbidden__title">{{$t('page.forbidden')}}</h1>
        <p>{{$t('error.forbidden.message')}}</p>
        <router-link class="link-independent link-independent--icon" to="/">
			<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
			<span>{{$t('action.backHome')}}</span>
		</router-link>
    </main>
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconArrowBlue from '../../components/icons/IconArrowBlue'

export default {
	name: 'Forbidden',
	components: {
		IconBaseDecorative,
		IconArrowBlue
	},
	metaInfo(){
    return {
        // if no subcomponents specify a metaInfo.title, this title will be used
      title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.forbidden"),
    }
  },
}
</script>

<style lang="scss" scoped>
.forbidden {
	.forbidden__title {
		margin-top: 8rem;
	}
}
</style>
