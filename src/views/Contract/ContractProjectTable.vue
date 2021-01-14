<template>
	<div class="table-container">
		<table class="table table--default" v-show="projects.length > 0">
			<caption class="screen-reader-text">{{$t('contract.legendProjects')}}</caption>
			<thead>
				<tr>
					<th scope="col">{{$t('entity.project.name')}}</th>
					<th scope="col">{{$t('entity.generic.actions')}}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="project of projects.slice().reverse()" :key="project.id">
					<th scope="row">{{project.name}}</th>
					<td class="td-actions">
						<ul class="actions-list">
							<li class="actions-list__item">
								<router-link :to="'/projects/' + project.id" class="link link-independent link-independent--icon">
									<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
									<span>{{$t('action.show')}}</span>
								</router-link>
							</li>
							<li class="actions-list__item">
								<router-link :to="'/projects/' + project.id + '/archives'" class="link link-independent link-independent--icon">
									<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
									<span>{{$t('dashboard.actions.archives')}}</span>
								</router-link>
							</li>
							<li class="actions-list__item">
								<button
									v-show="deletingCondition"
									@click="confirm(project)"
									class="btn btn--nude btn--icon">
									<icon-base-decorative><icon-delete /></icon-base-decorative>
									<span>{{$t('action.delete')}}</span>
								</button>
							</li>
						</ul>
					</td>
				</tr>
			</tbody>
		</table>
		<vue-accessible-modal>
			<template v-slot:backdrop></template>
		</vue-accessible-modal>
	</div>
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconArrowBlue from '../../components/icons/IconArrowBlue'
import DeletionModal from '../../components/DeleteModal'
import IconDelete from '../../components/icons/IconDelete'

export default {
    name: 'ContractProjectTable',
	components: {
		IconBaseDecorative,
		IconArrowBlue,
		IconDelete,
		DeletionModal
	},
    props: [ 'projects', 'deletingCondition' ],
    methods: {
        confirm(project) {
			this.$modal
			.confirm(DeletionModal, this.$t('deletionModal.delete') + project.name + ' ?', {
				label: "deletion-modal",
				classes: "modal",
				attributes: {
					id: "deletion-modal",
					role: "dialog",
					tabindex: "0"
				}
			})
			.then(() => {
				this.$emit('delete-project', project)
				this.$modal.close()
			})
			.catch(() => {
				this.$modal.close()
			})
			.finally(() => {})
		},
    }
}
</script>

<style scoped>

</style>
