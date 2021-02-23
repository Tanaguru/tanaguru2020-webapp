<template>
    <div>
        <h2>{{ $t('auditDetail.pages') }} ({{totalElements}})</h2>
        <div role="list" class="list-pages" v-if="audit && pages.length > 0">
            <p role="listitem" class="list-pages__item" v-for="(page, i) of pages" :key="page.id">
                <span class="list-pages__number">{{minElementIndex + i}}.</span>
				<router-link class="link-simple" :to="'/audits/' + audit.id + '/pages/' + page.id + (audit.sharecode ? '/' + audit.sharecode : '')">{{ page.name }} ({{page.url}})</router-link>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "pageList",
    props: ['audit', 'pages', 'totalElements', 'totalPages', 'currentPage', 'elementByPage'],
    computed: {
        minElementIndex(){
            return this.currentPage * this.elementByPage + 1;
        }
    }
}
</script>

<style lang="scss" scoped>
.list-pages {
	margin: 0 0 2.4rem 3.5rem;
	text-indent: -3.5rem;

	.list-pages__item {
		margin: 0 0 .5rem;
	}

	.list-pages__number {
		margin-right: 1rem;
		color: $text-secondary;
	}
}
</style>
