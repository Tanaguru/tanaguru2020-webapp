<template>
    <div>
        <main id="page" class="page" role="main">
            <div class="wrapper">
                <Breadcrumbs :breadcrumbsItems='breadcrumbProps' ></Breadcrumbs>
            </div>
		    <div class="wrapper">
                <h1 class="modal-header__title">Source code</h1>

                <highlight-code lang="xml">{{ sourceCode }}</highlight-code>
            </div>

		    <BackToTop />
        </main>
    </div>
</template>

<script>
    import Breadcrumbs from '../../components/Breadcrumbs';
    import BackToTop from '../../components/BackToTop';

    export default {
        name: 'SourceCodePage',
        components: {
            Breadcrumbs,
            BackToTop,
        },
        data() {
            return {
                sourceCode: '',
                project: null,
                audit: null,
                page: null
            }
        },
        metaInfo() {
			return {
				// if no subcomponents specify a metaInfo.title, this title will be used
				title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.sourceCode"),
				meta: [
					{
						name: 'robots', content: 'noindex'
					}
				]
			}
        },
        created() {
            this.auditService.findById(
                this.$route.params.auditId,
                this.sharecode,
                (audit) => {
                    this.audit = audit.name;
                    this.projectService.findByAuditId(
                        audit.id,
                        this.sharecode,
                        (project) => {
                            this.project = project;
                        },
                        (error) => {
                            console.error(error);
                        }
                    );
                },
                (error) => {
                    console.error(error);
                }
            ),
            this.pageContentService.findByPageId(
                this.$route.params.pageId,
                this.sharecode,
                (pageContent) => {
                    this.sourceCode = pageContent.source;
                },
                (error) => {
                    console.error(error)
                },
            ),
            this.pageService.findById(
                this.$route.params.pageId,
                this.sharecode,
                (page) => {
                    this.page = page.name;
                },
                (error) => {
                    console.error(error);
                }
            );
        },
        computed: {
            breadcrumbProps() {
                const breadcrumb = [
                    {
                        name: this.$i18n.t("page.dashboard"),
                        path: "/",
                    },
                ];

                if (this.project) {
                    breadcrumb.push({
                        name: this.project.contract.name,
                        path: "/contracts/" + this.project.contract.id,
                    });

                    breadcrumb.push({
                        name: this.project.name,
                        path: "/projects/" + this.project.id,
                    });
                }

                if (this.audit) {
                    breadcrumb.push({
                        name: this.audit,
                        path: '/audits/' + this.$route.params.auditId + (this.sharecode ? '/' + this.sharecode : '')
                    });
                }

                breadcrumb.push({
                    name: this.page,
                    path: '/audits/' + this.$route.params.auditId + '/pages/' + this.$route.params.pageId + (this.sharecode ? '/' + this.sharecode : ''),
                });

                breadcrumb.push({
                    name: 'source code'
                });
                return breadcrumb;
            }
        }
}
</script>

<style lang="scss" scoped>
.page {
	position: relative;
}
</style>