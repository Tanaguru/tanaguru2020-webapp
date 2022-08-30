<template>
    <div>
        <div role="list" class="list-pages" v-if="audit && pages.length > 0 && pages.length === pagesResult.length">
            <p role="listitem" class="list-pages__item  list-pages__item-overflow" v-for="(page, i) of pagesResult" :key="page.id">
                <span class="list-pages__number">{{minElementIndex + i}}.</span>
                <router-link class="link-simple" :to="'/audits/' + audit.id + '/pages/' + page.id + (audit.sharecode ? '/' + audit.sharecode : '')">
                    {{ page.percentage }}% / {{ page.nbAnomaly }} <span v-if="page.nbAnomaly > 1">{{$t('auditDetail.pageList.anomalies')}}</span><span v-else>{{$t('auditDetail.pageList.anomaly')}}</span> / {{ page.name }}
                </router-link>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "pageList",
    props: ['audit', 'pages', 'totalElements', 'totalPages', 'currentPage', 'elementByPage'],
    data() {
        return {
            pagesResult: []
        }
    },
    watch: { 
      	pages: function(newVal, oldVal) {
            var oldId = oldVal.map(el => el.id);
            var newId = newVal.map(el => el.id);
            var pagesHasChanged = newId.filter(e => !oldId.includes(e)).length > 0;
            if(pagesHasChanged) {
                this.pages.forEach(page => this.loadPagesStatusResult(page));
            }
        }
    },
    methods: {
        loadPagesStatusResult(page) {
            this.statusResultService.findMainStatusResultByPage(
                page.id,
                this.sharecode,
                (results) => {
                    Object.assign(page, {
                        percentage: Math.round((results.nbTP / (results.nbTP + results.nbTF)) * 100),
					    nbAnomaly: results.nbEF
                    });
                    this.pagesResult.push(page);
                },
                (error) => {
                    console.error(error);
                }
            )
        }
    },
    computed: {
        minElementIndex(){
            return this.currentPage * this.elementByPage + 1;
        }
    }
}
</script>

<style lang="scss" scoped>
.list-pages {
	margin: 0 0 2.4rem 0;
	// text-indent: -3.5rem;

	.list-pages__item {
		margin: 0 0 .5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
	}

	.list-pages__number {
		margin-right: 1rem;
		color: $text-secondary;
	}
}
</style>
