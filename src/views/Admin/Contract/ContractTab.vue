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
			<div v-if="contracts.length > 0">
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
						@keydown="fireAriaLive"
					>
				</div>
				<p class='screen-reader-text' id="search-explanation-contract">{{ $t('contracts.infoSearch') }} :
					{{ filteredContracts.length }}</p>

				<div aria-live="polite" class='screen-reader-text'>
					<p>{{ liveMsg }}</p>
				</div>

				<section>
					<contract-table
						:contracts="filteredContracts"
						@delete-contract="deleteContract"
                        :current-page="contractCurrentPage"
                        :total-pages="contractTotalPage"
                        :element-by-page="contractPageSize"
                        :total-elements="contractTotal"
                    	/>

					<pagination
						:current-page="contractCurrentPage"
						:total-pages="contractTotalPage"
						@changePage="(page) => {loadContracts(page, contractPageSize)}"
					/>
				</section>

			</div>
			<p v-else>{{ $t('contracts.noContract') }}</p>
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
            contractTotal: 0
		}
	},
	created() {
		this.loadContracts(this.contractCurrentPage, this.contractPageSize);
		this.loadUsers();
	},
	watch: {
    	selected: function(newVal, oldVal) {  
			if(newVal == 0) {
				this.searchContract = ""
				this.liveMsg = ""
				this.loadUsers()
			} 
		}
	},
	computed: {
		newContractCondition() {
			return this.$store.state.auth.authorities &&
				this.$store.state.auth.authorities['CREATE_CONTRACT'];
		},
		filteredContracts() {
			return this.searchContract ?
				this.contracts.filter(contract =>
					contract.name.toLowerCase()
						.includes(this.searchContract.toLowerCase())) :
				this.contracts;
		}
	},
	methods: {
		onCreateContract(contract) {
			this.contracts.push(contract);
			this.loadContracts(this.contractCurrentPage, this.contractPageSize);
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
				this.loadContracts(this.contractCurrentPage, this.contractPageSize);
			}
		},
		fireAriaLive() {
			clearTimeout(this.timer)
			this.timer = setTimeout(this.populateAriaLive, 1500)
		},

		populateAriaLive() {
			this.liveMsg = this.filteredContracts.length + ' ' + this.$i18n.t("contract.contracts")
		},

		loadContracts(page, size){
			this.contractService.findAll(
			page,
            size,
            (contracts) => {
                this.contractCurrentPage = page;
                this.contracts = contracts.content;
                this.contractTotalPage = contracts.totalPages;
                this.contractTotal = contracts.totalElements;
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
