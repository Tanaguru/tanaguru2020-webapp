<template>
    <div>
        <div class="form-block form-block--half">
            <label class="label" for="search-user">{{$t('action.search')}} : </label>
            <input
				class="input"
				type="search"
				name="search-user"
				id="search-user"
				v-model="search"
				aria-describedby="search-explanation"
				autocomplete="off"
				@keydown="fireAriaLive"
			>
        </div>
		<p class='screen-reader-text' id="search-explanation">{{$t('users.infoSearch')}} : {{ users.length }}</p>

		<div aria-live="polite" class='screen-reader-text'>
			<p>{{ liveMsg }} {{$t('user.results')}}</p>
		</div>
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
					<tr v-for="user of filteredUsers.slice().reverse()" :key="user.id">
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
								<li class="actions-list__item" v-if="user.id !== $store.state.auth.user.id && $store.state.auth.authorities['DELETE_USER'] && ($store.state.auth.user.appRole.name === 'SUPER_ADMIN' || ($store.state.auth.user.appRole.name === 'ADMIN' && user.appRole.name !=='SUPER_ADMIN'))">
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
    </div>
</template>

<script>
import IconBaseDecorative from '../icons/IconBaseDecorative'
import IconArrowBlue from '../icons/IconArrowBlue'
import IconDelete from '../icons/IconDelete'
import DeletionModal from '../DeleteModal'

export default {
    name: 'AdminUserTable',
	components: {
		IconBaseDecorative,
		IconArrowBlue,
		IconDelete,
		DeletionModal
	},
	data() {
		return {
			search : "",
			liveMsg : "",
			timer : null
		}
	},
	props: [ 'users' ],
	computed: {
		filteredUsers(){
			let filteredUsers = [];
			if(!this.search){
				filteredUsers = this.users
			}
			else if(this.search){
				filteredUsers = this.users.filter(user =>
					user.username.toLowerCase().includes(this.search.toLowerCase()) || user.email.toLowerCase().includes(this.search.toLowerCase())
				)
			}
			return filteredUsers;
		}
	},
    methods: {
       fireAriaLive(){
			clearTimeout(this.timer)
			this.timer = setTimeout(this.populateAriaLive, 1500)
		},

		populateAriaLive(){
			this.liveMsg = this.filteredUsers.length + ' ' + this.$i18n.t('users.usersNb')
		},

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

<style lang="scss" scoped>
</style>
