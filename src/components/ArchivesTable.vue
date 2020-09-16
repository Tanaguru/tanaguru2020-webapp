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
            <tr v-for="audit of audits" :key="audit.id" v-if="totalPagesByAudit[audit.id]">
                <th scope="row">{{ audit.name }}</th>
                <td>{{ $t('auditDetail.status.' + audit.status.toLowerCase()) }}</td>
                <td>{{ totalPagesByAudit[audit.id] }}</td>
                <td>{{ audit.dateEnd ? moment(audit.dateEnd).format('LL') : '' }}</td>
                <td class="td-actions">
                    <router-link class="link link-independent link-independent--icon" :to="'/audits/' + audit.id">
                        <icon-base-decorative>
                            <icon-arrow-blue/>
                        </icon-base-decorative>
                        <span>{{ $t('action.show') }}</span>
                    </router-link>
                    <button
                        class="btn btn--icon btn--nude"
                        @click="confirmAuditDeletion(audit)">
                        <icon-base-decorative>
                            <icon-delete/>
                        </icon-base-decorative>
                        <span>{{ $t('action.delete') }}</span>
                    </button>
                    <button
                        class="btn btn--icon btn--nude"
                        @click="confirmAuditScreenshotDeletion(audit)">
                        <icon-base-decorative>
                            <icon-delete/>
                        </icon-base-decorative>
                        <span>{{ $t('action.deleteScreenshot') }}</span>
                    </button>
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
    props: ['audits', 'deleteCondition'],
    methods: {
        confirm(audit) {
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
			})
			.catch(() => {
				
			})
			.finally(() => {
				this.$modal.close()
			})
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
