<template>
    
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
							    <p class="info-text" id="name-constraint">{{ $t('form.indications.nameConstraint') }}</p>
                                <p v-if="modifyContractForm.nameError" class="info-error" id="name-error">{{modifyContractForm.nameError}}</p>
							</div>
						</div>

						<div class="form-column">
							<div class="form-block">
								<label class="label" for="dateEnd">{{$t('entity.contract.formDateEnd')}} * :</label>

								<input 
                                    v-if="$i18n.locale.toLowerCase() == 'en'"
                                    class="input" 
                                    type="text" 
                                    name="dateEnd" 
                                    id="dateEnd" 
                                    v-model="modifyContractForm.dateEnd" >

                                <input 
                                    v-else 
                                    class="input" 
                                    type="text" 
                                    name="dateEnd" 
                                    id="dateEnd" 
                                    v-model="modifyContractForm.dateEnd" >
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
			<p>{{$t('form.indications.help')}}</p>
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
                @delete-user="deleteUser"
                @promote-user="promoteUser"
                :deletingCondition="deletingUserCondition"
                :addingCondition="addingCondition"
                :promoteCondition="promoteCondition"
                :promoteSuccessMsg="promoteSuccessMsg" />
        </article>

        <!-- PROJECTS BY CONTRACT -->

        <article v-show="addingCondition">
            <h2 class="contract__title-2">{{$t('contract.createProject')}}</h2>
			<p>{{$t('form.indications.help')}}</p>
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
							<label class="label" for="domain">
                                {{$t('entity.project.domain')}}
                                <span v-if="contract.restrictDomain"> *</span>
                            </label>
							<input
                                class="input"
                                type="url"
                                name="domain"
                                id="domain"
                                :placeholder="$t('entity.project.domain')"
                                :aria-describedBy="domainDescribedBy"
                                v-model="projectCreateForm.domain"
                                :required="contract.restrictDomain"
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

			<ContractProjectTable
                :projects="projects"
                :authorityByProjectId="authorityByProjectId"
                @delete-project="deleteProject"/>
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
            authorityByProjectId: {},
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
                nameError: "",
            },
            promoteSuccessMsg: "",
            userRemoveError: "",
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
        deletingUserCondition(){
			return this.$store.state.auth.user.appRole.overrideProjectRole.authorities.some(authority => {
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
            this.modifyContractForm.dateEnd = this.$moment(this.contract.dateEnd).format('L');
            this.modifyContractForm.active = true;
        },
        modifyContract(){
            
            if(this.modifyContractForm.name == '' || this.modifyContractForm.name.length > 50){
                this.modifyContractForm.nameError = this.$i18n.t('form.errorMsg.username.invalidUsername')
            }

            let dateEndRegex = null;
            if(this.$i18n.locale.toLowerCase() == 'en'){
                dateEndRegex = /^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d$/
            } else { dateEndRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/ }

            if(!dateEndRegex.test(this.modifyContractForm.dateEnd)){
                this.modifyContractForm.dateEndError = this.$i18n.t('form.errorMsg.contract.invalidDateEnd')
            }

            else {

                let dateEnd = this.modifyContractForm.dateEnd;
                if(this.$i18n.locale.toLowerCase() == 'en'){ 
                    dateEnd = this.$moment(this.modifyContractForm.dateEnd, 'MM-DD-YYYY').format("YYYY-MM-DD")
                } else {
                    dateEnd = this.$moment(this.modifyContractForm.dateEnd, 'DD-MM-YYYY').format("YYYY-MM-DD")
                }

                this.modifyContractForm.error = ""
                this.contractService.modifyById(
                    this.contract.id,
                    this.modifyContractForm.name,
                    dateEnd,
                    this.contractOwner.user.id,
                    (contract) => {
                        this.contract = contract;
                        this.modifyContractForm.active = false;
                    },
                    (error) => {
                        if(error.response.data.error == "USER_NOT_FOUND") {
                            this.modifyContractForm.error = this.$i18n.t("form.errorMsg.user.notFound");
                        } else if(error.response.data.error == "CONTRACT_NOT_FOUND") {
                            this.modifyContractForm.error = this.$i18n.t("form.errorMsg.contract.notFound");
                        } else if(error.response.status == "403"){
                            this.modifyContractForm.error = this.$i18n.t("form.errorMsg.user.permissionDenied")
                        } else {
                            this.modifyContractForm.error = this.$i18n.t("form.errorMsg.genericError");
                        }
                    }
                );
                this.modifyContractForm.successMsg = this.$i18n.t('form.successMsg.savedChangesChanges')
            }
        },
        createProject: function(){
            this.projectCreateForm.successMsg = '';
            
			if(this.projectCreateForm.name.length === 0){
				this.projectCreateForm.nameError = this.$i18n.t("form.errorMsg.emptyInput");
			} else if(this.projectCreateForm.name.length > 50){
                this.projectCreateForm.nameError = this.$i18n.t("form.errorMsg.others.nameError")
            }

            if(this.contract.restrictDomain) {
                let urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

                if(!urlRegex.test(this.auditConfigurationForm.common.url)){
                    this.projectCreateForm.domainError = this.$i18n.t("form.errorMsg.others.urlError")
                }
            }

			this.projectService.create(
				this.projectCreateForm.name,
				this.projectCreateForm.domain.trim(),
                this.contract.id,
				(project) => {
                    this.projects.push(project)
					this.projectCreateForm.successMsg = this.$i18n.t('form.successMsg.projectCreation')
				},
				(error) => {
                    if(error.response.data.error == "CONTRACT_NOT_FOUND"){
    					this.projectCreateForm.error = this.$i18n.t('form.errorMsg.contract.notFound')
                    } else if (error.response.data.error == "PROJECT_LIMIT_FOR_CONTRACT"){
                        this.projectCreateForm.error = this.$i18n.t('form.errorMsg.contract.projectLimit')
                    } else if (error.response.data.error == "INVALID_DOMAIN"){
                        this.projectCreateForm.error = this.$i18n.t('form.errorMsg.project.invalidDomain')
                    } else if (error.response.status == "403") {
    					this.projectCreateForm.error = this.$i18n.t('form.errorMsg.user.permissionDenied')
                    } else {
    					this.projectCreateForm.error = this.$i18n.t('form.errorMsg.genericError')
                    }
				}
			);
			this.projectCreateForm.error = "";
			this.projectCreateForm.nameError = "";
			this.projectCreateForm.domainError = "";
			this.projectCreateForm.name = "";
			this.projectCreateForm.domain = "";
        },
        deleteProject(project){
            const index = this.projects.indexOf(project);
            if(index > -1){
                this.projectService.delete(
                    project.id,
                    () => {
                        this.projects.splice(index, 1)
                    },
                    (error) => {
                        if(err.response.data.error == "PROJECT_NOT_FOUND"){
							this.deleteProjectError = this.$i18n.t("form.errorMsg.project.notFound")
						} else if(err.response.status == "403"){
							this.deleteProjectError = this.$i18n.t("form.errorMsg.user.permissionDenied")
						} else {
							this.deleteProjectError = this.$i18n.t("form.errorMsg.genericError");
						}
                    }
                )
            }
        },
        addUser(){
            if(this.userAdditionForm.username.length == 0){
                this.userAdditionForm.error = this.$i18n.t('form.errorMsg.emptyInput')
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
                            this.userAdditionForm.successMsg = this.$i18n.t('form.successMsg.userContractAddition');
                        },
                        (error) => {
                            if(err.response.data.error == "USER_NOT_FOUND"){
                                this.userAdditionForm.error = this.$i18n.t("form.errorMsg.user.notFound")
                            } else if(err.response.data.error == "CONTRACT_NOT_FOUND"){
                                this.userAdditionForm.error = this.$i18n.t("form.errorMsg.contract.notFound")
                            } else if(err.response.status == "403"){
                                this.userAdditionForm.error = this.$i18n.t("form.errorMsg.user.permissionDenied")
                            } else {
                                this.userAdditionForm.error = this.$i18n.t("form.errorMsg.genericError");
                            }
                        }
                    )
                } else {
                    this.userAdditionForm.error = this.$i18n.t('form.errorMsg.user.inexistantUser')
                }
            }
            this.userAdditionForm.username = "";
        },
        promoteUser(contractUser){
			this.contractService.promoteMember(
					contractUser.user.id,
					contractUser.contractRole.name,
					this.contract.id,
					(modifiedContractUser) => {
						contractUser.contractRole.name = modifiedContractUser.contractRole.name
					},
					(error) => {
                        if(err.response.data.error == "CANNOT_PROMOTE_YOURSELF"){
                            this.contractCreateForm.error = this.$i18n.t("form.errorMsg.user.promoteSelf")
                        } else if (err.response.data.error == "PROJECT_CANNOT_PROMOTE_USER"){
                            this.contractCreateForm.error = this.$i18n.t("form.errorMsg.user.notAllowed")
                        } else if (err.response.data.error == "CANNOT_PROMOTE_CONTRACT_OWNER"){
                            this.contractCreateForm.error = this.$i18n.t("form.errorMsg.user.promoteOwner")
                        } else if (err.response.data.error == "USER_NOT_FOUND_FOR_PROJECT"){
                            this.contractCreateForm.error = this.$i18n.t("form.errorMsg.user.userDoesntBelong")
                        } else if(err.response.data.error == "USER_NOT_FOUND"){
                            this.contractCreateForm.error = this.$i18n.t("form.errorMsg.user.notFound")
                        } else if(err.response.data.error == "CONTRACT_NOT_FOUND"){
                            this.contractCreateForm.error = this.$i18n.t("form.errorMsg.contract.notFound")
                        } else if(err.response.status == "403"){
                            this.contractCreateForm.error = this.$i18n.t("form.errorMsg.user.permissionDenied")
                        } else {
                            this.contractCreateForm.error = this.$i18n.t("form.errorMsg.genericError");
                        }
                    }
			)
        },
        deleteUser(contractUser){
			this.contractService.removeMember(
				contractUser.user.id,
				this.contract.id,
				() => {
					this.contractUsers.splice(this.contractUsers.indexOf(contractUser), 1);
				},
				(error) => {
                    if(err.response.data.error == "CONTRACT_NOT_FOUND"){
                        this.userRemoveError = this.$i18n.t("form.errorMsg.contract.notFound")
                    } else if(err.response.data.error == "USER_NOT_FOUND"){
                        this.userRemoveError = this.$i18n.t("form.errorMsg.user.notFound")
                    } else if(err.response.status == "403"){
                        this.userRemoveError = this.$i18n.t("form.errorMsg.user.permissionDenied")
                    } else {
                        this.userRemoveError = this.$i18n.t("form.errorMsg.genericError");
                    }
                },
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
            (projects) => {
            	this.projects = projects
				for(let project of projects){
					this.projectService.findByAuthorityByProjectId(
						project.id,
						(authorities) => {
							this.$set(this.authorityByProjectId, project.id, authorities);
						},
						(error) => {
							console.error("Unable to get authorities for project ", project.id);
						}
					)
				}
			},
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
