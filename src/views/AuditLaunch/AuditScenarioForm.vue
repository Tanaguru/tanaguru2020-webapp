<template>
    <div class="layout-content">
        <div class="layout-content__aside">
            <input-validation-display :value="isValid"/>
        </div>

        <div class="layout-content__main">
            <div class="layout-content-heading">
                <h3 class="layout-content-heading__subtitle layout-subtitle">
                    {{$t('audit.scenario.subtitle')}} (.side)
                    <span v-if="isValid"
                          class="screen-reader-text">{{$t('audit.form.help.checked')}}</span>
                    <span v-else class="screen-reader-text">{{$t('audit.form.help.empty')}}</span>
                </h3>
            </div>

            <form id="create-scenario">
                <div class="form-block">
                    <label class="label" for="scenarioName">
                        {{$t('audit.scenario.name')}} :
                    </label>
                    <input 
                        class="input"
                        type="text"
                        name="scenarioName"
                        id="scenarioName"
                        v-model="createScenarioForm.name"
                        required/>
                </div>
                <div class="form-block">
                    <file-upload
                        :label="$t('audit.scenario.file') + ' :'"
                        @load="onAddScenario"
                        :required="true"
                        format=".side"/>
                </div>

                <button class="btn btn--default btn--icon"
                        type="button"
                        @click="createScenario">
                    <icon-base-decorative>
                        <icon-plus/>
                    </icon-base-decorative>
                    <span>{{$t('action.add')}}</span>
                </button>
                <p v-if="createScenarioForm.errorMsg" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    {{createScenarioForm.errorMsg}}
                </p>
                <p v-else-if="createScenarioForm.successMsg" class="info-success">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-valid/>
                    </icon-base-decorative>
                    {{createScenarioForm.successMsg}}
                </p>
            </form>

            <div class="table-container" v-if="scenarios.length > 0">
                <table class="table table--default table-files">
                    <thead>
                    <tr>
                        <th scope="col">Use</th>
                        <th scope="col">{{$t('audit.scenario.name')}}</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="scenario of scenarios" :key="scenario.id">
                        <td>
                            <div class="radio">
                                <input class="radio__input" type="radio" name="select-scenario"
                                       :id="'select-scenario' + scenario.id"
                                       v-model="scenarioId"
                                       :value="scenario.id"
                                       @change="$emit('input', scenarioId)"
                                />
                                <label class="radio__label" :for="'select-scenario' + scenario.id">
                                </label>
                            </div>
                        </td>
                        <td>{{scenario.name}}</td>
                        <td>
                            <button
                                    @click="deleteScenario(scenario)"
                                    class="btn btn--nude btn--icon"
                                    type="button">
                                <icon-base-decorative>
                                    <icon-delete/>
                                </icon-base-decorative>
                                <span>{{$t('action.delete')}}</span>
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <p v-if="!isValid && hasBeenSent" class="info-error">
                <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                    <icon-alert/>
                </icon-base-decorative>
                <span>{{$t('audit.form.error.emptyScenarioId')}}</span>
            </p>
        </div>
    </div>
</template>

<script>

    import InputValidationDisplay from "./InputValidationDisplay";
    import IconBaseDecorative from "../../components/icons/IconBaseDecorative";
    import IconAlert from "../../components/icons/IconAlert";
    import IconPlus from "../../components/icons/IconPlus";
    import IconDelete from "../../components/icons/IconDelete";
    import IconValid from "../../components/icons/IconValid";
    import FileUpload from "../../components/FileUpload";

    export default {
        name: 'auditScenarioForm',
        components: {
            FileUpload,
            InputValidationDisplay,
            IconBaseDecorative,
            IconAlert,
            IconPlus,
            IconValid,
            IconDelete
        },
        props: ['value', 'isValid', 'projectId', 'hasBeenSent'],
        data() {
            return {
                scenarios: [],
                scenarioId: this.value,
                createScenarioForm:{
                    name: '',
                    content: '',

                    errorMsg: '',
                    successMsg: ''
                }
            }
        },
        created() {
            this.scenarioService.findByProjectId(
                this.$route.params.id,
                (scenarios) => this.scenarios = scenarios,
                (error) => {
                    console.error(error)
                }
            );
        },
        methods:{
            onAddScenario(content) {
                this.createScenarioForm.content = '';
                this.createScenarioForm.content = content;
            },

            createScenario() {
                if(!this.isNameValid){
                    this.createScenarioForm.errorMsg = this.$t("audit.form.error.fileNameError");
                    return;
                }

                if(!this.isContentValid){
                    this.createScenarioForm.errorMsg = this.$t("audit.form.error.scenarioError");
                    return;
                }

                this.scenarioService.create(
                    this.createScenarioForm.name,
                    this.projectId,
                    btoa(unescape(encodeURIComponent(this.createScenarioForm.content))),
                    (scenario) => {
                        this.createScenarioForm.name = '';
                        this.createScenarioForm.successMsg = this.$t("audit.form.error.scenarioSuccess");
                        this.scenarios.push(scenario)
                    },
                    (error) => this.createScenarioForm.errorMsg = this.$t("audit.form.error.scenarioError")
                )
            },

            deleteScenario(scenario) {
                this.scenarioService.delete(
                    scenario.id,
                    () => {
                        let index = this.scenarios.indexOf(scenario);
                        if(index !== -1){
                            this.scenarios.splice(index, 1);
                        }
                    },
                    (error) => console.error(error)
                )
            },
        },
        computed:{
            isNameValid(){
                return !! this.createScenarioForm.name;
            },

            isContentValid(){
                return !!this.createScenarioForm.content;
            },
        }
    }

</script>

<style lang="scss" scoped>
    @import "AuditLaunch.style";

</style>
