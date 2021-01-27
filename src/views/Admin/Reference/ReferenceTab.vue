<template>
	<article>
		<header class="headline--top">
			<h1>{{ $t('page.adminReferences') }}</h1>
		</header>

		<section>
			<h2 class="admin-references__title-2">{{ $t('references.referencesList') }}</h2>
			<div class="table-container" v-if="references.length > 0">
				<table class="table table--default table-references">
					<caption class="screen-reader-text">{{ $t('references.legendReferences') }}</caption>

					<thead>
					<tr>
						<th scope="col">{{ $t('entity.reference.name') }}</th>
						<th scope="col">{{ $t('entity.generic.actions') }}</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="reference of notDeletedReferences" :key="reference.id">
						<td class="td-title">{{ reference.name }} ({{ reference.code }})</td>
						<td class="td-actions">
							<button
								v-if="$store.state.auth.authorities['DELETE_REFERENCE']"
								type="button"
								class="btn btn--icon btn--nude"
								@click="removeReference(reference)">
								<icon-base-decorative>
									<icon-delete/>
								</icon-base-decorative>
								<span>{{ $t('action.delete') }}</span>
							</button>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<p v-else>{{ $t('references.noReference') }}</p>
		</section>

		<section v-if="$store.state.auth.authorities['CREATE_REFERENCE']">
			<h2>{{ $t('references.referenceCreateForm') }}</h2>
			<tanaguru-test-import :existing-references="references"
								  @addReference="onAddReference"></tanaguru-test-import>
		</section>
	</article>
</template>

<script>
import TanaguruTestImport from "./TanaguruTestImport.vue";
import IconArrowBlue from "@/components/icons/IconArrowBlue";
import IconBaseDecorative from "@/components/icons/IconBaseDecorative";

export default {
	name: 'referenceTab',
	components: {TanaguruTestImport, IconBaseDecorative, IconArrowBlue},
	data() {
		return {
			references: []
		}
	},
	props: [ 'selected'],
	created() {
		this.testHierarchyService.findAllReferences(
			(references) => {
				this.references = references;
			},
			(error) => {
				console.error(error)
			}
		)
	},
	methods: {
		onAddReference(reference) {
			this.references.push(reference);
		},

		removeReference(reference) {
			this.testHierarchyService.deleteReference(reference.id,
				() => {
					reference.deleted = true;
				},
				(error => {
					console.error(error)
				})
			)
		}
	},
	computed: {
		notDeletedReferences() {
			return this.references.filter(reference => {
				return !reference.deleted
			})
		}
	}
}

</script>

<style lang="scss">

</style>
