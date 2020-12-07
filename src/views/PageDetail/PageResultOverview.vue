<template>
    <section class="audit-overview">
        <header class="audit-overview__header">
            <h2 class="audit-overview__title">{{$t('resultAudit.overview.title')}}</h2>
            <!--
            <ul class="actions-list">
                <li class="actions-list__item">
                    <button class='btn btn--icon btn--nude' aria-controls='parameter-box' :aria-expanded="showStatisticsParameter ? 'true' : 'false'" @click="showStatisticsParameter = !showStatisticsParameter" >
                        <icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
                        <span>{{$t('resultAudit.overview.parameters')}}</span>
                    </button>
                </li>
            </ul>
            -->
        </header>

        <div class="audit-overview__content overview-content">
            <div class="overview-content__tests overview-tests">
                <PolarChart
						class="overview-tests__chart"
                        :nb-cant-tell="nbCantTell"
                        :nb-failed="nbFailed"
                        :nb-inapplicable="nbInapplicable"
                        :nb-untested="nbUntested"
                        :nb-passed="nbPassed"/>
                <div class="overview-tests__header">
                    <h3 class="overview-tests__title">{{$t('resultAudit.overview.tests.title')}}</h3>
                    <div class="overview-tests__icon tooltip">
                        <button
						class="overview-tests__icon btn btn--nude"
						aria-controls="number-of-test"
						:aria-expanded="showNbTestTooltip ? 'true' : 'false'"
						@click="showNbTestTooltip = !showNbTestTooltip"
                        >
                            <icon-base-decorative><icon-inforound /></icon-base-decorative>
                            <span class="screen-reader-text">{{$t('resultAudit.overview.tests.tooltipHelp')}}</span>
                        </button>
                        <div
                        id="number-of-test"
						class="tooltip__info"
						role="tooltip"
						v-show="showNbTestTooltip">
							<span class="tooltip__header">
								<icon-base-decorative><icon-inforound /></icon-base-decorative>
								<span class="tooltip__title">{{$t('resultAudit.overview.tests.tooltipTitle')}}</span>
							</span>
                            {{$t('resultAudit.overview.tests.tooltipContent')}}
                        </div>
                    </div>
                </div>

				<table class="table table--tests">
					<caption class="screen-reader-text">{{$t('resultAudit.overview.tests.table.caption')}}</caption>
					<thead>
						<tr class="heading-hidden">
							<th scope="col"><span>{{$t('resultAudit.overview.tests.table.columnTest')}}</span></th>
							<th scope="col"><span>{{$t('resultAudit.overview.tests.table.columnResult')}}</span></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="td-title td-test"><icon-base-decorative>
								<icon-improper /></icon-base-decorative>
								<span>{{ $t("entity.audit.result.failed") }}</span>
							</td>
							<td class="td-right">{{nbFailed}}</td>
						</tr>
						<tr>
							<td class="td-title td-test">
								<icon-base-decorative><icon-qualify /></icon-base-decorative>
								<span>{{ $t("entity.audit.result.cantTell") }}</span>
							</td>
							<td class="td-right">{{nbCantTell}}</td>
						</tr>
						<tr>
							<td class="td-title td-test">
								<icon-base-decorative><icon-untested /></icon-base-decorative>
								<span>{{ $t("entity.audit.result.untested") }}</span>
							</td>
							<td class="td-right">{{nbUntested}}</td>
						</tr>
						<tr>
							<td class="td-title td-test">
								<icon-base-decorative><icon-compliant /></icon-base-decorative>
								<span>{{ $t("entity.audit.result.passed") }}</span>
							</td>
							<td class="td-right">{{nbPassed}}</td>
						</tr>
						<tr>
							<td class="td-title td-test">
								<icon-base-decorative><icon-not-applicable /></icon-base-decorative>
								<span>{{ $t("entity.audit.result.inapplicable") }}</span>
							</td>
							<td class="td-right">{{nbInapplicable}}</td>
						</tr>
					</tbody>
				</table>
            </div>
            <div class="overview-content__themes overview-themes">
                <BarChart class="overview-themes__chart" :labels="anomalyPerThemeLabels" :data="anomalyPerThemeData"/>
                <div class="overview-themes__header">
                    <h3 class="overview-themes__title">{{$t('resultAudit.overview.anomalies.title')}}</h3>
                    <!--
                    <div class="overview-themes__icon tooltip">
                        <button
                                class="overview-themes__icon btn btn--nude"
                                aria-controls= "tooltip-2"
                                :aria-expanded="showNbAnomalyByThemeTooltip ? 'true' : 'false'"
                                @click="showNbAnomalyByThemeTooltip = !showNbAnomalyByThemeTooltip"
                        >
                            <icon-base-decorative><icon-inforound /></icon-base-decorative>
                            <span class="screen-reader-text">{{$t('resultAudit.overview.anomalies.tooltipHelp')}}</span>
                        </button>
                        <div
							class="tooltip__info"
							role="tooltip"
							v-show="showNbAnomalyByThemeTooltip">
								<span class="tooltip__header">
									<icon-base-decorative><icon-inforound /></icon-base-decorative>
									<span class="tooltip__title">{{$t('resultAudit.overview.anomalies.tooltipTitle')}}</span>
								</span>
                            {{$t('resultAudit.overview.anomalies.tooltipContent')}}
                        </div>
                    </div>
                    -->
                </div>

                <table class="table table--tests">
					<caption class="screen-reader-text">{{$t('resultAudit.overview.tests.table.caption')}}</caption>
					<thead>
						<tr class="heading-hidden">
							<th scope="col"><span>{{$t('resultAudit.overview.tests.table.columnTest')}}</span></th>
							<th scope="col"><span>{{$t('resultAudit.overview.tests.table.columnResult')}}</span></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(label, i) in anomalyPerThemeLabels" :key="label" class="themes-list__item">
							<td class="td-title td-test">
								 {{ label }}
							</td>
							<td class="td-right">{{anomalyPerThemeData[i]}}</td>
						</tr>
					</tbody>
				</table>
            </div>
        </div>
    </section>
</template>

<script>
    import BarChart from "../../components/charts/BarChart";
    import PolarChart from "../../components/charts/PolarChart";
    import IconBaseDecorative from "../../components/icons/IconBaseDecorative";
    import IconBaseInformative from "../../components/icons/IconBaseInformative";
    import IconArrowBlue from "../../components/icons/IconArrowBlue";
    import IconPin from "../../components/icons/IconPin";
    import IconIgnored from "../../components/icons/IconIgnored";
    import IconImproper from "../../components/icons/IconImproper";
    import IconNotApplicable from "../../components/icons/IconNotApplicable";
    import IconQualify from "../../components/icons/IconQualify";
    import IconUntested from "../../components/icons/IconUntested";
    import IconCompliant from "../../components/icons/IconCompliant";
    import IconInforound from "../../components/icons/IconInforound";

    export default {
        name: 'pageResultOverview',
        props: ['nbFailed', 'nbPassed', 'nbInapplicable', 'nbCantTell', 'nbUntested', 'anomalyPerThemeLabels', 'anomalyPerThemeData'],
        components: {
            IconPin,
            IconIgnored,
            IconImproper,
            IconNotApplicable,
            IconQualify,
            IconUntested,
            IconCompliant,
            IconInforound,
            IconBaseDecorative,
            IconBaseInformative,
            IconArrowBlue,
            BarChart,
            PolarChart,
        },
        data(){
            return {
                showStatisticsParameter: true,
                showNbTestTooltip: false,
                showNbAnomalyByThemeTooltip: false
            }
        },
        created(){
        }
	}
</script>

<style lang="scss" scoped>
/* Overview section */
.audit-overview {
	margin: 3rem 0;

	@media #{$media-md-viewport} {
		margin: 6.3rem 0;
	}

	.audit-overview__header {
		display: none;

		@media #{$media-sm-viewport} {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.audit-overview__title {
		margin: 0;
	}
}

.overview-content {
	@media #{$media-md-viewport} {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.overview-content__tests {
		margin: 2rem 0;

		@media #{$media-md-viewport} {
			flex: 0 1 30%;
			overflow: hidden;
		}
	}

	.overview-content__themes {
		margin: 2rem 0;

		@media #{$media-md-viewport} {
			flex: 0 1 57%;
			overflow: hidden;
		}
	}
}

.overview-themes {
	.overview-themes__title,
	.overview-themes__icon {
		display: inline;
		vertical-align: middle;
	}

	.overview-themes__icon {
		margin-left: .8rem;

		svg {
			vertical-align: middle;
		}
	}

	.overview-themes__title {
		margin: 0;
	}

	.overview-themes__chart {
		position: relative;
		height: 34rem;
		margin-bottom: 1.5rem;
	}
}

.overview-tests {
	.overview-tests__header {
		position: relative;

		.tooltip {
			top: 4rem;
			left: 0;
		}
	}

	.overview-tests__title,
	.overview-tests__icon {
		display: inline;
		vertical-align: middle;
	}

	.overview-tests__icon {
		margin-left: .8rem;

		svg {
			vertical-align: middle;
		}
	}

	.overview-tests__title {
		margin: 0;
	}

	.overview-tests__chart {
		position: relative;
		height: 34rem;
		margin-bottom: 1.5rem;
	}
}

.themes-list {
	margin: 0;
	padding: 0;
	list-style-type: none;
	counter-reset: custom-counter;

	@media #{$media-xs-viewport} {
		display: grid;
		grid-template-columns: 47% 53%;
		grid-template-areas:
				"item1 item8"
				"item2 item9"
				"item3 item10"
				"item4 item11"
				"item5 item12"
				"item6 item13"
				"item7 .";
	}

	@media #{$media-lg-viewport} {
		grid-template-columns: 32% 43% 25%;
		grid-template-areas:
				"item1 item6 item11"
				"item2 item7 item12"
				"item3 item8 item13"
				"item4 item9 ."
				"item5 item10 .";
	}

	.themes-list__item {
		counter-increment: custom-counter;

		&::before {
			content: counter(custom-counter) " - ";
		}

		@media #{$media-xs-viewport} {
			@for $i from 1 to 13 {
				&:nth-child(#{$i}) {
					grid-area: item#{$i};
				}
			}
		}
	}
}

@media print {
	.audit-overview {
		margin-top: 1rem;
	}


	.overview-tests {
		.overview-tests__chart,
		.overview-tests__icon {
			display: none;
		}
	}

	.overview-themes {
		.overview-themes__chart {
			display: none;
		}
	}
}
</style>
