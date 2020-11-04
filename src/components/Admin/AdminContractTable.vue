<template>
	<div>
		<div class="form-block form-block--half">
			<label class="label" for="search-contract">{{$t('action.search')}} : </label>
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
		<p class='screen-reader-text' id="search-explanation-contract">{{$t('contracts.infoSearch')}} : {{ contracts.length }}</p>

		<div aria-live="polite" class='screen-reader-text'>
			<p>{{ liveMsg }}</p>
		</div>
		<div class="table-container">
			<table class="table table--default">
				<thead>
					<tr>
						<th scope="col">{{$t('entity.contract.name')}}</th>
						<th scope="col">{{$t('entity.contract.dateEnd')}}</th>
						<th scope="col">{{$t('entity.generic.actions')}}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="contract of filteredContracts.slice().reverse()" :key="contract.id">
						<th scope="row">{{contract.name}}</th>
						<td>{{ moment(contract.dateEnd).format('LL') }}</td>
						<td class="td-actions">
							<ul class="actions-list">
								<li class="actions-list__item">
									<router-link class="link link-independent link-independent--icon" :to="'/contracts/' + contract.id">
										<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
										<span>{{$t('action.show')}}</span>
									</router-link>
								</li>
								<li class="actions-list__item">
									<button
										class="btn btn--icon btn--nude"
										v-show="$store.state.auth.authorities['DELETE_CONTRACT']"
										@click="confirm(contract)">
										<icon-base-decorative><icon-delete/></icon-base-decorative>
										<span>{{$t('action.delete')}}</span>
									</button>
								</li>
							</ul>
						</td>
					</tr>
				</tbody>
			</table>
			<vue-accessible-modal>
				<template v-slot:backdrop></template>
			</vue-accessible-modal>
		</div>
    </div>
</template>

<script>
import IconBaseDecorative from '../icons/IconBaseDecorative'
import IconArrowBlue from '../icons/IconArrowBlue'
import IconDelete from '../icons/IconDelete'
import DeletionModal from '../DeleteModal'

export default {
    name: 'AdminContractTable',
	components: {
		IconBaseDecorative,
		IconArrowBlue,
		IconDelete,
	},
	data(){
		return {
			searchContract : "",
			liveMsg : "",
			timer : null
		}
	},
	props: [ 'contracts' ],
	computed: {
		filteredContracts(){
			let filteredContracts = [];
			if(!this.searchContract){
				filteredContracts = this.contracts
			}
			else if(this.searchContract){
				filteredContracts = this.contracts.filter(contract =>
					contract.name.toLowerCase().includes(this.searchContract.toLowerCase())
				)
			}
			return filteredContracts;
		}
	},
    methods: {
        moment: function (date) {
            this.$moment.locale(this.$i18n.locale)
            return this.$moment(date);
        },

		fireAriaLive(){
			clearTimeout(this.timer)
			this.timer = setTimeout(this.populateAriaLive, 1500)
		},

		populateAriaLive(){
			this.liveMsg = this.filteredContracts.length + ' ' + this.$i18n.t("contract.contracts")
		},
		confirm(contract) {
			this.$modal
			.confirm(DeletionModal, this.$t('deletionModal.delete') + contract.name + ' ?', {
				label: "deletion-modal",
				classes: "modal",
				attributes: {
					id: "deletion-modal",
					role: "dialog",
					tabindex: "0"
				}
			})
			.then(() => {
				this.$emit('delete-contract', contract)
			})
			.catch(() => {

			})
			.finally(() => {
				this.$modal.close()
			})
		},
	},
}
</script>

<style lang="scss" scoped>
</style>
