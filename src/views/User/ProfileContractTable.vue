<template>
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
				<tr v-for="contract of contracts" :key="contract.id">
					<th scope="row">{{contract.name}}</th>
					<td>{{ moment(contract.dateEnd).format('LL') }}</td>
					<td class="td-actions">
						<router-link class="link link-independent link-independent--icon" :to="'/contracts/' + contract.id" v-on:click.native="activeTab()" >
							<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
							<span>{{$t('action.show')}}</span>
						</router-link>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconArrowBlue from '../../components/icons/IconArrowBlue'
import IconDelete from '../../components/icons/IconDelete'

export default {
    name: 'ProfileContractTable',
	components: {
		IconBaseDecorative,
		IconArrowBlue,
		IconDelete,
	},
    props: [ 'contracts' ],
    methods: {
        moment: function (date) {
            this.$moment.locale(this.$i18n.locale)
            return this.$moment(date);
		},
		
		activeTab(){
			this.$store.state.activeTab.name = 'information'
		}
    }
}
</script>

<style scoped>

</style>
