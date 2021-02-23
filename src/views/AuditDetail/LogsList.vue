<template>
    <div>
        <h2>{{ $t('auditDetail.logs') }} ({{totalElements}})</h2>
        <div class="list-audits" role="list">
            <p class="list-audits__item" role="listitem" v-for="(auditLog, i) in auditLogs" :key="auditLog.id">
                <span class="list-audits__number">{{minElementIndex + i}}.</span> <b>{{auditLog.level}}</b> - [{{$moment(auditLog.date).format('DD-MM-YYYY HH:mm')}}] {{auditLog.message}}
            </p>
        </div>
    </div>
</template>

<script>
export default {
	name: "logsList",
    props: ['audit', 'auditLogs', 'totalElements', 'currentPage', 'elementByPage'],
    computed: {
	    minElementIndex(){
	        return this.currentPage * this.elementByPage + 1;
        }
    }
}
</script>

<style lang="scss" scoped>
.list-audits {
	margin: 0 0 2.4rem 3.5rem;
	text-indent: -3.5rem;

	.list-audits__item {
		margin: 0 0 .5rem;
	}

	.list-audits__number {
		margin-right: 1rem;
		color: $text-secondary;
	}
}
</style>
