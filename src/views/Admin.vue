<template>
    <main class="wrapper" id="page" role="main">
		<Tabs>
			<Tab :name="$t('entity.contract.contracts')" selected="true" class="tabs-wrapper">
				<adminContractList :users="users" />
			</Tab>
			<Tab :name="$t('entity.user.users')" class="tabs-wrapper">
				<adminUserList :users="users"  @create-user="createUser" />
			</Tab>
		</Tabs>
    </main>
</template>

<script>
import Tab from '../components/Admin/AdminTab';
import Tabs from '../components/Admin/AdminTabs';
import adminUserList from '../components/Admin/AdminUserList';
import adminContractList from '../components/Admin/AdminContractList';

export default {
    name: 'Admin',
    components : {
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
		if(this.$store.state.user.appRole.name == 'USER'){
			this.$router.replace('/configuration')
		}

		this.userService.findAll(
			users => {
				this.users = users
			},
			err => console.error(err)
		);
	}
}
</script>
