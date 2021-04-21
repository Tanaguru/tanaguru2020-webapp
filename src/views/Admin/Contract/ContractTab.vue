<template>
	<article class="admin-contracts">
		<header>
			<h1 v-if="$store.state.auth.user.appRole.name === 'USER'">{{ $t('page.configContract') }}</h1>
			<h1 v-else>{{ $t('page.adminContract') }}</h1>
		</header>

		<section id="contract-create-form" v-if="newContractCondition">
			<h2 class="admin-contracts__title-2">{{ $t('contracts.createContract') }}</h2>
			<contract-creation-form
				:users="users"
				@createContract="onCreateContract"
				:selected="selected">
			</contract-creation-form>
		</section>

		<section id="my-contracts">
			<h2 class="admin-contracts__title-2">{{ $t('contracts.contractsList') }}</h2>
			<div v-if="initWithContracts">
				<div class="form-block form-block--half">
					<label class="label" for="search-contract">{{ $t('action.search') }} : </label>
					<input
						class="input"
						type="search"
						name="search-contract"
						id="search-contract"
						v-model="searchContract"
						aria-describedby="search-explanation-contract"
						autocomplete="off"
						@input="fireAriaLive"
					>
				</div>
				<p class='screen-reader-text' id="search-explanation-contract">{{ $t('contracts.infoSearch') }} :
					{{ contracts.length }} </p>

				<div aria-live="polite" class='screen-reader-text'>
					<p>{{ liveMsg }}</p>
				</div>

				<section>
					<contract-table
						:contracts="contracts"
						@delete-contract="deleteContract"
                        :current-page="contractCurrentPage"
                        :total-pages="contractTotalPage"
                        :element-by-page="contractPageSize"
                        :total-elements="contractTotal"
                    	/>

					<pagination
						:current-page="contractCurrentPage"
						:total-pages="contractTotalPage"
						@changePage="(page) => {loadContracts(page, contractPageSize, searchContract)}"
					/>
				</section>
			</div>
			<div v-else>{{ $t('contracts.noContract') }} </div>
		</section>

		<BackToTop/>
	</article>
</template>

<script>
import BackToTop from '../../../components/BackToTop'
import ContractCreationForm from "@/components/contracts/ContractCreationForm";
import ContractTable from "@/components/contracts/ContractTable";
import Pagination from "../../../components/Pagination";

export default {
	name: 'adminContractList',
	components: {
		ContractTable,
		ContractCreationForm,
		BackToTop,
		Pagination
	},
	props: ['selected' ],
	data() {
		return {
			contracts: [],
			users: [],
			searchContract: "",
			liveMsg: "",
			timer: null,
			contractPageSize: 5,
            contractTotalPage : 0,
            contractCurrentPage: 0,
			contractTotal: 0,
			initWithContracts: false,
			cpt: 0
		}
	},
	created() {
		this.loadContracts(this.contractCurrentPage, this.contractPageSize, this.searchContract);
		this.loadUsers();
		console.log(this.contracts)
	},
	watch: {
    	selected: function(newVal, oldVal) {
			if(newVal == 0) {
				this.searchContract = ""
				this.liveMsg = ""
				this.loadUsers()
				this.loadContracts(this.contractCurrentPage, this.contractPageSize, this.searchContract);
			}
		}
	},
	computed: {
		newContractCondition() {
			return this.$store.state.auth.authorities &&
				this.$store.state.auth.authorities['CREATE_CONTRACT'];
		},
	},
	methods: {
		onCreateContract(contract) {
			this.initWithContracts = true;
			this.contracts.push(contract);
			this.loadContracts(this.contractCurrentPage, this.contractPageSize, this.searchContract);
		},

		deleteContract(contract) {
			const index = this.contracts.indexOf(contract);
            if(index > -1){
				this.contractService.delete(
					contract.id,
					() => {
						this.contracts.splice(index, 1)
					},
					(error) => {
						if(err.response.data.error == "CONTRACT_NOT_FOUND"){
							this.deleteContractError = this.$i18n.t("form.errorMsg.contract.notFound")
						} else if(err.response.status == "403"){
							this.deleteContractError = this.$i18n.t("form.errorMsg.user.permissionDenied")
						} else {
							this.deleteContractError = this.$i18n.t("form.errorMsg.genericError");
						}
					}
				);
				this.loadContracts(this.contractCurrentPage, this.contractPageSize, this.searchContract);
			}
		},
		fireAriaLive() {
			clearTimeout(this.timer)
			this.timer = setTimeout(this.populateAriaLive, 1000)
		},

		populateAriaLive() {
			this.liveMsg = this.contracts.length + ' ' + this.$i18n.t("contract.contracts");
			this.filteredContracts();
		},

		filteredContracts() {
			this.loadContracts(0, this.contractPageSize, this.searchContract);
		},

		loadContracts(page, size, filter){
			this.contractService.findAll(
			page,
			size,
			filter,
            (contracts) => {
                this.contractCurrentPage = page;
				this.contracts = contracts.content;
                this.contractTotalPage = contracts.totalPages;
				this.contractTotal = contracts.totalElements;
				if(this.cpt==0){
					if(this.contractTotal>0){
						this.initWithContracts = true;
					}
					this.cpt = this.cpt+1;
				}
				if(contracts.totalElements == 0 && filter==""){
					this.initWithContracts = false;
				}
            },
			err => console.error(err)
			);

		},

		loadUsers(){
			this.userService.findAll(
				users => {
					this.users = users
				},
				err => console.error(err)
			);
		}
	}
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
