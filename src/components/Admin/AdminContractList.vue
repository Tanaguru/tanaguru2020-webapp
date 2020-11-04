<template>
    <article class="admin-contracts">
		<header>
			<h1 v-if="$store.state.auth.user.appRole.name == 'USER'">{{$t('page.configContract')}}</h1>
			<h1 v-else>{{$t('page.adminContract')}}</h1>
		</header>

        <section v-show="newContractCondition" id="contract-create-form">
            <h2 class="admin-contracts__title-2">{{$t('contracts.createContract')}}</h2>
			<p>{{$t('form.help')}}</p>
            <form @submit.prevent="createContract" novalidate >
				<div class="form-row">
					<div class="form-column">
						<div class="form-block">
							<label class="label" for="name">{{$t('entity.contract.name')}} *</label>
							<input
                                class="input"
                                v-bind:class="{'has-error': contractCreateForm.nameError}"
                                :aria-describedby="nameDescribedBy"
                                type="text"
                                name="name"
                                id="name"
                                :placeholder="$t('entity.contract.name')"
                                v-model="contractCreateForm.name"
                                required>
							<p class="info-text" id="contract-name-constraint">{{ $t('form.nameConstraint') }}</p>
							<p v-show="contractCreateForm.nameError" id="name-error" class="info-error">{{contractCreateForm.nameError}}</p>
						</div>
					</div>

					<div class="form-column">
						<div class="form-block">
							<label class="label" for="dateEnd">{{$t('entity.contract.dateEnd')}} *</label>
							<input
                                class="input"
                                v-bind:class="{'has-error': contractCreateForm.dateError}"
                                type="date"
                                name="dateEnd"
                                id="dateEnd"
                                :aria-describedby="contractCreateForm.dateError ? 'date-error' : ''"
                                v-model="contractCreateForm.dateEnd"
                                required>
							<p v-show="contractCreateForm.dateError" id="date-error" class="info-error">{{contractCreateForm.dateError}}</p>
						</div>
					</div>
				</div>

                <div class="form-block">
                    <label class="label" for="owner-select">{{$t('entity.contract.owner')}} *</label>
					<div class="select">
						<select id="owner-select" v-bind:class="{'has-error': contractCreateForm.ownerError}" name="owner-select" v-model="contractCreateForm.ownerId" aria-describedby="owner-error" required>
							<option value="" disabled>{{$t('entity.contract.selectOwner')}}</option>
							<option v-for="user of users" :key="user.id" :value="user.id">{{user.username}}</option>
						</select>
					</div>
                    <p v-show="contractCreateForm.ownerError" id="owner-error" class="info-error">{{contractCreateForm.ownerError}}</p>
                </div>

                <button class="btn btn--default" type="submit">{{$t('action.create')}}</button>
                <p v-show="contractCreateForm.error" class="info-error">{{contractCreateForm.error}}</p>
                <p v-show="successMsg" class="info-success">{{ successMsg }}</p>
            </form>
        </section>

		<section id="my-contracts">
			<h2 class="admin-contracts__title-2">{{$t('contracts.contractsList')}}</h2>
			<AdminContractTable v-if="contracts.length > 0" :contracts="contracts" @delete-contract="deleteContract"/>
        	<p v-else>{{$t('contracts.noContract')}}</p>
		</section>

        <BackToTop />

    </article>
</template>

<script>
    import AdminContractTable from './AdminContractTable'
    import BackToTop from '../BackToTop'

    export default {
        name: 'adminContractList',
        components: {
            AdminContractTable,
            BackToTop
        },
        data() {
            return {
                contracts: [],
                contractCreateForm: {
                    name: null,
                    ownerId: "",
                    dateEnd: null,
                    error: "",
                    nameError: "",
                    dateError: "",
                    ownerError: "",
                },
                successMsg: "",
            }
        },
        props: [ 'users' ],
        computed:{
            newContractCondition(){
                let condition = null
                if(this.$store.state.auth.user.appRole.name == 'SUPER_ADMIN'){
                    condition = true
                }
                else {
                    condition = false
                }
                return condition;
            },
            nameDescribedBy(){
                let description = 'contract-name-constraint';
                if(this.contractCreateForm.nameError){
                    description = 'name-error contract-name-constraint'
                }
                return description;
            }
        },
        methods: {
            updateContracts(){
                this.contractService.findAll(
                    contracts => {
                        this.contracts = contracts
                    },
                    err => console.error(err)
                );
            },

            createContract(){
                if(this.contractCreateForm.name == null || this.contractCreateForm.name.length > 50 || this.contractCreateForm.dateEnd == null || this.contractCreateForm.ownerId == ""){

                    if(this.contractCreateForm.name == null){
                        this.contractCreateForm.nameError = this.$i18n.t("form.emptyInput")
                    } else if(this.contractCreateForm.name.length > 50){
                        this.contractCreateForm.nameError = this.$i18n.t("form.nameError")
                    } else {
                        this.contractCreateForm.nameError = ""
                    }

                    if(this.contractCreateForm.dateEnd == null) {
                        this.contractCreateForm.dateError = this.$i18n.t("form.emptyInput")
                    } else {
                        this.contractCreateForm.dateError = ""
                    }

                    if(this.contractCreateForm.ownerId == "") {
                        this.contractCreateForm.ownerError = this.$i18n.t("form.emptyInput")
                    } else {
                        this.contractCreateForm.ownerError = ""
                    }

                }
                else {
                    this.contractCreateForm.error = "";
                    this.contractCreateForm.nameError = "";
                    this.contractCreateForm.dateEndError = "";
                    this.contractCreateForm.ownerError = "";

                    this.contractService.create(
                        this.contractCreateForm.name,
                        this.contractCreateForm.dateEnd,
                        this.contractCreateForm.ownerId,
                        (contract) => {
                            this.contracts.push(contract)
                            this.successMsg = this.$i18n.t("form.contractCreation")
                        },
                        (err) => {
                            this.contractCreateForm.error = this.$i18n.t("form.genericError")
                        }
                    )
                    this.contractCreateForm.name = "";
                    this.contractCreateForm.dateEnd = "";
                    this.contractCreateForm.ownerId = "";
                }
            },

            deleteContract(contract){
                const index = this.contracts.indexOf(contract);
                this.contractService.delete(
                    contract.id,
                    () => {
                        this.contracts.splice(index, 1)

                    },
                    (error) => console.log('failed')
                )
            }

        },
        created() {
            this.updateContracts();
            //this.updateUsers();
        },

    }
</script>

<style lang="scss" scoped>
    .admin-contracts {
        .admin-contracts__title-2 {
            margin-top: 6.2rem;
            margin-bottom: 3.1rem;
        }

        .select {
            max-width: 38rem;
        }
    }
</style>
