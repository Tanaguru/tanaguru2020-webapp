<template>
    <div class="list-results" role="list">
        <div role="listitem" :class="'list-results__item list-results__item--' + status" v-for="status in orderedFilteredStatus" :key="status">
            <status-details
                    :id="'result-section' + status"
                    :page-content="pageContent"
                    :status="status"
                    :test-results="testResultByStatus[status]"
                    :reference="reference"
                    :test-by-id="testById"
                    :tagFilters="tagFilters"
                    :sharecode="sharecode"/>
        </div>
    </div>
</template>

<script>
    import StatusDetails from "./StatusDetail";
    export default {
        name: 'pageResultAnomalyView',
        props: ['testResultByStatus', 'tagFilters', 'reference', 'pageContent', 'testById', 'sharecode'],
        components: {StatusDetails},
        data(){
            return {
                statusFilter: {
                    failed: true,
                    cantTell: true,
                    inapplicable: true,
                    passed: true
                },
            }
        },
        computed: {
            orderedFilteredStatus() {
                let result = [];
                if (this.testResultByStatus['failed']) result.push('failed');
                if (this.testResultByStatus['cantTell']) result.push('cantTell');
                if (this.testResultByStatus['inapplicable']) result.push('inapplicable');
                if (this.testResultByStatus['passed']) result.push('passed');
                if (this.testResultByStatus['untested']) result.push('untested');
                return result;
            }
        }
    }
</script>

<style lang="scss" scoped>
.list-results {
	.list-results__item {
		position: relative;
		margin-bottom: 4.8rem;

		@media #{$media-md-viewport} {
			margin-bottom: 9.6rem;
		}

		&::after {
			@media #{$media-md-viewport} {
				display: block;
				position: absolute;
				top: 0;
				left: $left-column-desktop / 2;
				width: .1rem;
				height: 100%;
				transform: translateX(-50%);
				border-left: 2px dashed $border-secondary;
				content: "";
				z-index: -1;
			}
		}
	}
}

@media print {
	.list-results {
		.list-results__item {
			margin-bottom: 1.5rem;

			&::after {
				content: none;
			}
		}
	}
}
</style>
