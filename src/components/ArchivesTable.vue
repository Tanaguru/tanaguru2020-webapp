<template>
    <div>
        <table class="table table--default">
            <caption class="screen-reader-text">{{ $t('archives.legendUpload') }}</caption>
            <thead>
            <tr>
                <th scope="col">
                    {{ $t('entity.audit.name') }}
                </th>
                <th scope="col">
                    {{ $t('entity.audit.status') }}
                </th>
                <th scope="col">
                    {{ $t('entity.audit.nbPage') }}
                </th>
                <th scope="col">
                    {{ $t('entity.audit.dateEnd') }}
                </th>
                <th scope="col">{{ $t('entity.generic.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="audit of audits" :key="audit.id" v-if="audit.type == type && totalPagesByAudit[audit.id]">
                <th scope="row">{{ audit.name }}</th>
                <td>{{ $t('auditDetail.status.' + audit.status.toLowerCase()) }}</td>
                <td>{{ totalPagesByAudit[audit.id] }}</td>
                <td>{{ audit.dateEnd ? moment(audit.dateEnd).format('LL') : '' }}</td>
                <td class="td-actions">
					<ul class="actions-list">
						<li class="actions-list__item">
							<router-link class="link link-independent link-independent--icon" :to="'/audits/' + audit.id">
								<icon-base-decorative>
									<icon-arrow-blue/>
								</icon-base-decorative>
								<span>{{ $t('action.show') }}</span>
							</router-link>
						</li>
						<li class="actions-list__item">
							<button
								class="btn btn--icon btn--nude"
								@click="confirmAuditDeletion(audit)">
								<icon-base-decorative>
									<icon-delete/>
								</icon-base-decorative>
								<span>{{ $t('action.delete') }}</span>
							</button>
						</li>
						<li class="actions-list__item">
							<button
								class="btn btn--icon btn--nude"
								@click="confirmAuditScreenshotDeletion(audit)">
								<icon-base-decorative>
									<icon-delete/>
								</icon-base-decorative>
								<span>{{ $t('action.deleteScreenshot') }}</span>
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
</template>

<script>
import moment from 'moment';
import IconBaseDecorative from './icons/IconBaseDecorative'
import IconArrowBlue from './icons/IconArrowBlue'
import IconDelete from './icons/IconDelete'
import DeletionModal from './DeleteModal'

export default {
    name: 'ArchivesTable',
    components: {
        IconBaseDecorative,
        IconArrowBlue,
        IconDelete,
        DeletionModal
    },
    data() {
        return {
            totalPagesByAudit: {}
        }
    },
    props: ['audits', 'type', 'deleteCondition'],
    methods: {
        confirmAuditDeletion(audit) {
			this.$modal
			.confirm(DeletionModal, this.$t('deletionModal.delete') + audit.name.toUpperCase() + this.$t('deletionModal.project'), {
				label: "deletion-modal",
				classes: "modal",
				attributes: {
					id: "deletion-modal",
					role: "dialog",
					tabindex: "0"
				}
			})
			.then(() => {
                this.$emit('delete-audit', audit)
			    this.$modal.close()
			})
			.catch(() => {
                this.$modal.close()
			})
			.finally(() => {})
        },
        
        confirmAuditScreenshotDeletion(audit) {
            this.$modal
			.confirm(DeletionModal, this.$t('deletionModal.delete') + "all screenshots from" + audit.name.toUpperCase(), {
				label: "screenshot-deletion-modal",
				classes: "modal",
				attributes: {
					id: "screenshot-deletion-modal",
					role: "dialog",
					tabindex: "0"
				}
			})
			.then(() => {
                this.$emit('delete-screenshot', audit)
			    this.$modal.close()
			})
			.catch(() => {
                this.$modal.close()
			})
			.finally(() => {})
        },

        moment: function (date) {
            this.$moment.locale(this.$i18n.locale)
            return this.$moment(date);
        },
    },
    created() {
        for (let i = 0; i < this.audits.length; i++) {
            this.pageService.findByAuditId(
                this.audits[i].id,
                this.audits[i].shareCode,
                0,
                1,
                (pagePage) => {
                    this.$set(this.totalPagesByAudit, this.audits[i].id, pagePage.totalPages)
                },
                (error) => {
                    console.error(error)
                }
            )
        }
    }
}
</script>

<style scoped>

</style>
