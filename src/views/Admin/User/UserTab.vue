<template>
    <article class="admin-users">
		<header>
			<h1>{{$t('page.adminUser')}}</h1>
		</header>

		<section v-if="this.$store.state.auth.authorities && $store.state.auth.authorities['CREATE_USER']">
			<h2 class="admin-users__title-2">{{$t('users.createUser')}}</h2>
			<user-creation-form id="contract-user-form" @createUser="onCreateUser" :selected="selected"></user-creation-form>
		</section>

		<section>
        	<h2 class="admin-users__title-2">{{$t('users.usersList')}}</h2>
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

			<user-table 
				:users="filteredUsers" 
				@delete-user="deleteUser">
			</user-table>

			<pagination
				:current-page="usersCurrentPage"
				:total-pages="usersTotalPage"
				@changePage="(page) => {loadUsers(page, usersPageSize, usersSortBy, usersIsAsc)}"
			/>

		</section>

        <BackToTop />
    </article>
</template>

<script>
    import BackToTop from '../../../components/BackToTop';
    import IconBaseDecorative from '../../../components/icons/IconBaseDecorative'
    import IconArrowBlue from '../../../components/icons/IconArrowBlue'
    import IconDelete from '../../../components/icons/IconDelete'
	import UserTable from "@/components/users/UserTable";
	import UserCreationForm from "@/components/users/UserCreationForm";
	import Pagination from "../../../components/Pagination";

    export default {
        name: 'adminUserList',
        components: {
			UserCreationForm,
			UserTable,
            IconBaseDecorative,
            IconArrowBlue,
            IconDelete,
			BackToTop,
			Pagination
        },
        data() {
            return {
				search : "",
				liveMsg : "",
				timer : null,
				users : [],
				usersPageSize: 5,
				usersTotalPage : 0,
				usersCurrentPage: 0,
				usersTotal: 0,
				usersSortBy: "id",
				usersIsAsc: false
            }
        },
		props: ['selected'],
		watch: {
			selected: function(newVal, oldVal) {  
				if(newVal == 1) {
					this.search = ""
					this.liveMsg = ""
				} 
			}
		},
        computed:{
			filteredUsers(){
				let users = this.search ?
					this.users.filter(user =>
						user.username.toLowerCase().includes(this.search.toLowerCase()) ||
						user.email.toLowerCase().includes(this.search.toLowerCase())):
					this.users

				return users;
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

			onCreateUser(user){
				this.$emit('createUser', user);
				this.loadUsers(this.usersCurrentPage, this.usersPageSize, this.usersSortBy, this.usersIsAsc);
			},

            deleteUser(user){
                let index = this.users.indexOf(user);
                if(index > -1){
                    this.userService.delete(
                        user.id,
                        () => {
                            this.users.splice(index, 1)
                        },
                        (error) => console.error(error)
					);
					this.loadUsers(this.usersCurrentPage, this.usersPageSize, this.usersSortBy, this.usersIsAsc);
                }
			},

			loadUsers(page, size, sortBy, isAsc){
				this.userService.findAllPaginated(
					page,
					size,
					sortBy,
					isAsc,
					(users) => {
						this.usersCurrentPage = page;
						this.users = users.content;
						this.usersTotalPage = users.totalPages;
						this.usersTotal = users.totalElements;
					},
					err => console.error(err)
				);
			}
		},
		created(){
			this.loadUsers(this.usersCurrentPage,this.usersPageSize,this.usersSortBy,this.usersIsAsc);
		}
    }
</script>

<style lang="scss" scoped>
.admin-users {
	.admin-users__title-2 {
		margin-top: 6.2rem;
		margin-bottom: 3.1rem;
	}

	.select {
		max-width: 35rem;
	}

	.btn-create {
		margin-top: 1.6rem;
	}
}
</style>
