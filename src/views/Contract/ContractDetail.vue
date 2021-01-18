<template>
    <main v-if="contract" id="page" class="wrapper contract" role="main">
		<Breadcrumbs :breadcrumbsItems='breadcrumbProps' ></Breadcrumbs>

		<header class="headline headline--top">
			<h1>{{contract.name}}</h1>
		</header>

        <article>
            <h2 class="contract__title-2">{{$t('contract.infos')}}</h2>
			<div v-if="!modifyContractForm.active">
				<ul class="infos-list">
					<li><span class="infos-list__exergue">{{$t('entity.contract.name')}}</span> : {{contract.name}}</li>
					<li><span class="infos-list__exergue">{{$t('entity.contract.dateStart')}}</span> : {{  moment(contract.dateStart).format('LL') }}</li>
					<li><span class="infos-list__exergue">{{$t('entity.contract.dateEnd')}}</span> : {{  moment(contract.dateEnd).format('LL') }}</li>
				</ul>

				<button
					class="btn btn--default"
					v-if="$store.state.auth.user.appRole.name == 'SUPER_ADMIN'"
					@click="showModifyContractForm()">
					{{$t('action.modify')}}
				</button>
				<p v-if="modifyContractForm.error" class="info-error">{{modifyContractForm.error}}</p>
			</div>

			<div v-else>
				<form @submit.prevent="modifyContract">
					<div class="form-row">
						<div class="form-column">
							<div class="form-block">
								<label class="label" for="name1">{{$t('entity.contract.name')}} * :</label>
								<input
                                    class="input"
                                    type="text"
                                    name="name"
                                    id="name1"
                                    v-model="modifyContractForm.name"
                                    :aria-describedby="nameDescribedBy"
                                    required>
							    <p class="info-text" id="name-constraint">{{ $t('form.nameConstraint') }}</p>
                                <p v-if="modifyContractForm.nameError" class="info-error" id="name-error">{{modifyContractForm.nameError}}</p>
							</div>
						</div>

						<div class="form-column">
							<div class="form-block">
								<label class="label" for="dateEnd">{{$t('entity.contract.dateEnd')}} * :</label>
								<input class="input" type="date" name="dateEnd" id="dateEnd" v-model="modifyContractForm.dateEnd" >
							</div>
						</div>
					</div>

					<button class="btn btn--default" type="submit">{{$t('action.modify')}}</button>
					<p v-if="modifyContractForm.error" class="info-error">{{modifyContractForm.error}}</p>
				</form>
			</div>
        </article>

        <!-- USERS BY CONTRACT -->

        <article v-show="addingCondition">
            <h2 class="contract__title-2">{{$t('contract.users')}}</h2>
			<p>{{$t('form.help')}}</p>
            <form @submit.prevent="addUser" class="form-users" novalidate>
                <div class="form-block form-block--half">
                    <label class="label" for="username">{{$t('entity.user.username')}} *</label>
                    <input
                        class="input"
                        type="text"
                        name="username"
                        id="username"
                        :placeholder="$t('entity.user.username')"
                        v-model="userAdditionForm.username"
                        required
                        :aria-describedby="userAdditionForm.error ? 'user-addition-error' : ''">
                    <p v-if="userAdditionForm.error" class="info-error" id="user-addition-error">{{ userAdditionForm.error }}</p>
                </div>

                <button class="btn btn--default btn-add" type="submit">{{$t('action.addUser')}}</button>
                <p v-if="userAdditionForm.successMsg" class="info-success" aria-live="polite">{{ userAdditionForm.successMsg }}</p>
            </form>

			<ContractUserTable
					:contract-users="contractUsers"
					@remove-user="removeUser"
					@promote-user="promoteUser"
					:deletingCondition="deletingUserCondition"
					:addingCondition="addingCondition"
					:promoteCondition="promoteCondition"
					:promoteSuccessMsg="promoteSuccessMsg" />
        </article>

        <!-- PROJECTS BY CONTRACT -->

        <article v-show="addingCondition">
            <h2 class="contract__title-2">{{$t('contract.createProject')}}</h2>
			<p>{{$t('form.help')}}</p>
            <form @submit.prevent="createProject" novalidate>
				<div class="form-row">
					<div class="form-column">
						<div class="form-block">
							<label class="label" for="name2">{{$t('entity.project.name')}} *</label>
							<input
                                class="input"
                                type="text"
                                name="name"
                                id="name2"
                                :placeholder="$t('entity.project.name')"
                                :aria-describedBy="projectCreateForm.nameError ? 'name-error' : ''"
                                v-model="projectCreateForm.name"
                                required
                            >
							<p v-show="projectCreateForm.nameError" id="name-error" class="info-error">{{projectCreateForm.nameError}}</p>
						</div>
					</div>

					<div class="form-column">
						<div class="form-block">
							<label class="label" for="domain">{{$t('entity.project.domain')}} *</label>
							<input
                                class="input"
                                type="url"
                                name="domain"
                                id="domain"
                                :placeholder="$t('entity.project.domain')"
                                :aria-describedBy="domainDescribedBy"
                                v-model="projectCreateForm.domain"
                                required
                            >
							<p class="info-text" id="domain-constraint">(example : http://www.website.com/)</p>
							<p class="info-error" id="domain-error">{{projectCreateForm.domainError}}</p>
						</div>
					</div>
				</div>

                <button class="btn btn--default" type="submit">{{$t('action.create')}}</button>
                <p v-if="projectCreateForm.error" class="info-error">{{projectCreateForm.error}}</p>
                <p class="info-success" v-show="projectCreateForm.successMsg">{{ projectCreateForm.successMsg }}</p>
            </form>
        </article>

		<article v-show="projects.length > 0">
			<h2 class="contract__title-2" id="table-projects">{{$t('contract.projectsList')}}</h2>

			<ContractProjectTable :projects="projects" :deletingCondition="deletingProjectCondition" @delete-project="deleteProject" />
		</article>

        <BackToTop />

    </main>
</template>

<script>
import ContractUserTable from './ContractUserTable'
import ContractProjectTable from './ContractProjectTable'
import BackToTop from '../../components/BackToTop'
import IconBaseDecorative from '../../components//icons/IconBaseDecorative'
import IconArrowBlue from '../../components//icons/IconArrowBlue'
import IconDelete from '../../components//icons/IconDelete'
import Breadcrumbs from '../../components/Breadcrumbs';
import moment from 'moment'

export default {
    name: 'contractDetail',
    components: {
		IconBaseDecorative,
		IconArrowBlue,
        IconDelete,
        Breadcrumbs,
        BackToTop,
        ContractUserTable,
        ContractProjectTable
    },
    data() {
        return {
            breadcrumbProps: [
                {
                    name: this.$i18n.t('page.dashboard'),
                    path: '/'
                }
            ],
            contract: null,
            users: [],
            contractUsers: [],
			contractOwner: null,
            modifyContractForm: {
                active: false,
                name: "",
                dateEnd: "",
                error: "",
                nameError: "",
                successMsg:""
            },
            userAdditionForm: {
                username: "",
                error: "",
                successMsg: ""
            },
            currentContractUser: null,
            projects: [],
            projectCreateForm: {
                name: "",
                domain: "",
                successMsg: "",
                domainError: "",
                error: "",
                nameError: ""
            },
            promoteSuccessMsg: ""
        }
    },
    metaInfo() {
        return {
            // if no subcomponents specify a metaInfo.title, this title will be used
			title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.contractDetail"),
            meta: [
                {
                    name: 'robots', content: 'noindex'
                }
            ]
        }
    },
    computed: {
        promoteCondition(){
			return this.$store.state.auth.user.appRole.overrideContractRole.authorities.some(authority => {
                return authority.name === 'PROMOTE_MEMBER'
            }) ||
            (this.currentContractUser &&  this.currentContractUser.contractRole.authorities.some(authority => {
                return authority.name === 'PROMOTE_MEMBER'
            }));
        },

        addingCondition(){
			return this.$store.state.auth.user.appRole.overrideContractRole.authorities.some(authority => {
				return authority.name === 'CREATE_PROJECT'
			}) ||
            (this.currentContractUser && this.currentContractUser.contractRole.authorities.some(authority => {
                return authority.name === 'CREATE_PROJECT'
            }));
        },

        deletingProjectCondition(){
			return this.$store.state.auth.user.appRole.overrideContractRole.authorities.some(authority => {
                return authority.name === 'DELETE_PROJECT'
            }) ||
            (this.currentContractUser && this.currentContractUser.contractRole.authorities.some(authority => {
                return authority.name === 'DELETE_PROJECT'
            }));
        },

        deletingUserCondition(){
			return this.$store.state.auth.user.appRole.overrideContractRole.authorities.some(authority => {
                return authority.name === 'REMOVE_MEMBER'
            }) ||
            (this.currentContractUser && this.currentContractUser.contractRole.authorities.some(authority => {
                return authority.name === 'REMOVE_MEMBER'
            }));
        },

        nameDescribedBy(){
            let description = 'name-constraint';
            if(this.modifyContractForm.nameError){
                description = 'name-error name-constraint'
            }
            return description;
        },

        domainDescribedBy(){
            let description = 'domain-constraint';
            if(this.projectCreateForm.domainError){
                description = 'domain-error domain-constraint'
            }
            return description;
        }
    },
    methods: {
        moment: function (date) {
            this.$moment.locale(this.$i18n.locale)
            return this.$moment(date);
        },

        showModifyContractForm(){
            this.modifyContractForm.name = this.contract.name;
            this.modifyContractForm.dateEnd = this.contract.dateEnd;
            this.modifyContractForm.active = true;
        },

        modifyContract(){
            if(this.modifyContractForm.name == '' || this.modifyContractForm.name.length > 50){
                this.modifyContractForm.nameError = this.$i18n.t('form.invalidUsername')
            }
            else {
                this.modifyContractForm.error = ""

                this.contractService.modifyById(
                    this.contract.id,
                    this.modifyContractForm.name,
                    this.modifyContractForm.dateEnd,
                    this.contractOwner.id,
                    (contract) => {
                        this.contract = contract;
                        this.modifyContractForm.active = false;
                    },
                    (error) => this.modifyContractForm.error = this.$i18n.t('form.genericError')
                );
                this.modifyContractForm.successMsg = this.$i18n.t('form.savedChanges')
            }
        },

        createProject: function(){
			this.projectCreateForm.successMsg = '';

			if(this.projectCreateForm.name.length === 0){
				this.projectCreateForm.domainError = this.$i18n.t("form.emptyInput");
				return;
			}

			try {
				let parsedUrl = new URL(this.projectCreateForm.domain);
			} catch (_) {
				this.projectCreateForm.domainError = this.$i18n.t("form.urlError");
				return;
			}

			this.projectService.create(
				this.projectCreateForm.name,
				this.projectCreateForm.domain,
				this.contract.id,
				(project) => {
					this.projects.push(project)
					this.projectCreateForm.successMsg = this.$i18n.t('form.projectCreation')

				},
				(error) => {
					this.projectCreateForm.error = this.$i18n.t('form.genericError')
					if(this.projectCreateForm.name.length > 50){
						this.projectCreateForm.nameError = this.$i18n.t("form.nameError")
					}
				}
			);

			this.projectCreateForm.error = "";
			this.projectCreateForm.name = ""
			this.projectCreateForm.domain = ""
        },

        deleteProject(project){
            const index = this.projects.indexOf(project);
            if(index > -1){
                this.projectService.delete(
                    project.id,
                    () => {
                        this.projects.splice(index, 1)
                    },
                    (error) => console.error(error)
                )
            }
        },

        addUser(){
            if(this.userAdditionForm.username.length == 0){
                this.userAdditionForm.error = this.$i18n.t('form.emptyInput')
            } else {
                let existantUser = this.users.find(user =>
                user.username === this.userAdditionForm.username
                )

                if(existantUser){
                    let newUser = existantUser.id
                    this.contractService.addMember(
                        newUser,
                        this.contract.id,
                        (contractUser) => {
                            this.contractUsers.push(contractUser);
                            this.userAdditionForm.error = "";
                            this.userAdditionForm.successMsg = this.$i18n.t('form.userContractAddition');
                        },
                        (error) => this.userAdditionForm.error = this.$i18n.t('form.inexistantUser')
                    )
                } else {
                    this.userAdditionForm.error = this.$i18n.t('form.inexistantUser')
                }
            }
        },

        promoteUser(contractUser){
			this.contractService.promoteMember(
					contractUser.user.id,
					contractUser.contractRole.name,
					this.contract.id,
					(modifiedContractUser) => {
						contractUser.contractRole.name = modifiedContractUser.contractRole.name
					},
					(error) => console.error(error)
			)
        },

        removeUser(contractUser){
			this.contractService.removeMember(
				contractUser.user.id,
				this.contract.id,
				() => {
					this.contractUsers.splice(this.contractUsers.indexOf(contractUser), 1);
				},
				(error) => console.error(error),
			)
        }
    },
    created() {
        this.userService.findAll(
            (users) => {
                this.users = users
            }
        )

        this.contractService.findById(
            this.$route.params.id,
            (contract) => {
                this.contract = contract
                if(this.$store.state.auth.user.appRole.name == 'USER'){
                    this.breadcrumbProps.push({
                        name : 'Configuration',
                        path : '/configuration'
                    })
                } else {
                    this.breadcrumbProps.push({
                        name : 'Administration',
                        path : '/administration'
                    })
                }
                this.breadcrumbProps.push({
                    name : this.contract.name,
                    path : '/contracts/'+ this.contract.id
                });

                this.userService.findAllByContract(
                    this.contract.id,
                    (contractUsers) => {
						contractUsers.forEach(contractUser => {
                            this.contractUsers.push(contractUser);
                            if(contractUser.contractRole.name === 'CONTRACT_OWNER'){
                            	this.contractOwner = contractUser;
							}

                            if(contractUser.user.id === this.$store.state.auth.user.id){
                                this.currentContractUser = contractUser;
                            }
                        });
                    },
			        (error) => { 'error' }
                )
            },
            (error) => { this.$router.replace('/404') }
        );

        this.projectService.findByContractId(
            this.$route.params.id,
            (projects) => {this.projects = projects},
            (error) => {console.error(error)}
        );
    },
}
</script>

<style lang="scss" scoped>
.contract {
	.contract__title-2 {
		margin-top: 6.2rem;
		margin-bottom: 3.1rem;
	}

	.form-users {
		margin-bottom: 4.6rem;
	}

	.infos-list {
		margin-bottom: 2.4rem;
	}

	.select {
		max-width: 35rem;
	}
}
</style>
