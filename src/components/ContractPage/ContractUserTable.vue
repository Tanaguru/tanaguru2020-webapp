<template>
	<div class="table-container">
		<table class="table table--default table-users" v-show="contractUsers.length > 0">
			<caption class="screen-reader-text">{{$t('contract.legendUsers')}}</caption>

			<thead>
				<tr>
					<th scope="col">{{$t('entity.user.username')}}</th>
					<th scope="col">{{$t('entity.user.role.role')}}</th>
					<th scope="col">{{$t('entity.generic.actions')}}</th>
				</tr>
			</thead>

			<tbody>
				<tr v-for="contractUser of sortedContractUsers" :key="contractUser.id" :class="{editing: contractUser == editedUser}" v-cloak >
					<th scope="row">{{contractUser.user.username}}</th>
					<td class="edit">
						<label :for="`status-select-${contractUser.user.id}`" hidden>{{ contractUser.contractRole.name.charAt(0) + contractUser.contractRole.name.slice(1).toLowerCase().replace(/_/g,' ') }}</label>
						<div class="select">
							<select name="status-select" :id="`status-select-${contractUser.user.id}`" v-model="contractUser.contractRole.name">
								<option value="CONTRACT_MANAGER">{{$t('entity.user.role.contractManager')}}</option>
								<option value="CONTRACT_USER">{{$t('entity.user.role.contractUser')}}</option>
								<option value="CONTRACT_GUEST">{{$t('entity.user.role.contractGuest')}}</option>
							</select>
						</div>
						<button
							class="btn btn--nude btn--icon"
							@click="promoteUser(contractUser)"
						>
							<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
							<span>{{$t('action.saveChange')}}</span>
						</button>
					</td>
					<td class="view">
						<span class="user-role">{{ contractUser.contractRole.name.charAt(0) + contractUser.contractRole.name.slice(1).toLowerCase().replace(/_/g,' ') }}</span>
						<button
							class="btn btn--clipboard"
							@click="editUser(contractUser)"
							v-if="contractUser.contractRole.name != 'CONTRACT_OWNER' && promoteCondition"
						>
							{{$t('action.promote')}}
						</button>
					</td>

					<td class="td-actions">
						<ul class="actions-list">
							<li class="actions-list__item">
								<router-link class="link link-independent link-independent--icon" :to="'/users/' + contractUser.user.id">
									<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
									<span>{{$t('action.show')}}</span>
								</router-link>
							</li>
							<li class="actions-list__item" v-if="deletingCondition && contractUser.contractRole.name != 'CONTRACT_OWNER'">
								<button
									class="btn btn--icon btn--nude"
									@click="confirm(contractUser)"
								>
									<icon-base-decorative><icon-delete/></icon-base-decorative>
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
import IconBaseDecorative from '../icons/IconBaseDecorative'
import IconArrowBlue from '../icons/IconArrowBlue'
import DeletionModal from '../DeleteModal'
import IconDelete from '../icons/IconDelete'

export default {
    name: 'ContractUserTable',
	components: {
		IconBaseDecorative,
		IconArrowBlue,
		IconDelete,
		DeletionModal
	},
	data(){
		return {
			editedUser: null
		}
	},
    props: [ 'contractUsers', 'deletingCondition', 'promoteCondition', 'addingCondition' ],
    methods: {
        confirm(contractUser) {
			this.$modal
			.confirm(DeletionModal, this.$t('deletionModal.remove') + contractUser.user.username + this.$t('deletionModal.contrat'), {
				label: "deletion-modal",
				classes: "modal",
				attributes: {
					id: "deletion-modal",
					role: "dialog",
					tabindex: "0"
				}
			})
			.then(() => {
				this.$emit('remove-user', contractUser)
			})
			.catch(() => {

			})
			.finally(() => {
				this.$modal.close()
			})
		},

        promoteUser(user) {
			this.$emit('promote-user', user)
			this.editedUser = null
		},

		editUser(user) {
			this.beforeEditCache = user
			this.editedUser = user
		}
	},
	computed: {
		sortedContractUsers(){
    		return this.contractUsers.reverse();
		}
	}
}
</script>

<style lang="scss" scoped>
.table-users {
	td {
		vertical-align: top;
	}

	.user-role {
		margin-right: 1.6rem;
	}

	.select {
		margin-bottom: .8rem;
	}
}

#save-promotion {
	display: flex;
	justify-content: space-between;
}

[v-cloak] {
      display: none;
    }
    .edit {
      display: none;
    }
    .editing .edit {
      display: block
    }
    .editing .view {
      display: none;
    }

</style>
