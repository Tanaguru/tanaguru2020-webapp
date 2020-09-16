<template>
    <header class="audit-header">
		<div class="audit-headline headline">
			<span class="audit-headline__id">{{ $t('entity.audit.id') }}{{audit.id}}</span>
			<h1 class="audit-headline__title">{{ audit.name }}</h1>
			<ul class="actions-list">
				<!-- AUDIT ACTIONS -- TODO -- 
				<li class="actions-list__item">
					<button class="btn btn--icon btn--nude">
						<icon-base-decorative width="16" height="16" viewBox="0 0 16 16"><icon-export /></icon-base-decorative>
						<span>{{$t('resultAudit.actions.export')}}</span>
					</button>
				</li>
				<li class="actions-list__item tooltip">
					<button
						class="btn btn--icon btn--nude"
						aria-controls= "tooltip__info"
						:aria-expanded="showSharecodeTooltip ? 'true' : 'false'"
						@click="showSharecodeTooltip = !showSharecodeTooltip"
					>
						<icon-base-decorative width="16" height="16" viewBox="0 0 16 16"><icon-share /></icon-base-decorative>
						<span>{{$t('resultAudit.actions.share')}}</span>
					</button>
					<div class="tooltip__info" role="tooltip" v-show="showSharecodeTooltip">
						<div class="tooltip-clipboard">
							<input class="input" id="shareCodeUrl" :value="shareCodeUrl">
							<button
								@click.stop.prevent="copyShareCode"
								class="btn btn--clipboard">
								{{ copyButtonText }}
							</button>
						</div>
						<div aria-live="polite" class="screen-reader-text">{{ screenReaderInfo }}</div>
					</div>
				</li>
				<li class="actions-list__item">
					<button class="btn btn--icon btn--nude">
						<icon-base-decorative width="16" height="16" viewBox="0 0 20 20"><icon-launch /></icon-base-decorative>
						<span>{{$t('resultAudit.actions.launch')}}</span>
					</button>
				</li>
				-->
				<li class="actions-list__item">
					<button class="btn btn--icon btn--nude" @click="triggerPrint">
						<icon-base-decorative width="16" height="16" viewBox="0 0 16 16"><icon-print /></icon-base-decorative>
						<span>{{$t('resultAudit.actions.print')}}</span>
					</button>
				</li>
			</ul>
		</div>

		<div class="audit-infos">
			<div class="audit-infos__stats">
				<div class="audit-stats">
					<div class="audit-stats__chart">
						<CircularProgressChart
							:percentage="percentage"
							:shadowOne="'chart-shadow1-' + audit.id"
							:shadowTwo="'chart-shadow2-' + audit.id"
							:gradient="'chart-gradient-' + audit.id" />
					</div>
					<p class="audit-stats__recap audit-stats-recap">
						<span class="audit-stats-recap__number">{{nbAnomaly}}</span>
						<span class="audit-stats-recap__unit">{{$t('entity.generic.anomalies')}}</span>
						<!--<span class="audit-stats-recap__total">{{nbElementTested}} {{$t('resultAudit.elmtTested')}}</span>-->
                    </p>
					<!--<hr role="presentation" class="separator" />
					<p class="audit-stats__history audit-stats-history">
						<span class="audit-stats-history__date">{{$t('resultAudit.date')}} 5 mars 2020 :</span>
						<span class="audit-stats-history__number">-25 {{$t('entity.generic.anomalies')}}</span>
						<span class="audit-stats-history__link">
							<router-link :to="'/audits/' + audit.id + '/pages/' + page.id + '/history'" class="link-independent link-independent--icon">
								<icon-base-decorative width="16" height="16"><icon-arrow-blue /></icon-base-decorative>
								<span>{{$t('action.history')}}</span>
							</router-link>
						</span>
					</p>
					-->
				</div>
			</div>

			<div class="audit-infos__inner">
				<div class="audit-caps" v-if="pageContent.screenshot" :style="`background-image:url(data:image/png;base64,` + pageContent.screenshot + `)`">
				</div>
				<div class="audit-caps" :style="defaultImg" v-else >
				</div>

				<div class="audit-list">
					<ul class="audit-list-infos">
						<li>
							<span>{{ $t('entity.audit.url') }} : </span>
							<a :href="page.url" class="link-simple audit-list-infos__domain">{{page.url}}</a>
						</li>
						<li>
							<span>{{ $t("entity.audit.dateStart") }} : </span>
							{{ moment(audit.dateStart).format('LL') }}
						</li>
						<li>
							<span>{{$t('entity.audit.repository')}} : </span>
							{{reference.name}}
						</li>
						<!--<li>
							<span>Nombre de pages auditées :</span> {{ pages.length}}
						</li>-->
						<!--<li>
							<button class="btn btn--nude btn--icon">
								<span>{{$t('entity.audit.parameters')}}</span>
								<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
							</button>
						</li>-->
					</ul>
					<!--<div class="form-block" v-if="otherPages.length > 1">
						<label class="label" for="page-select">Voir la liste :</label>
						<div class="select">
							<select name="page-select" id="page-select" v-model="selectedPage">
								<option value="">Sélectionner une page</option>
								<option v-for="page in otherPages" :value="page.id" :key="page.id">{{page.rank}} - {{ page.name.split("_")[0] }}</option>
							</select>
						</div>
						<router-link class="btn btn--nude btn--icon" v-if="selectedPage != page.id" :to="'/audits/' + audit.id + '/pages/' + selectedPage">
							<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
							<span>Afficher l'audit</span>
						</router-link>
					</div>-->
                    <router-link class="btn btn--nude btn--icon" :to="'/audits/' + audit.id">
                        <icon-base-decorative>
                            <icon-arrow-blue/>
                        </icon-base-decorative>
                        <span>{{ $t('action.backToPageList') }}</span>
                    </router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
	import { bus } from '../../main'
    import IconBaseDecorative from "../../components/icons/IconBaseDecorative";
    import IconArrowBlue from "../../components/icons/IconArrowBlue";
    import IconExport from "../../components/icons/IconExport";
    import IconShare from "../../components/icons/IconShare";
    import IconPrint from "../../components/icons/IconPrint";
    import IconLaunch from "../../components/icons/IconLaunch";
    import CircularProgressChart from "../../components/CircularProgressChart";
	import moment from 'moment';
	import backgroundImg from '../../../public/assets/images/logo-desktop.svg';
    export default {
        name: 'PageResultInfo',
        components: {
            IconBaseDecorative,
            IconArrowBlue,
            IconExport,
            IconShare,
            IconPrint,
            IconLaunch,
			CircularProgressChart,
			backgroundImg
        },
        data(){
            return {
                showSharecodeTooltip: false,
                copyButtonText: this.$i18n.t("resultAudit.copyLink.copy"),
				screenReaderInfo: '',
				selectedPage: '',
				value: "Select a page",
				defaultImg: { backgroundImage: `url(${require('../../../public/assets/images/logo-desktop.svg')})` }
            }
        },
        props: ['audit', 'page', 'pages', 'auditParameters', 'percentage', 'nbAnomaly', 'nbElementTested', 'pageContent', 'reference' ],
        computed: {
            shareCodeUrl(){
                return location.origin + '/#/audits/' + this.audit.id + '/pages/' + this.page.id + '/' + this.audit.shareCode
			},
			/*otherPages(){
				let otherPages = this.pages.filter(page =>
					page.id != this.page.id
				)
				return auditPages;
				return otherPages
			}
        },*/
        copyShareCode() {
            let shareCodeUrl = document.querySelector('#shareCodeUrl')
            shareCodeUrl.setAttribute('type', 'text')
            shareCodeUrl.select()
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                this.copyButtonText = this.$i18n.t("resultAudit.copyLink.success")
                this.screenReaderInfo = this.$i18n.t("resultAudit.copyLink.sucessHelp")
                setTimeout(() => (
                    this.showSharecodeTooltip = false
                ), 400)
            } catch (err) {
                this.copyButtonText = this.$i18n.t("resultAudit.copyLink.fail")
                this.screenReaderInfo = this.$i18n.t("resultAudit.copyLink.failHelp")
            }
            /* unselect the range */
            shareCodeUrl.setAttribute('type', 'hidden')
            window.getSelection().removeAllRanges()
        },  
    },
    methods: {
        moment: function (date) {
            this.$moment.locale(this.$i18n.locale)
            return this.$moment(date);
        },

        triggerPrint() {
            bus.$emit("allShown", true);
            setTimeout(() => (
                window.print()
            ), 50)
        }
    },
    
}

</script>

<style lang="scss" scoped>
/* Header */
.audit-header {
    position: relative; // to position the stats block
    margin-top: 3.2rem;
    @media #{$media-md-viewport} {
        margin-top: 4.6rem;
        padding-bottom: 6.4rem;
    }

    .separator {
        max-width: 22rem;
        @media #{$media-md-viewport} {
            max-width: none;
        }
    }
}

// Headline
.audit-headline {
    .audit-headline__id {
        color: $text-secondary;
        font-family: $font-stack-secondary;
        font-size: $small-font-size;
    }

    .audit-headline__title {
        margin: 0;
    }

    .actions-list {
        display: none;
        @media #{$media-md-viewport} {
            display: flex;
        }
    }
}

// Audit infos : caps, list and stats
.audit-infos {
    margin: 3.2rem 0;
    @media #{$media-lg-viewport} {
        margin: 5.4rem 32rem 0 0;
    }

    .audit-infos__stats {
        @media #{$media-lg-viewport} {
            position: absolute;
            top: 0;
            right: 0;
            width: 28.8rem;
        }
    }

    .audit-infos__inner {
        margin: 2.6rem 0;
        @media #{$media-lg-viewport} {
            margin: 0;
            display: flex;
            justify-content: space-between;
        }
    }
}

// Caps audit
.audit-caps {
    margin-bottom: 3.2rem;
    min-height: 23rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    box-shadow: 0 2px 6px 0 rgba(5, 90, 127, .1);
    @media #{$media-lg-viewport} {
        flex: 0 0 47%;
        margin-bottom: 0;
    }
}

// List infos audit
.audit-list {
    @media #{$media-lg-viewport} {
        flex: 0 0 47%;
    }

    .form-block {
        margin-top: 1.6rem;
    }

    .label {
        font-family: $font-stack-secondary;
        font-size: $small-font-size;
        @media #{$media-md-viewport} {
            font-size: $medium-font-size;
        }
    }
}

.audit-list-infos {
    margin: 0;
    padding: 0;
    font-size: $small-font-size;
    list-style-type: none;
    @media #{$media-md-viewport} {
        font-size: $medium-font-size;
    }

    span {
        color: $text-secondary;
        font-family: $font-stack-secondary;
        font-weight: bold;
    }

    &.audit-list-infos--sublist {
        margin-left: 1.6rem;
    }
}

// Stats audit
.audit-stats {
    position: relative;
    margin-top: calc(13.2rem / 2); // 13.2rem is CircularProgressChart height
    box-shadow: 0 2px 16px 0 rgba(5, 90, 127, .1);
    @media #{$media-md-viewport} {
        margin-top: calc(21.7rem / 2); // 21.7rem is CircularProgressChart height
    }

    .audit-stats__chart {
        position: absolute;
        top: 1.2rem;
        left: 50%;
        width: 13.2rem;
        height: 13.2rem;
        transform: translate(-50%, -50%);
        @media #{$media-md-viewport} {
            top: 0;
            width: 21.7rem;
            height: 21.7rem;
        }
    }

    .audit-stats__recap {
        margin: 0;
    }

    .audit-stats__history {
        margin: 0;
    }
}

.audit-stats-recap {
    padding: calc(13.2rem / 2 + 3.2rem) 0 1.2rem; // 13.2rem is CircularProgressChart height
    font-family: $font-stack-secondary;
    text-align: center;
    @media #{$media-md-viewport} {
        padding: calc(21.7rem / 2 + 3.2rem) 0 2rem; // 21.7rem is CircularProgressChart height
    }

    .audit-stats-recap__number,
    .audit-stats-recap__unit,
    .audit-stats-recap__total {
        display: block;
    }

    .audit-stats-recap__number {
        font-size: 3rem;
        font-weight: 600;
        line-height: 1;
        @media #{$media-md-viewport} {
            font-size: 4rem;
        }
    }

    .audit-stats-recap__unit {
        font-size: 1.8rem;
        @media #{$media-md-viewport} {
            font-size: 2.4rem;
        }
    }
}

.audit-stats-history {
    padding: 1.2rem 0;
    font-family: $font-stack-secondary;
    text-align: center;
    @media #{$media-md-viewport} {
        padding: 2rem 0;
    }

    .audit-stats-history__date,
    .audit-stats-history__number,
    .audit-stats-history__link {
        display: block;
    }

    .audit-stats-history__number {
        color: $color-good;
        font-weight: bold;
    }

    .audit-stats-history__link {
        color: $text-secondary;
        font-weight: bold;
    }
}

@media print {
    .audit-header {
        margin-top: 0;
        padding-bottom: 0;
    }
    .actions-list,
    .audit-infos__caps,
    .form-block {
        display: none;
    }
    .audit-infos {
        margin-top: 0;

        .audit-infos__list {
            flex: 0 1 100%;
        }
    }
    .audit-stats {
        margin-top: calc(15rem / 2);

        .audit-stats__chart {
            width: 15rem;
            height: 15rem;
        }
    }
}
</style>
