<template>
	<nav role='navigation' aria-labelledby="breadcrumb-label" class="breadcrumb">
		<p id="breadcrumb-label" class="screen-reader-text">{{ $t('global.breadcrumbsHelp') }}</p>
		<ul class="breadcrumb-list list-unstyled">
			<li class="breadcrumb-list__item" v-for='(item, i) in breadcrumbsItems' :key='i'>
				<router-link v-if="i +1 !== breadcrumbsItems.length" :to='item.path'
							 class='link-simple link-simple--icon'><span>{{ item.name }}</span>
					<icon-base-decorative width="16" height="16" viewBox="0 0 24 24">
						<icon-arrow-blue/>
					</icon-base-decorative>
				</router-link>
				<span class="current-page" v-else aria-current='page'>{{ item.name }}</span>
			</li>
		</ul>
	</nav>
</template>

<script>
import IconBaseDecorative from './icons/IconBaseDecorative'
import IconArrowBlue from './icons/IconArrowBlue'

export default {
	name: 'Breadcrumbs',
	props: ['breadcrumbsItems'],
	components: {
		IconBaseDecorative,
		IconArrowBlue
	}
}
</script>

<style lang="scss" scoped>
.breadcrumb {
	padding-top: 2.4rem;
	padding-bottom: 2.4rem;

	@media #{$media-md-viewport} {
		padding-top: 4.8rem;
		padding-bottom: 4.8rem;
	}
}

.breadcrumb-list {
	list-style: none;
	color: $text-secondary;

	&__item {
		display: inline-block;
	}

	.current-page {
		vertical-align: middle;
		color: $text-primary;
	}
}
</style>
