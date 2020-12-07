<template>
<!-- Src: https://medium.com/@pppped/how-to-code-a-responsive-circular-percentage-chart-with-svg-and-css-3632f8cd7705 -->
	<div class="circular-chart-wrapper">
		<svg aria-hidden="true" preserveAspectRatio="xMinYMin meet" class="circular-chart" viewBox="0 0 36 36">
			<defs>
				<filter :id="shadowOne">
					<feDropShadow dx="0" dy="0" stdDeviation="0.2" flood-color="rgba(15, 130, 70, 0.1)" />
				</filter>
				<filter :id="shadowTwo">
					<feDropShadow dx="0" dy="0" stdDeviation="0.2" flood-color="rgba(5, 90, 127, 0.1)" />
				</filter>
				<linearGradient class="circular-chart__gradient" :id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" v-bind:class="colorClassPrimary" />
					<stop offset="100%" v-bind:class="colorClassSecondary" />
				</linearGradient>
			</defs>
			<path
				d="M18 2.0845
				a 15.9155 15.9155 0 0 1 0 31.831
				a 15.9155 15.9155 0 0 1 0 -31.831"
				fill="none"
				:stroke="`url(#${gradient})`"
				stroke-width="1"
				:stroke-dasharray="`${percentage}, 100`"
				stroke-linecap="round"
				class="circular-chart__circle"
			/>
			<path
				d="M18 5.4268
				a 12.5732 12.5732 0 0 1 0 25.1464
				a 12.5732 12.5732 0 0 1 0 -25.1464"
				fill="rgba(15, 130, 70, .03)"
				class=""
			/>
			<path
				d="M18 8.4507
				a 9.5493 9.5493 0 0 1 0 19.0986
				a 9.5493 9.5493 0 0 1 0 -19.0986"
				fill="#FFFFFF"
				:filter="`url(#${shadowOne})`"
				class=""
			/>
			<circle
				class="circular-chart__pointer"
				v-bind:class="colorClassSecondary"
				cx="100%"
				cy="50%"
				r="1.5"
				stroke-width="0.75"
				stroke="#FFFFFF"
				:filter="`url(#${shadowTwo})`"
				:style="`transform:rotate(${getPropsNameCalcul}deg) translate(-2px, 0)`"
			/>
			<text x="18" y="20.35" class="percentage" v-bind:class="colorClassSecondary">{{percentage}}<tspan>%</tspan></text>
		</svg>
		<p class="screen-reader-text">{{$t('chart.progress.helpText', {percentage: percentage})}}</p>
	</div>
</template>

<script>
export default {
	props: {
		percentage: {
			type: Number,
			required: true,
		},
		shadowOne: {
            type: String,
            required: true,
        },
        shadowTwo: {
            type: String,
            required: true,
        },
        gradient: {
            type: String,
            required: true,
        }
	},
	computed: {
      getPropsNameCalcul() {
        return (360 * this.percentage / 100) - 90
      },

	  colorClassPrimary(){
		  	let colorClassPrimary = '';
			if(this.percentage < 50){
				colorClassPrimary = 'alert-primary-graph'
			}
			else if (this.percentage >= 50 && this.percentage < 80){
				colorClassPrimary = 'warning-primary-graph'
			}
			else {
				colorClassPrimary = 'good-primary-graph'
			}

			return colorClassPrimary
	  },
	  colorClassSecondary(){
		  	let colorClassSecondary = '';
			if(this.percentage < 50){
				colorClassSecondary = 'alert-secondary-graph'
			}
			else if (this.percentage >= 50 && this.percentage < 80){
				colorClassSecondary = 'warning-secondary-graph'
			}
			else {
				colorClassSecondary = 'good-secondary-graph'
			}

			return colorClassSecondary
	  }
    },
}
</script>

<style lang="scss">
// Global variables
$color-alert-primary: #ff9faa;
$color-alert-secondary: #d20019;
$color-warning-primary: #ffd199;
$color-warning-secondary: #e67e00;
$color-good-primary: #E0F1E9;
$color-good-secondary: #2E9D63;

.circular-chart-wrapper {
	display: inline-block;
	position: relative;
	width: 100%;
	padding-bottom: 100%;
	vertical-align: middle;
	overflow: hidden;

}

.circular-chart {
	display: inline-block;
	position: absolute;
	top: 0;
	left: 0;
	font-size: 1em;

	.circular-chart__gradient {
		.alert-primary-graph {
			stop-color: $color-alert-primary;
		}

		.alert-secondary-graph {
			stop-color: $color-alert-secondary;
		}

		.warning-primary-graph {
			stop-color: $color-warning-primary;
		}

		.warning-secondary-graph {
			stop-color: $color-warning-secondary;
		}

		.good-primary-graph {
			stop-color: $color-good-primary;
		}

		.good-secondary-graph {
			stop-color: $color-good-secondary;
		}
	}

	.circular-chart__circle {
		animation: progress-bar 1s ease-out forwards;
	}

	.circular-chart__pointer {
		transition: all .3s ease;
		transform-origin: 50% 50%;
		animation: progress-pointer 1s ease-out;

		&.alert-secondary-graph {
			fill: $color-alert-secondary;
		}

		&.warning-secondary-graph {
			fill: $color-warning-secondary;
		}

		&.good-secondary-graph {
			fill: $color-good-secondary;
		}
	}
}

@keyframes progress-bar {
  0% {
    stroke-dasharray: 0 100;
  }
}

@keyframes progress-pointer {
  0% {
    transform: rotate(-90deg) translate(-2px, 0);
  }
}

.percentage {
	font-family: $font-stack-secondary;
	font-size: .5em;
	font-weight: 600;
	text-anchor: middle;

	&.alert-secondary-graph {
		fill: $color-alert-secondary;
	}

	&.warning-secondary-graph {
		fill: $color-warning-secondary;
	}

	&.good-secondary-graph {
		fill: $color-good-secondary;
	}

	tspan {
		font-size: .5em;
	}
}
</style>
