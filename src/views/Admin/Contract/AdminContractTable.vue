<template>
	<div>
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
			{{ contracts.length }}</p>

		<div aria-live="polite" class='screen-reader-text'>
			<p>{{ liveMsg }}</p>
		</div>

		<contract-table
			:contracts="filteredContracts">
		</contract-table>


	</div>
</template>

<script>
import ContractTable from "@/components/contract/ContractTable";

export default {
	name: 'AdminContractTable',
	components: {
		ContractTable,
	},
	props: ['contracts'],
	data() {
		return {
			searchContract: "",
			liveMsg: "",
			timer: null
		}
	},
	computed: {
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
		fireAriaLive() {
			clearTimeout(this.timer)
			this.timer = setTimeout(this.populateAriaLive, 1500)
		},

		populateAriaLive() {
			this.liveMsg = this.filteredContracts.length + ' ' + this.$i18n.t("contract.contracts")
		},
	},
}
</script>

<style lang="scss" scoped>
</style>
