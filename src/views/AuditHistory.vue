<template>
    <main role="main" class="wrapper" id="page">
		<!--<Breadcrumbs :breadcrumbsItems='breadcrumbProps' ></Breadcrumbs>-->

		<header class="headline header-archives">
			<span class="header-archives__headline" v-if="audit">{{audit.name}}</span>
			<h1 class="header-archives__title">{{$t('page.history')}}</h1>
		</header>

        <article class="article-archives" id="page-audit">
			<div class="table-container">
				<table class="table table--default">
					<caption class="screen-reader-text" id="caption1">{{$t('history.tableCaption')}}</caption>
					<thead>
						<tr>
							<th></th>
							<th></th>
							<th></th>
							<th scope="col">{{$t('entity.generic.actions')}}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th></th>
							<td></td>
							<td></td>
							<td class="td-actions">
								<button
									class="btn btn--icon btn--nude"
                                >
									<icon-base-decorative><icon-delete/></icon-base-decorative>
									<span>{{$t('action.delete')}}</span>
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
        </article>
    </main>
</template>


<script>
import moment from 'moment';
import Breadcrumbs from '../components/Breadcrumbs';
import IconBaseDecorative from '../components/icons/IconBaseDecorative';
import IconDelete from '../components/icons/IconDelete';

export default {
    name: 'AuditHistory',
    components: {
        Breadcrumbs,
        IconBaseDecorative,
		IconDelete,
    },
    data() {
        return {
            audit: null,
            sharecode: null
        }
    },
    metaInfo(){
		return {
			// if no subcomponents specify a metaInfo.title, this title will be used
			title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.history"),
			meta: [
				{
					name: 'robots', content: 'noindex'
				}
			]
		}
    },
    created(){
		this.sharecode = this.$route.params.sharecode;

        this.auditService.findById(
            this.$route.params.auditId,
            this.sharecode,
            (audit) => {
                this.audit = audit
            },
            (error) => {console.log(error)}
        )
    }
}
</script>

<style lang="scss" scoped>

</style>
