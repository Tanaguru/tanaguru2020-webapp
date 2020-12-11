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
				@createContract="onCreateContract">
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

				<contract-table
					:contracts="filteredContracts"
					@delete-contract="deleteContract"
				>
				</contract-table>
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

export default {
	name: 'adminContractList',
	components: {
		ContractTable,
		ContractCreationForm,
		BackToTop
	},
	props: ['users'],
	data() {
		return {
			contracts: [],
			searchContract: "",
			liveMsg: "",
			timer: null
		}
	},
	created() {
		this.contractService.findAll(
			contracts => {
				this.contracts = contracts
			},
			err => console.error(err)
		);
	},
	computed: {
		newContractCondition() {
			return this.$store.state.auth.authorities &&
				this.$store.state.auth.authorities['CREATE_CONTRACT'];
		},
		filteredContracts() {
			let contractList = this.searchContract ?
				this.contracts.filter(contract =>
					contract.name.toLowerCase()
						.includes(this.searchContract.toLowerCase())) :
				this.contracts;

			return contractList.reverse();
		}
	},
	methods: {
		onCreateContract(contract) {
			this.contracts.push(contract);
		},

		deleteContract(contract) {
			const index = this.contracts.indexOf(contract);
			this.contractService.delete(
				contract.id,
				() => {
					this.contracts.splice(index, 1)

				},
				(error) => console.error(error)
			)
		},
		fireAriaLive() {
			clearTimeout(this.timer)
			this.timer = setTimeout(this.populateAriaLive, 1500)
		},

		populateAriaLive() {
			this.liveMsg = this.filteredContracts.length + ' ' + this.$i18n.t("contract.contracts")
		},
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
