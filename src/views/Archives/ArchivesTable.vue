<template>
    <div>
        <p v-show="this.errorMsg">{{ errorMsg }}</p>
        <div v-if="auditsByType.length > 0">
            <button
                type="button"
                :class="firstToLast ? 'btn btn--default-inverse btn--icon' : 'btn btn--default btn--icon'"
                @click="reverseAuditOrder()"
                aria-pressed="true"
            >
                {{ $t('action.sortAudits') }}
                <icon-base-decorative v-if="firstToLast">
                    <icon-close/>
                </icon-base-decorative>

                <icon-base-decorative v-else>
                    <icon-checked/>
                </icon-base-decorative>
            </button>
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
                <tr v-for="audit of auditOrder" :key="audit.id" v-if="audit.type === type && totalPagesByAudit[audit.id] && totalPagesByAudit[audit.id] > 0">
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
                            <li class="actions-list__item"
                                v-if="audit.status === 'DONE' || audit.status === 'ERROR'">
                                <button
                                    class="btn btn--icon btn--nude"
                                    @click="confirmAuditDeletion(audit)">
                                    <icon-base-decorative>
                                        <icon-delete/>
                                    </icon-base-decorative>
                                    <span>{{ $t('action.delete') }}</span>
                                </button>
                            </li>
                            <li class="actions-list__item"
                                v-if="(hasScreenShotByAudit[audit.id] && audit.status === 'DONE') || (hasScreenShotByAudit[audit.id] && audit.status === 'ERROR')">
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
        </div>
        <div v-else>
            <p>{{ $t('archives.noAudit') }}</p>
        </div>
        <vue-accessible-modal>
            <template v-slot:backdrop></template>
        </vue-accessible-modal>
    </div>
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconArrowBlue from '../../components/icons/IconArrowBlue'
import IconDelete from '../../components/icons/IconDelete'
import IconChecked from '../../components/icons/IconChecked'
import IconClose from '../../components/icons/IconClose'
import DeletionModal from '../../components/DeleteModal'

export default {
    name: 'ArchivesTable',
    components: {
        IconBaseDecorative,
        IconArrowBlue,
        IconDelete,
        IconChecked,
        IconClose,
        DeletionModal
    },
    data() {
        return {
            totalPagesByAudit: {},
            hasScreenShotByAudit: [],
            firstToLast: false,
            errorMsg: ''
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
			.finally(() => {this.$modal.close})
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
			.finally(() => {this.$modal.close})
        },

        reverseAuditOrder(){
            if(this.firstToLast == true) {
                this.firstToLast = false
            } else { this.firstToLast = true }
        },

        moment: function (date) {
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
                    this.errorMsg = "There was an issue retrieving the data. Please try again later or verify if you are allowed to access it (" + error + ")."
                }
            )

            this.auditService.hasScreenshotsById(
                this.audits[i].id,
                this.audits[i].shareCode,
                (hasScreenshot) => {
                    this.$set(this.hasScreenShotByAudit, this.audits[i].id, hasScreenshot)
                },
                (error) => {
                    console.error(error)
                }
            )
        }
    },
    computed: {
        auditsByType() {
            let auditsOfType = [];
            this.audits.forEach(audit => {
                if(audit.type === this.type){
                    auditsOfType.push(audit)
                }
            });

            return auditsOfType;
        },
        auditOrder() {
            let auditOrder = this.auditsByType;
            if(this.firstToLast == true){
                auditOrder = this.auditsByType
            } else { auditOrder = this.auditsByType.slice().reverse()}
            return auditOrder;
        },
    }
}
</script>

<style scoped>

button {
    margin-bottom: 1rem;
}
</style>
