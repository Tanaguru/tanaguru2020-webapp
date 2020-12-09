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
			<AdminContractTable v-if="contracts.length > 0" :contracts="contracts" @delete-contract="deleteContract"/>
			<p v-else>{{ $t('contracts.noContract') }}</p>
		</section>

		<BackToTop/>
	</article>
</template>

<script>
import AdminContractTable from './AdminContractTable'
import BackToTop from '../../../components/BackToTop'
import ContractCreationForm from "@/components/contract/ContractCreationForm";

export default {
	name: 'adminContractList',
	components: {
		ContractCreationForm,
		AdminContractTable,
		BackToTop
	},
	props: ['users'],
	data() {
		return {
			contracts: [],
		}
	},
	computed: {
		newContractCondition() {
			return this.$store.state.auth.authorities &&
				this.$store.state.auth.authorities['CREATE_CONTRACT'];
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
