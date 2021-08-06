<template>
    <section>
        <div class="table-container">
            <table class="table table--default">
                <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">{{ $t('auditDetail.linkToAudit') }}</th>
                    <th scope="col">{{ $t('auditDetail.pageAudited') }}</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="audit of publicAudits" :key="audit.id">
                        <th scope="row">{{ audit.name }}</th>
                        <th scope="row"><a :href="urlRacine+'#/audits/'+audit.id">{{urlRacine+'#/audits/'+audit.id}}</a></th>
                        <th scope="row" v-if="auditAndPage[audit.id]" ><a :href="auditAndPage[audit.id].url"> {{ auditAndPage[audit.id].name }} </a></th>
                    </tr>
                </tbody>
            </table>
        </div>
        <pagination
            :current-page="auditCurrentPage"
            :total-pages="auditTotalPage"
            @changePage="(page) => {loadPublicAudits(page, auditPageSize, filter)}"
        />
	</section>

</template>

<script>
import Pagination from "../Pagination";

export default {
	name: 'publicAuditTable',
    components: {
        Pagination
    },
    data(){
        return {
            auditPageSize: 10,
            auditTotalPage : 0,
            auditCurrentPage: 0,
			auditTotal: 0,
            filter: "dateStart",
            publicAudits: [],
            urlRacine: WEB_APP_URL,
            auditAndPage: {}
        }
    },
	created(){
        this.loadPublicAudits(this.auditCurrentPage,this.auditPageSize,this.filter);
    },
    methods:{
        loadPublicAudits(page, size, filter){
            this.auditService.getAllPublic(
                page,
                size,
                filter,
                (publicAudits) => {
                    this.auditCurrentPage = page;
                    this.auditTotalPage = publicAudits.totalPages;
				    this.auditTotal = publicAudits.totalElements;
                    this.publicAudits = publicAudits.content
                    for(var audit of this.publicAudits){
                        this.getPageForAudit(audit.id, audit.sharecode)
                    }
                },
                (error) => {
                    console.error(error)
                }
            );
        },
        getPageForAudit(auditId, shareCode){
            this.pageService.pageByAudit(
                auditId,
                shareCode,
                (pages) => {
                    this.auditAndPage[auditId] = pages[0]
                },
			    (error) => {
				    console.error(error)
			    }
            );
        }
    }
}

</script>

<style lang="scss" scoped>

</style>