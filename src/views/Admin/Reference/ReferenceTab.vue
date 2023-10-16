<template>
	<article>
		<header class="headline--top">
			<h1>{{ $t('page.adminReferences') }}</h1>
		</header>

		<section>
			<h2 class="admin-references__title-2">{{ $t('references.referencesList') }}</h2>
			<div class="table-container" v-if="references_page && references_page.content.length > 0">
				<table class="table table--default table-references">
					<caption class="screen-reader-text">{{ $t('references.legendReferences') }}</caption>

					<thead>
						<tr>
							<th scope="col">{{ $t('entity.reference.name') }}</th>
							<th scope="col">{{ $t('entity.generic.actions') }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="reference of references_page.content" :key="reference.id">
							<td class="td-title">{{ reference.name }} ({{ reference.code }})</td>
							<td class="td-actions">
								<ul class="actions-list">
									<li class="actions-list__item checkbox">
										<input :id="reference.code" type="checkbox" :checked="reference.isDefault" :disabled="!$store.state.auth.authorities['CREATE_REFERENCE']" class="checkbox__input" @change="setReferenceAsDefault(reference)">
										<label :for="reference.code" class="checkbox__label">{{ $t('action.defaultReference') }}</label>
									</li>
									<li class="actions-list__item" v-if="$store.state.auth.authorities['DELETE_REFERENCE']">
										<button type="button"
											class="btn btn--icon btn--nude" @click="removeReference(reference)">
											<icon-base-decorative>
												<icon-delete />
											</icon-base-decorative>
											<span>{{ $t('action.delete') }}</span>
										</button>
									</li>
								</ul>
							</td>
						</tr>
					</tbody>
				</table>

				<pagination :current-page="references_page.number" :total-pages="references_page.totalPages"
					@changePage="(page) => { loadReferences(page, referencesPageSize) }" />

			</div>
			<p v-else>{{ $t('references.noReference') }}</p>
		</section>

		<section v-if="$store.state.auth.authorities['CREATE_REFERENCE']">
			<h2>{{ $t('references.referenceCreateForm') }}</h2>
			<tanaguru-test-import @addReference="onAddReference"></tanaguru-test-import>
		</section>
	</article>
</template>

<script>
import TanaguruTestImport from "./TanaguruTestImport.vue";
import IconArrowBlue from "@/components/icons/IconArrowBlue";
import IconBaseDecorative from "@/components/icons/IconBaseDecorative";
import Pagination from "../../../components/Pagination";

export default {
	name: 'referenceTab',
	components: { TanaguruTestImport, IconBaseDecorative, IconArrowBlue, Pagination },
	data() {
		return {
			references_page: null,
			referencesPageSize: 5
		}
	},
	props: ['selected'],
	created() {
		this.loadReferences(0, this.referencesPageSize)
	},
	methods: {
		onAddReference(reference, webextVersion) {
			this.loadReferences(this.references_page.number, this.referencesPageSize);
			this.webextentionService.createWebextentionVersion(reference.id, webextVersion,
				(res) => {
					this.$store.dispatch('getWebextVersion');
				},
				(error) => {
					console.error(error)
				}
			)
		},

		removeReference(reference) {
			this.testHierarchyService.deleteReference(reference.id,
				() => {
					this.loadReferences(0, this.referencesPageSize);
					this.$store.dispatch('getWebextVersion');
				},
				(error => {
					console.error(error)
				})
			)
		},
		setReferenceAsDefault(reference) {
			this.testHierarchyService.setReferenceAsDefault(reference.id,
				() => {
					this.loadReferences(0, this.referencesPageSize);
					this.$store.dispatch('getWebextVersion');
				},
				(error => {
					console.error(error)
				})
			)
		},
		loadReferences(page, size) {
			this.testHierarchyService.findAllReferences(
				page,
				size,
				(references_page) => {
					this.references_page = references_page
				},
				(error) => {
					console.error(error)
				}
			)
		}
	},
}

</script>

<style lang="scss"></style>
