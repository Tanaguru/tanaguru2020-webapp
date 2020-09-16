<template>
    <div>
        <div>
            <div class="layout-content" v-for='(breakpoint, i) in breakpoints' :key="i">
                <div class="layout-content__aside">
                    <input-validation-display :value="isBreakPointValid(breakpoint)"/>
                </div>

                <div class="layout-content__main">
                    <div role="group"
                         :aria-labelledby="`breakpoint-${i}`"
                         class="custom-fieldset">
                        <p class="custom-fieldset__legend" :id="`breakpoint-${i}`" v-if='i === 0'>
                            {{$t('audit.resolution.default')}}
                            <span v-if="i === 0 && breakpoint !== '' " class="screen-reader-text">{{$t('audit.form.help.checked')}}</span>
                            <span v-else class="screen-reader-text">{{$t('audit.form.help.empty')}}</span>
                        </p>

						<p class="custom-fieldset__legend" :id='`breakpoint-${i}`' v-else>
                            {{$t('audit.resolution.breakpoint')}} {{i}}
							<span v-if="breakpoint !== '' " class="screen-reader-text">{{$t('audit.form.help.checked')}}</span>
                            <span v-else class="screen-reader-text">{{$t('audit.form.help.empty')}}</span>

						</p>
                        <div class="custom-fieldset__content">
							<label class="label" :for="`breakpoint-length-${i}`">{{$t('audit.resolution.label')}} *</label>

							<input
                                class="input"
                                v-bind:class="{'has-error': hasEmptyErrorRule(breakpoint, i) || hasValidErrorRule(breakpoint) }"
                                type="number"
                                name="breakpoint-length"
                                :id="`breakpoint-length-${i}`"
                                :required="i === 0"
                                :value="breakpoint"
                                @input="onChangeBreakpoint(i, $event.target.value)"
                                :aria-describedby="describedBy(breakpoint, i)"
							/>

							<p class="info-text" :id='`precision-length-${i}`'>{{$t('audit.resolution.labelHelp')}}</p>

                             <p v-if="hasBeenSent && !isBreakPointEmpty(breakpoint)" class="info-error" :id='`empty-error-${i}`'>
								<icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
									<icon-alert/>
								</icon-base-decorative>
								<span>{{ $t('form.emptyInput') }}</span>
							</p>
							<p v-else-if="hasBeenSent && !isBreakPointValid(breakpoint)" class="info-error" :id='`valid-error-${i}`'>
								<icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
									<icon-alert/>
								</icon-base-decorative>
								<span>{{ $t('audit.form.error.bpError') }}</span>
							</p>

							<button class="btn btn--icon btn--clipboard btn-delete" type="button" v-if="i != 0" @click="removeBreakpoint(i)">
								<icon-base-decorative width="18" height="18">
									<icon-delete />
								</icon-base-decorative>
								<span>{{ $t('action.delete') }}
									<span v-if='i === 0' class="screen-reader-text">{{$t('audit.resolution.default')}}</span>
									<span v-else class="screen-reader-text">{{$t('audit.resolution.breakpoint')}} {{i}}</span>
								</span>
							</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="aside-breakpoints">
            <button type="button" class="btn btn--default btn--icon" @click='addBreakpoint'>
                <icon-base-decorative>
                    <icon-plus/>
                </icon-base-decorative>
                <span>{{$t('audit.resolution.button')}}</span>
            </button>
        </div>
    </div>

</template>

<script>
    import IconBaseDecorative from '../../components/icons/IconBaseDecorative';
    import IconAlert from '../../components/icons/IconAlert';
    import IconDelete from '../../components/icons/IconDelete';
    import IconPlus from '../../components/icons/IconPlus';
    import InputValidationDisplay from "./InputValidationDisplay";

    import BreakpointHelper from "../../helper/breakpointHelper";

    export default {
        name: 'auditBreakpointsForm',
        components: {
            InputValidationDisplay,
            IconBaseDecorative,
            IconAlert,
            IconPlus,
            IconDelete
        },
        props: ['value', 'isValid', 'hasBeenSent'],
        data() {
            return {
                breakpoints: this.value
            }
        },
        methods: {
            isBreakPointValid:BreakpointHelper.isBreakpointValid,
            isBreakPointEmpty:BreakpointHelper.isBreakpointEmpty,

            addBreakpoint() {
                this.breakpoints.push('');
                this.$emit('input', this.breakpoints);
            },

            removeBreakpoint(index) {
                this.breakpoints.splice(index, 1);
                this.$emit('input', this.breakpoints);
            },

            onChangeBreakpoint(index, value){
                this.$set(this.breakpoints, index, value);
                this.$emit('input', this.breakpoints);
            },
            fullName: function (user) {
                return user.first_name + ' ' + user.last_name;
            },
            hasValidErrorRule(breakpoint){
                let rule = false;
                if(this.hasBeenSent && !this.isBreakPointValid(breakpoint)) {
                    rule = true
                }
                return rule;
            },
            hasEmptyErrorRule(breakpoint, i){
                let rule = false;
                if(this.hasBeenSent && !this.isBreakPointEmpty(breakpoint)) {
                    rule = true
                }
                return rule;
            },
            describedBy(breakpoint, i){
                let describedBy = 'precision-length-' + i
                if(this.hasValidErrorRule){
                    describedBy = "precision-length-" + i + " valid-error-" + i
                }
                else if(this.hasEmptyErrorRule){
                    describedBy = "precision-length-" + i + "empty-error-" + i
                }
                return describedBy
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "src/views/AuditLaunch/AuditLaunch.style";
    @include custom-fieldset(16.666%, 76.666%);
</style>
