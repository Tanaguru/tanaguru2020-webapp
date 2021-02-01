<template>
    <main v-if="project" id="page" class="wrapper project" role="main">
		<Breadcrumbs :breadcrumbsItems='breadcrumbProps' ></Breadcrumbs>

		<header class="headline headline--top project-header">
			<h1>{{project.name}}</h1>
		</header>

		<article>
            <h2 class="project__title-2">{{$t('project.infos')}}</h2>
			<ul class="infos-list">
				<li><span class="infos-list__exergue">{{$t('entity.project.contract')}}</span> : {{ contract.name }}</li>
				<li><span class="infos-list__exergue">{{$t('entity.project.domain')}}</span> : <a :href="project.domain"> {{ project.domain }} </a></li>
			</ul>

			<ul class="project-actions-list">
				<li class="project-actions-list__item" v-if="!validContract">
					<router-link class="btn btn--default btn--icon" :to="'/projects/' + project.id + '/audit'">
						<icon-base-decorative width="16" height="16" viewBox="0 0 20 20"><icon-launch /></icon-base-decorative>
						<span>{{$t('action.auditNewStart')}}</span>
					</router-link>
				</li>

				<li class="project-actions-list__item">
					<router-link class="link-independent link-independent--icon" :to="'/projects/' + project.id + '/archives'" >
						<icon-base-decorative width="16" height="16" viewBox="0 0 24 24"><icon-version /></icon-base-decorative>
						<span>{{$t('action.archives')}}</span>
					</router-link>
				</li>
			</ul>
        </article>

        <!-- USERS BY Project -->

        <article v-show="managerCondition">
            <h2 class="project__title-2">{{$t('project.users')}}</h2>
			<p>{{$t('form.indications.help')}}</p>
            <form @submit.prevent="addUser" class="form-users" novalidate>
                <div class="form-block">
                    <label class="label" for="user-select">{{$t('entity.user.username')}} *</label>
                    <div class="select">
						<select
							id="user-select"
							name="user-select"
							v-model="userAdditionForm.id"
							:aria-describedby="userAdditionDescribedby"
							required>
							<option value="" disabled>{{ $t('project.selectUser') }}</option>
							<option v-for="user in contractUsers" :value="user.user.id" :key="user.user.username">{{ user.user.username }}</option>
						</select>
					</div>
					<p v-if="userAdditionForm.error" class="info-error" id="user-error">{{ userAdditionForm.error }}</p>
                	<p v-if="userAdditionForm.successMsg" class="info-success" id="user-success">{{ userAdditionForm.successMsg }}</p>
                </div>

                <button class="btn btn--default" type="submit">{{$t('action.addUser')}}</button>
            </form>
		</article>

        <ProjectUserTable 
			:users="projectUsers" 
			@remove-user="removeUser" 
			@promote-user="promoteUser" 
			:managerCondition="managerCondition" 
			:promoteSuccessMsg="promoteSuccessMsg" />

	    <BackToTop />

    </main>
</template>

<script>
	import Breadcrumbs from '../../components/Breadcrumbs';
	import ProjectUserTable from './ProjectUserTable';
	import BackToTop from '../../components/BackToTop';
	import IconBaseDecorative from '../../components/icons/IconBaseDecorative';
	import IconArrowBlue from '../../components/icons/IconArrowBlue';
	import IconDelete from '../../components/icons/IconDelete';
	import IconLaunch from '../../components/icons/IconLaunch';
	import IconVersion from '../../components/icons/IconVersion';

	export default {
		name: 'projectDetail',
		components: {
			Breadcrumbs,
			BackToTop,
			ProjectUserTable,
			IconBaseDecorative,
			IconArrowBlue,
			IconDelete,
			IconLaunch,
			IconVersion,
		},
		data() {
			return {
				project: [],
				projectUsers: [],
				contract: [],
				validContract: false,
				contractUsers: [],
				audits: [],
				currentUserRole: null,
				userAdditionForm: {
					id: "",
					error: "",
					successMsg: ""
				},
				promoteSuccessMsg: "",
				breadcrumbProps: [
					{
						name: this.$i18n.t('page.dashboard'),
						path: '/'
					},
				],
			}
		},
		metaInfo(){
			return {
				// if no subcomponents specify a metaInfo.title, this title will be used
				title: 'Tanaguru - ' + this.project.name,
				meta: [
					{
						name: 'robots', content: 'noindex'
					}
				]
			}
		},
		created(){			
			this.projectService.findById(
				this.$route.params.id,
				(project) => {
					this.project = project
					this.breadcrumbProps.push({
						name : 'Administration',
						path : '/administration'
					})
                    this.breadcrumbProps.push({
                        name : this.project.contract.name,
                        path : '/contracts/' + this.project.contract.id
					})
					this.breadcrumbProps.push({
                        name : this.project.name,
                        path : '/projects/' + this.project.id
                    })

					this.userService.findAllByProject(
						this.project.id,
						(users) => {
							this.projectUsers = users
							let currentUser = this.projectUsers.filter(user =>
								user.contractAppUser.user.id == this.$store.state.auth.user.id
							)
							this.currentUserRole = currentUser[0].projectRole.name
						},
						(error) => { 'error' }
					)

					this.contract = this.project.contract
					this.validContract = this.$moment(this.contract.dateEnd).isBefore(new Date())

					this.userService.findAllByContract(
						this.contract.id,
						(users) => {
							this.contractUsers = users
						},
						(error) => { 'error' }
					)
				},
				(error) => { this.$router.replace('/404') }
			)
		},
		computed: {
			auditCondition(){
				let condition = false
				if(this.$store.state.auth.user.appRole.name == 'SUPER_ADMIN' || this.$store.state.auth.user.appRole.name == 'ADMIN'){
					condition = true
				}
				else if(this.currentUserRole == 'PROJECT_MANAGER' || this.currentUserRole
				 == 'PROJECT_USER'){
					condition = true
				}
				return condition;
			},

			managerCondition(){
				let condition = false
				if(this.$store.state.auth.user.appRole.name == 'SUPER_ADMIN' || this.$store.state.auth.user.appRole.name == 'ADMIN'){
					condition = true
				}
				else if(this.currentUserRole == 'PROJECT_MANAGER'){
					condition = true
				}
				return condition;
			},

			userAdditionDescribedby(){
				let description = '';
				if(this.userAdditionForm.successMsg){
					description = 'user-success'
				} else if(this.userAdditionForm.error){
					description = "user-error"
				}
				return description;
			}
		},
		methods: {
			removeUser(user){
				var index = this.projectUsers.indexOf(user);
				if(index > -1){
					this.projectService.removeMember(
						user.contractAppUser.user.id,
						this.project.id,
						(project) => {
							this.projectUsers.splice(index, 1)
						},
						(error) => {
							if(err.response.data.error == "PROJECT_NOT_FOUND"){
								this.userRemoveError = this.$i18n.t("form.errorMsg.project.notFound")
							} else if(err.response.data.error == "USER_NOT_FOUND"){
								this.userRemoveError = this.$i18n.t("form.errorMsg.user.notFound")
							} else if(err.response.status == "403"){
								this.userRemoveError = this.$i18n.t("form.errorMsg.user.permissionDenied")
							} else {  
								this.userRemoveError = this.$i18n.t("form.errorMsg.genericError");
							}
						}
					)
				}
			},

			promoteUser(user){
				var index = this.projectUsers.indexOf(user);
				if(index > -1){
					this.projectService.promoteMember(
						user.contractAppUser.user.id,
						user.projectRole.name,
						this.project.id,
						(project) => {
							user.projectRole.name = user.projectRole.name
						},
						(error) => {
							if(err.response.data.error == "CANNOT_PROMOTE_YOURSELF"){
								this.projectCreateForm.error = this.$i18n.t("form.errorMsg.user.promoteSelf")
							} else if (err.response.data.error == "PROJECT_CANNOT_PROMOTE_USER"){
								this.projectCreateForm.error = this.$i18n.t("form.errorMsg.user.notAllowed")
							} else if (err.response.data.error == "CANNOT_PROMOTE_CONTRACT_OWNER"){
								this.projectCreateForm.error = this.$i18n.t("form.errorMsg.user.promoteOwner")
							} else if (err.response.data.error == "USER_NOT_FOUND_FOR_PROJECT"){
								this.projectCreateForm.error = this.$i18n.t("form.errorMsg.user.userDoesntBelong")
							} else if(err.response.data.error == "USER_NOT_FOUND"){
								this.projectCreateForm.error = this.$i18n.t("form.errorMsg.user.notFound")
							} else if(err.response.data.error == "PROJECT_NOT_FOUND"){
								this.projectCreateForm.error = this.$i18n.t("form.errorMsg.project.notFound")
							} else if(err.response.status == "403"){
								this.projectCreateForm.error = this.$i18n.t("form.errorMsg.user.permissionDenied")
							} else {  
								this.projectCreateForm.error = this.$i18n.t("form.errorMsg.genericError");
							}
						}

					)
				}
			},

			addUser(user){
				if(!this.userAdditionForm.id){
					this.userAdditionForm.error = this.$i18n.t('form.errorMsg.emptyInput')
				} else {
					this.projectService.addMember(
						this.userAdditionForm.id,
						this.project.id,
						(user) => {
							this.projectUsers.push(user)
							this.userAdditionForm.successMsg = this.$i18n.t("form.successMsg.userProjectAddition")
						},
						(error) => {
							if(err.response.data.error == "PROJECT_NOT_FOUND"){
								this.userAdditionForm.error = this.$i18n.t("form.errorMsg.project.notFound")
							} else if(err.response.data.error == "USER_NOT_FOUND"){
								this.userAdditionForm.error = this.$i18n.t("form.errorMsg.user.notFound")
							} else if(err.response.status == "403"){
								this.userAdditionForm.error = this.$i18n.t("form.errorMsg.user.permissionDenied")
							} else {  
								this.userAdditionForm.error = this.$i18n.t("form.errorMsg.genericError");
							}
						}
					)
				}
				this.userAdditionForm.id = null;
			},
		}
	}
</script>

<style lang="scss" scoped>
.project {
	.project__title-2 {
		margin-top: 6.2rem;
		margin-bottom: 3.1rem;
	}
}

.project-actions-list {
	margin: 3.2rem 0 0;
	padding: 0;
	list-style: none;

	@media #{$media-xs-viewport} {
		display: flex;
		align-items: center;
	}

	.project-actions-list__item {
		&:not(:last-child) {
			margin-bottom: 1.6rem;

			@media #{$media-xs-viewport} {
				margin-right: 1.6rem;
				margin-bottom: 0;
			}
		}
	}
}

.form-users {
	margin-bottom: 4.6rem;

	.select {
		max-width: 45rem;
	}
}

.table-users {
	margin-top: 3.2rem;

	td {
		vertical-align: top;
	}

	.select {
		margin-bottom: .8rem;
	}
}
</style>
