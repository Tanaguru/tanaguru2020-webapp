<template>
	<div class="table-container">
		<table class="table table--default" v-show="projects">
			<caption class="screen-reader-text">{{$t('contract.legendProjects')}}</caption>
			<thead>
				<tr>
					<th scope="col">{{$t('entity.project.name')}}</th>
					<th scope="col">{{$t('entity.generic.actions')}}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="project of projects" :key="project.id">
					<th scope="row">{{project.name}}</th>
					<td class="td-actions">
						<ul class="actions-list">
							<li class="actions-list__item">
								<router-link :to="'/projects/' + project.id" class="link link-independent link-independent--icon">
									<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
									<span>{{$t('action.show')}}</span>
								</router-link>
							</li>
							<li class="actions-list__item">
								<router-link :to="'/projects/' + project.id + '/archives'" class="link link-independent link-independent--icon">
									<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
									<span>{{$t('dashboard.actions.archives')}}</span>
								</router-link>
							</li>
							<li class="actions-list__item" v-if="hasAuthorityOnProject(project.id, 'DELETE_PROJECT')">
								<button
									@click="confirm(project)"
									class="btn btn--nude btn--icon">
									<icon-base-decorative><icon-delete /></icon-base-decorative>
									<span>{{$t('action.delete')}}</span>
								</button>
							</li>
							<li class="actions-list__item">
								<button
									class="btn btn--icon btn--nude"
									:aria-controls="'tooltip__info_' + project.id"
									:aria-expanded="showApiKeyTooltip == project.id ? 'true' : 'false'"
									@click="openApiKeyTooltip(project.id)">

									<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
									<span>{{$t('project.apiKey')}}</span>
								</button>
								
								<div :id="'tooltip__info_' + project.id" role="tooltip" v-show="showApiKeyTooltip == project.id">
									<div class="tooltip-clipboard">
										<input readonly class="input" :id="idApiKey(project.id)" :value="apiKey">
										<button
											@click.stop.prevent="copyApiKey(project.id)"
											class="btn btn--clipboard">
											{{ copyButtonText }}
										</button>
									</div>
									<div aria-live="polite" class="screen-reader-text">{{ screenReaderInfo }}</div>
								</div>
								
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
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconArrowBlue from '../../components/icons/IconArrowBlue'
import DeletionModal from '../../components/DeleteModal'
import IconDelete from '../../components/icons/IconDelete'

export default {
    name: 'ContractProjectTable',
	components: {
		IconBaseDecorative,
		IconArrowBlue,
		IconDelete,
		DeletionModal
	},
	data(){
		return{
			apiKey: '',
			copyButtonText: this.$i18n.t("action.copy"),
			screenReaderInfo: '',
			currentUser: null,
			selectedProject: 0
		}
	},
    props: [ 'projects', 'authorityByProjectId' ],
	computed:{
		showApiKeyTooltip(){
			return this.selectedProject;
		}
	},
    methods: {
        confirm(project) {
			this.$modal
			.confirm(DeletionModal, this.$t('deletionModal.delete') + project.name + ' ?', {
				label: "deletion-modal",
				classes: "modal",
				attributes: {
					id: "deletion-modal",
					role: "dialog",
					tabindex: "0"
				}
			})
			.then(() => {
				this.$emit('delete-project', project)
				this.$modal.close()
			})
			.catch(() => {
				this.$modal.close()
			})
			.finally(() => {})
		},

		hasAuthorityOnProject(projectId, needed){
			return this.authorityByProjectId[projectId] && this.authorityByProjectId[projectId].some(authority => {
					return authority === needed;
				});
		},

		idApiKey(projectId){
			return 'apiKey_'+projectId;
		},

		openApiKeyTooltip(projectId){
			this.selectedProject = projectId;
			this.screenReaderInfo = '';
			this.copyButtonText = this.$i18n.t("action.copy");
			let elementApiKey = document.querySelector('#apiKey_'+projectId);
			elementApiKey.hidden = false;
			this.userService.me(
				(data) => {
                    var currentUserId = data.id;
					this.projectService.getApiKey(projectId, currentUserId,
						(data) => {
							this.apiKey = data;
						},
						(error) => {
							console.log(error)
						});
                },
                (error) => {
					console.log(error)
				}
			);
		},

		copyApiKey(projectId) {
            let elementApiKey = document.querySelector('#apiKey_'+projectId);
            elementApiKey.hidden = false;
            elementApiKey.select();
			
            try {
				navigator.clipboard.writeText(elementApiKey.value);
                this.copyButtonText = this.$i18n.t("resultAudit.copyLink.success");
                this.screenReaderInfo = this.$i18n.t("resultAudit.copyLink.sucessHelp");
                setTimeout(() => {
                        this.selectedProject = 0;
						this.apiKey = '';
				}, 400)
            } catch (err) {
                this.copyButtonText = this.$i18n.t("resultAudit.copyLink.fail");
                this.screenReaderInfo = this.$i18n.t("resultAudit.copyLink.failHelp");
            }
            elementApiKey.hidden = true;
			elementApiKey.closest('li').firstElementChild.focus();
        }
    }
}
</script>

<style scoped>

</style>
