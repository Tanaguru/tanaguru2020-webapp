<template>
	<div class="table-container">
		<table class="table table--default">
			<thead>
			<tr>
				<th scope="col">{{ $t('entity.contract.name') }}</th>
				<th scope="col">{{ $t('entity.contract.dateEnd') }}</th>
				<th scope="col">{{ $t('entity.generic.actions') }}</th>
			</tr>
			</thead>
			<tbody>
				<tr v-for="contract of contracts" :key="contract.id">
					<th scope="row">{{ contract.name }}</th>
					<td>{{ $moment(contract.dateEnd).format('LL') }}</td>
					<td class="td-actions">
						<ul class="actions-list">
							<li class="actions-list__item">
								<router-link class="link link-independent link-independent--icon"
											:to="'/contracts/' + contract.id">
									<icon-base-decorative>
										<icon-arrow-blue/>
									</icon-base-decorative>
									<span>{{ $t('action.show') }}</span>
								</router-link>
							</li>
							<li class="actions-list__item">
								<button
									class="btn btn--icon btn--nude btn-delete"
									v-if="$store.state.auth.authorities['DELETE_CONTRACT']"
									@click="deleteContract(contract)">
									<icon-base-decorative>
										<icon-delete/>
									</icon-base-decorative>
									<span>{{ $t('action.delete') }}</span>
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
import DeletionModal from "@/components/DeleteModal";
import IconBaseDecorative from '@/components/icons/IconBaseDecorative'
import IconArrowBlue from '@/components/icons/IconArrowBlue'
import IconDelete from '@/components/icons/IconDelete'

export default {
	name: 'contractTable',
	props: [
		'contracts',
	],
	components: {
		DeletionModal,
		IconBaseDecorative,
		IconArrowBlue,
		IconDelete,
	},
	methods: {
		deleteContract(contract) {
			this.$modal
				.confirm(DeletionModal, this.$t('deletionModal.delete') + contract.name + ' ?', {
					label: "deletion-modal",
					classes: "modal",
					attributes: {
						id: "deletion-modal",
						role: "dialog",
						tabindex: "0"
					}
				})
				.then(() => {
					this.$emit('delete-contract', contract)
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

