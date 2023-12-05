<template>
    <main class="wrapper" role="main" id="page">
        <Breadcrumbs :breadcrumbsItems='breadcrumbProps'></Breadcrumbs>

		<div class="headline headline--top project-header">
			<h1>{{ $t('unsubscribe.title') }}</h1>
        </div>

        <div class="tabs-wrapper">
            <div v-if="project">
                <div v-if="alreadyUnsubscribed">
                    <p>{{ $t('unsubscribe.really') }} : <strong>{{ project.name }}</strong> ?</p>
                    <div id="unsubscribe-info" class="" role="status"></div>
                    <ul class="project-actions-list" v-if="!unsubscribed">
                        <li class="project-actions-list__item">
                            <button class="btn btn--default" @click="unsubscribe">{{ $t('unsubscribe.accept') }}</button>
                        </li>
                        <li class="project-actions-list__item">
                            <router-link class="btn btn--default" :to="'/'">
                                <span>{{ $t('unsubscribe.decline') }}</span>
                            </router-link>
                        </li>
                    </ul>

                    <router-link class="link-independent" :to="'/'" v-else>
                        <span>{{ $t('action.backHome') }}</span>
                    </router-link>
                </div>

                <div v-else>
                    <p role="status">{{ $t('unsubscribe.already') }} : <strong>{{ project.name }}</strong></p>

                    <router-link class="link-independent" :to="'/'">
                        <span>{{ $t('action.backHome') }}</span>
                    </router-link>
                </div>
            </div>

            <div v-else>
                <p class="info-error" role="alert">{{ $t('unsubscribe.projectNotFound') }}</p>

                <router-link class="link-independent" :to="'/'">
                    <span>{{ $t('action.backHome') }}</span>
                </router-link>
            </div>
        </div>
    </main>
</template>

<script>
    import Breadcrumbs from '../../components/Breadcrumbs';
    import IconArrowBlue from '../../components/icons/IconArrowBlue';
    export default {
        name: 'projectUnsubscribe',
        components: {
            Breadcrumbs,
            IconArrowBlue
        },
        data() {
            return {
                project: null,
                unsubscribed: false,
                alreadyUnsubscribed: false,
                breadcrumbProps: [
				{
					name: this.$i18n.t('page.dashboard'),
					path: '/'
				},
                {
					name: this.$i18n.t('title.unsubscribe'),
					path: '/projects/' + this.$route.params.id + "/unsubscribe"
				},
			],
            }
        },
        metaInfo() {
            return {
                // if no subcomponents specify a metaInfo.title, this title will be used
                title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.unsubscribe"),
                meta: [
                    {
                        name: 'robots', content: 'noindex'
                    }
                ]
            }
        },
        created() {
            this.projectService.getCurrentUserAuthorities(
                this.$route.params.id,
                (authorities) => {		
                    if(authorities.includes("SHOW_PROJECT")) {
                        this.projectService.findById(
                            this.$route.params.id,
                            (project) => {
                                this.project = project;
                                this.getMailSubscription();
                            },
                            (error) => {
                                console.log(error);
                            }
                        )
                    } else {
                        this.$router.replace('/forbidden');
                    }
                },
                (error) => {
                    console.log(error);
                }
            )
        },
        methods:{
            getMailSubscription() {
                this.projectService.getCurrentUserMailSubscription(
                    this.project.id,
                    (resp) => this.alreadyUnsubscribed = resp,
                    (error) => console.error(error)
                )
            },
		    unsubscribe() {
                const info = document.getElementById("unsubscribe-info");
                const msg = document.createElement("p");

                if(info.firstElementChild) info.firstElementChild.remove();

                this.projectService.setCurrentUserMailSubscription(
                    this.project.id,
                    false,
                    (resp) => {
                        info.className = "info-success";
                        msg.textContent = this.$i18n.t('unsubscribe.success');
                        info.appendChild(msg);

                        this.unsubscribed = true;
                    },
                    (error) => {
                        info.className = "info-error";
                        msg.textContent = this.$i18n.t('unsubscribe.error');
                        info.appendChild(msg);

                        this.unsubscribed = false;
                        console.error(error);
                    }
			    )
            }
        }
    }
</script>

<style lang="scss" scoped>
    .project-actions-list {
        margin: 3.2rem 0 0;
        padding: 0;
        list-style: none;

        @media #{$media-xs-viewport} {
            display: flex;
            align-items: center;
        }

        .project-actions-list__item {
            &:not(:last-child) {
                margin-bottom: 1.6rem;

                @media #{$media-xs-viewport} {
                    margin-right: 1.6rem;
                    margin-bottom: 0;
                }
            }
        }
    }
</style>