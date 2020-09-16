<template>
	<ul v-show="totalPages > 1" class="pagination">
		<li class="pagination__item">
			<button type="button" class="btn btn-pagination btn-pagination--before" v-if="currentPage > 0" @click="$emit('changePage', 0)">
				<icon-base-decorative viewBox="0 0 24 24"><icon-arrow-double /></icon-base-decorative>
				<span class="screen-reader-text">{{ $t('pagination.first') }}</span>
			</button>
		</li>

		<li class="pagination__item">
			<button type="button" class="btn btn-pagination btn-pagination--before" v-if="currentPage > 0" @click="$emit('changePage', currentPage - 1)">
				<icon-base-decorative viewBox="0 0 24 24"><icon-arrow-blue /></icon-base-decorative>
				<span class="screen-reader-text">{{ $t('pagination.previous') }}</span>
			</button>
		</li>

		<li class="pagination__item">
			<span class="pages">{{ currentPage + 1 }} / {{totalPages}}</span>
		</li>

		<li class="pagination__item">
			<button type="button" class="btn btn-pagination btn-pagination--next" v-if="currentPage +1 < totalPages" @click="$emit('changePage', currentPage + 1)">
				<icon-base-decorative viewBox="0 0 24 24"><icon-arrow-blue /></icon-base-decorative>
				<span class="screen-reader-text">{{ $t('pagination.next') }}</span>
			</button>
		</li>

		<li class="pagination__item">
			<button type="button" class="btn btn-pagination btn-pagination--next" v-if="currentPage +1 < totalPages" @click="$emit('changePage', totalPages - 1)">
				<icon-base-decorative viewBox="0 0 24 24"><icon-arrow-double /></icon-base-decorative>
				<span class="screen-reader-text">{{ $t('pagination.last') }}</span>
			</button>
		</li>
	</ul>
</template>

<script>
import IconBaseDecorative from './icons/IconBaseDecorative'
import IconArrowBlue from './icons/IconArrowBlue'
import IconArrowDouble from './icons/IconArrowDouble'

export default {
    name:'pagination',
	props: ['totalPages', 'currentPage'],
	components: {
		IconBaseDecorative,
		IconArrowDouble,
		IconArrowBlue
	}
}
</script>
