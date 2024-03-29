<template>
    <main role="main" class="wrapper" v-if="project.id" id="page">
        <Breadcrumbs :breadcrumbsItems='breadcrumbProps'></Breadcrumbs>

        <header class="headline header-archives">
            <span class="header-archives__headline">{{ project.name }}</span>

            <h1 class="header-archives__title">{{ $t('page.archives') }}</h1>

            <ul class="actions-list">
                <li class="actions-list__item">
                    <a class="link link-independent link-independent--icon" href="#page-audit">
                        <icon-base-decorative width="24" height="24" viewBox="0 0 72 72">
                            <icon-audit-page/>
                        </icon-base-decorative>
                        <span>{{ $t('entity.audit.page') }}</span>
                    </a>
                </li>
                <li class="actions-list__item" v-if="project.name != 'Bac à sable'">
                    <a class="link link-independent link-independent--icon" href="#site-audit">
                        <icon-base-decorative width="24" height="24" viewBox="0 0 72 72">
                            <icon-audit-site/>
                        </icon-base-decorative>
                        <span>{{ $t('entity.audit.site') }}</span>
                    </a>
                </li>
                <li class="actions-list__item">
                    <a class="link link-independent link-independent--icon" href="#upload-audit">
                        <icon-base-decorative width="24" height="24" viewBox="0 0 72 72">
                            <icon-audit-file/>
                        </icon-base-decorative>
                        <span>{{ $t('entity.audit.upload') }}</span>
                    </a>
                </li>
                <li class="actions-list__item">
                    <a class="link link-independent link-independent--icon" href="#scenario-audit">
                        <icon-base-decorative width="24" height="24" viewBox="0 0 72 72">
                            <icon-audit-scenario/>
                        </icon-base-decorative>
                        <span>{{ $t('entity.audit.scenario') }}</span>
                    </a>
                </li>
                <!--<li class="actions-list__item">
					<a class="link link-independent link-independent--icon" href="#assisted-audit">
						<icon-base-decorative width="24" height="24" viewBox="0 0 72 72"><icon-audit-assisted /></icon-base-decorative>
						<span>{{$t('entity.audit.assisted')}}</span>
					</a>
				</li>-->
            </ul>
        </header>

        <article class="article-archives" :id="type.toLowerCase() + '-audit'" v-for="type of typesByProject" :key="type">
            <h2 class="article-archives__title">
                <icon-base-decorative width="40" height="40" viewBox="0 0 72 72">
                    <icon-audit-page/>
                </icon-base-decorative>
                <span v-if="type == 'PAGE'">{{ $t('entity.audit.page') }}</span>
                <span v-else-if="type == 'SITE'">{{ $t('entity.audit.site') }}</span>
                <span v-else-if="type == 'UPLOAD'">{{ $t('entity.audit.upload') }}</span>
                <span v-else>{{ $t('entity.audit.scenario') }}</span>
            </h2>
            <div class="table-container">
                <ArchivesTable :type="type" :projectId="projectId" :authorities="authorities"/>
            </div>
        </article>
    </main>
</template>


<script>
import Breadcrumbs from '../../components/Breadcrumbs';
import ArchivesTable from './ArchivesTable';
import IconBaseDecorative from '../../components/icons/IconBaseDecorative';
import IconAuditAssisted from '../../components/icons/IconAuditAssisted';
import IconAuditSite from '../../components/icons/IconAuditSite';
import IconAuditPage from '../../components/icons/IconAuditPage';
import IconAuditScenario from '../../components/icons/IconAuditScenario';
import IconAuditFile from '../../components/icons/IconAuditFile';
import IconArrowBlue from '../../components/icons/IconArrowBlue';
import IconDelete from '../../components/icons/IconDelete';


export default {
    name: 'Archives',
    components: {
        Breadcrumbs,
        ArchivesTable,
        IconBaseDecorative,
        IconAuditAssisted,
        IconAuditFile,
        IconAuditPage,
        IconAuditScenario,
        IconAuditSite,
        IconArrowBlue,
        IconDelete,
    },
    data() {
        return {
            project: [],
            currentUserRole: null,
            breadcrumbProps: [
                {
                    name: this.$i18n.t('page.dashboard'),
                    path: '/'
                },
            ],
            deleteAuditError: "",
            projectId : "",
			authorities: []
        }
    },
    metaInfo() {
        return {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.archives"),
            meta: [
                {
                    name: 'robots', content: 'noindex'
                }
            ]
        }
    },
    computed : {
        typesByProject() {
            let types = [];
            if(this.project.name != "Bac à sable") {
                types = ['PAGE', 'SITE', 'SCENARIO', 'UPLOAD']
            } else {
                types = ['PAGE', 'SCENARIO', 'UPLOAD']
            }
            return types;
        }
    },
    created() {
        this.projectId = this.$route.params.id;

        this.projectService.getCurrentUserAuthorities(
			this.$route.params.id,
			(authorities) => {		
				if(authorities.includes("SHOW_AUDIT")) {
                    this.projectService.findById(
                        this.$route.params.id,
                        (project) => {
                            this.project = project;
                            // Breadcrumbs
                            if(project.contract.allowCreateProject){
                                this.breadcrumbProps.push({
                                    name: project.contract.name,
                                    path: '/contracts/' + project.contract.id
                                })
                                this.breadcrumbProps.push({
                                    name: project.name,
                                    path: '/projects/' + project.id
                                })
                            }
                            
                            this.breadcrumbProps.push({
                                name: project.name + ' archives'
                            })

                            // Find current user role
                            this.userService.findAllByProject(
                                this.project.id,
                                (users) => {
                                    let currentUser = users.filter(user =>
                                        user.contractAppUser.user.id == this.$store.state.auth.user.id
                                    )
                                    this.currentUserRole = currentUser[0].projectRole.name
                                },
                                (error) => {
                                    console.error(error)
                                }
                            )

                            this.projectService.findAuthoritiesByProjectId(
                                this.projectId,
                                (authorities) => {
                                    this.authorities = authorities;
                                },
                                (error) => {
                                    console.error("Unable to get authorities for project ", this.projectId);
                                }
                            )
                        },
                        (error) => {
                            console.error(error)
                        }
                    );

                    this.auditService.findByProjectId(
                        this.$route.params.id,
                        (audits) => {
                            this.audits = audits
                        },
                        (error) => {
                            console.error(error)
                        }
                    );
                } else {
                    this.$router.replace('/forbidden');
                }
            },
			(error) => {
				console.log(error);
			}
		)
    }
}
</script>

<style lang="scss" scoped>
.header-archives {
    margin-bottom: 6.4rem;

    .header-archives__headline {
        color: $text-secondary;
        font-family: $font-stack-secondary;
        font-size: $small-font-size;
    }

    .header-archives__title {
        margin: 0;
    }

    .actions-list {
        display: none;

        @media #{$media-md-viewport} {
            display: flex;
        }
    }
}

.article-archives {
    margin-bottom: 6.4rem;

    .article-archives__title {
        span,
        svg {
            vertical-align: middle;
        }

        svg {
            margin-right: .8rem;
        }
    }
}
</style>
