<template>
	<article v-show="users.length > 0">
        <table class="table table--default table-users">
            <caption class="screen-reader-text">{{$t('project.legendUsers')}}</caption>

            <thead>
                <tr>
                    <th scope="col">{{$t('entity.user.username')}}</th>
                    <th scope="col">{{$t('entity.user.role.role')}}</th>
                    <th scope="col">{{$t('entity.generic.actions')}}</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="user of users.slice().reverse()" :key="user.contractAppUser.id"  :class="{editing: user == editedUser}" v-cloak>
                    <th scope="row">{{user.contractAppUser.user.username}}</th>
                    <td class="edit">
                        <div class="select">
                            <select name="status-select" id="status-select" v-model="user.projectRole.name" required>
                                <option value="PROJECT_MANAGER">{{$t('entity.user.role.projectManager')}}</option>
                                <option value="PROJECT_USER">{{$t('entity.user.role.projectUser')}}</option>
                                <option value="PROJECT_GUEST">{{$t('entity.user.role.projectGuest')}}</option>
                            </select>
                        </div>
                        <button
                            class="btn btn--icon btn--nude"
                            @click="promoteUser(user)"
                        >
                            {{$t('action.saveChange')}}
                        </button>
                    </td>
                    <td class="view">
                        <span class="user-role">{{ user.projectRole.name.charAt(0) + user.projectRole.name.slice(1).toLowerCase().replace(/_/g,' ') }}</span>
                        <button
							class="btn btn--clipboard"
							@click="editUser(user)"
                            v-if="user.contractAppUser.user.id != $store.state.auth.user.id && managerCondition && user.projectRole.name != 'PROJECT_MANAGER'"
						>
							{{$t('action.promote')}}
						</button>
                    </td>

                    <td class="td-actions">
                        <router-link class="link link-independent link-independent--icon" :to="'/users/' + user.contractAppUser.user.id">
                            <icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
                            <span>{{$t('action.show')}}</span>
                        </router-link>
                        <button
                            class="btn btn--icon btn--nude"
                            v-if="user.contractAppUser.user.id != $store.state.auth.user.id && managerCondition"
                            @click="confirm(user)"
                        >
                            <icon-base-decorative><icon-delete/></icon-base-decorative>
                            <span>{{$t('action.delete')}}</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <vue-accessible-modal>
			<template v-slot:backdrop></template>
		</vue-accessible-modal>
    </article>
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconArrowBlue from '../../components/icons/IconArrowBlue'
import DeletionModal from '../../components/DeleteModal'
import IconDelete from '../../components/icons/IconDelete'

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
    props: [ 'users', 'managerCondition', 'promoteSuccessMsg' ],
    methods: {
        confirm(user) {
			this.$modal
			.confirm(DeletionModal, this.$t('deletionModal.remove') + user.contractAppUser.user.username + this.$t('deletionModal.project'), {
				label: "deletion-modal",
				classes: "modal",
				attributes: {
					id: "deletion-modal",
					role: "dialog",
					tabindex: "0"
				}
			})
			.then(() => {
				this.$emit('remove-user', user)
				this.$modal.close()
			})
			.catch(() => {
				this.$modal.close()
			})
			.finally(() => {})
		},

        promoteUser(user) {
            this.$emit('promote-user', user)
			this.editedUser = null
        },

        editUser(user) {
			this.beforeEditCache = user
			this.editedUser = user
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
