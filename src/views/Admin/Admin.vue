<template>
    <main class="wrapper" id="page" role="main">
		<Tabs>
			<Tab :name="$t('entity.contract.contracts')" selected="true" class="tabs-wrapper">
				<adminContractList :users="users" />
			</Tab>

			<div v-if="this.$store.state.auth.user.appRole.name !== 'USER'">
				<Tab :name="$t('entity.user.users')" class="tabs-wrapper">
					<adminUserList :users="users"  @create-user="createUser" />
				</Tab>


				<Tab v-if="showReferenceTab"
					:name="$t('entity.reference.references')" class="tabs-wrapper">
					<reference-tab />
				</Tab>
			</div>
		</Tabs>
    </main>
</template>

<script>
import Tab from '../../components/Tab';
import Tabs from '../../components/Tabs';
import adminUserList from './User/UserTab';
import adminContractList from './Contract/ContractTab';
import ReferenceTab from "@/views/Admin/Reference/ReferenceTab";

export default {
    name: 'Admin',
    components : {
		ReferenceTab,
        Tab,
        Tabs,
        adminUserList,
        adminContractList
	},
	data(){
		return {
			users: []
		}
	},
	metaInfo(){
		return {
			// if no subcomponents specify a metaInfo.title, this title will be used
			title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.administration"),
			meta: [
				{
					name: 'robots', content: 'noindex'
				}
			]
		}
	},
	methods:{
		createUser(user){
			this.users.push(user)
		}
	},
	created(){
		this.userService.findAll(
			users => {
				this.users = users
			},
			err => console.error(err)
		);
	},

	computed : {
    	showReferenceTab(){
    		return REFERENCE_PANEL
		}
	}
}
</script>
