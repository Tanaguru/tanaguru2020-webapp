<template>
	<div class="table-container">
		<table class="table table--default table-users">
			<caption class="screen-reader-text">{{$t('users.legendUsers')}}</caption>

			<thead>
			<tr>
				<th scope="col">{{$t('entity.user.username')}}</th>
				<th scope="col">{{$t('entity.user.email')}}</th>
				<th scope="col">{{$t('entity.user.role.role')}}</th>
				<th scope="col">{{$t('entity.user.enabled')}}</th>
				<th scope="col">{{$t('entity.generic.actions')}}</th>
			</tr>
			</thead>

			<tbody>
			<tr v-for="user of users" :key="user.id">
				<th scope="row">{{user.username}}</th>
				<td>{{user.email}}</td>
				<td>{{user.appRole.name.charAt(0) + user.appRole.name.slice(1).toLowerCase().replace(/_/g,' ')}}</td>
				<td>{{user.enabled}}</td>
				<td class="td-actions">
					<ul class="actions-list">
						<li class="actions-list__item">
							<router-link class="link link-independent link-independent--icon" :to="'/users/' + user.id">
								<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
								<span>{{$t('action.show')}}</span>
							</router-link>
						</li>
						<li class="actions-list__item"
							v-if="user.id !== $store.state.auth.user.id &&
								$store.state.auth.authorities['DELETE_USER']">
							<button
								class="btn btn--icon btn--nude"
								@click="confirm(user)">
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
	import DeletionModal from "@/components/DeleteModal";
	import IconBaseDecorative from '@/components/icons/IconBaseDecorative'
	import IconArrowBlue from '@/components/icons/IconArrowBlue'
	import IconDelete from '@/components/icons/IconDelete'

	export default {
		name: 'userTable',
		props: ['users'],
		components: {
			DeletionModal,
			IconBaseDecorative,
			IconArrowBlue,
			IconDelete,
		},
		methods: {
			confirm(user) {
				this.$modal
					.confirm(DeletionModal, this.$t('deletionModal.delete') + user.username + ' ?', {
						label: "deletion-modal",
						classes: "modal",
						attributes: {
							id: "deletion-modal",
							role: "dialog",
							tabindex: "0"
						}
					})
					.then(() => {
						this.$emit('delete-user', user)
					})
					.catch(() => {

					})
					.finally(() => {
						this.$modal.close()
					})
			},
		}
	}
</script>

<style scoped>

</style>
