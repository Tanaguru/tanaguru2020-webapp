<template>
    <div>
        <button 
            v-if="$store.state.auth.user.appAccountType.name === 'FREE'" 
            aria-expanded="showTrialTooltip" 
            :aria-controls="spot + '-tooltip'" 
            @click="toggleTooltip()"
            @keydown="buttonKeydownHandler($event)"
            class="overview-tests__icon btn btn--nude"
        >
            <icon-base-decorative><icon-inforound /></icon-base-decorative>
            <span class="screen-reader-text">{{$t('global.trialBloc')}}</span>
        </button>
        <div
            :id="spot +'-tooltip'"
            class="tooltip__info"
            role="tooltip"
            v-show="showTrialTooltip"
            @keydown="tooltipKeydownHandler($event)"
            tabindex="0"
        >
            <p>
                {{$t('global.trialTooltipMsg')}}
            </p>
        </div>
    </div>
</template>

<script>
    import IconBaseDecorative from "../components/icons/IconBaseDecorative";
    import IconInforound from "../components/icons/IconInforound";

	export default {
        name: 'TrialTooltip',
        components: {
            IconBaseDecorative,
            IconInforound
        },
        data() {
            return {
                showTrialTooltip: false
            }
        },
        props: ['spot'],
        methods: {
            toggleTooltip(){
                this.showTrialTooltip = !this.showTrialTooltip
            },

            buttonKeydownHandler(e){
                if(e.keyCode == 27){
                    this.showTrialTooltip = false
                }
                else if (e.keyCode == 9 && e.shiftKey) {
                    this.showTrialTooltip = false
                }
            },

            tooltipKeydownHandler(e){
                if(e.keyCode == 27){
                    this.showTrialTooltip = false
                }
                else if (e.keyCode == 9) {
                    this.showTrialTooltip = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
	.tooltip__info {
		position: absolute;
		width: $width;
		padding: 1rem;
		color: $text-secondary;
		background-color: white;
		font-size: $small-font-size;
		box-shadow: 0 2px 8px 0 $color-shadow;
        text-align: center;
        z-index: 10;
	}
</style>
