<template>
    <div class="layout-content">
        <div class="layout-content__aside">
            <input-validation-display :value="isValid"/>
        </div>

        <div class="layout-content__main">
            <div class="layout-content-heading">
                <h3 class="layout-content-heading__subtitle layout-subtitle">
                    {{$t('audit.resource.subtitle')}} (.html)
                    <span v-if="isValid"
                          class="screen-reader-text">{{$t('audit.form.indications.help.checked')}}</span>
                    <span v-else class="screen-reader-text">{{$t('audit.form.indications.help.empty')}}</span>
                </h3>
            </div>

            <form id="create-resource">
                <div class="form-block">
                    <label class="label"
                           for="resourceName">
                        {{$t('audit.resource.name')}} *
                    </label>
                    <input 
                        class="input"
                        type="text"
                        name="resourceName"
                        id="resourceName"
                        v-model="createResourceForm.name"
                        required
                        :aria-describedby="describedBy"/>
                </div>
                <div class="form-block">
                    <file-upload
                        :label="$t('audit.resource.file') + ' :'"
                        @load="onAddResource"
                        :required="true"
                        format=".html"
                        :aria-describedby="describedBy"/>
                </div>

                <button class="btn btn--default btn--icon"
                        type="button"
                        @click="createResource">
                    <icon-base-decorative>
                        <icon-plus/>
                    </icon-base-decorative>
                    <span>{{$t('action.add')}}</span>
                </button>
                <p v-if="createResourceForm.errorMsg" role="alert" id="name-error" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    {{createResourceForm.errorMsg}}
                </p>
                <p v-else-if="createResourceForm.successMsg" role="alert" id="name-success" class="info-success">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-valid/>
                    </icon-base-decorative>
                    {{createResourceForm.successMsg}}
                </p>
            </form>

            <div class="table-container" v-if="resources.length > 0">
                <table class="table table--default table-files">
                    <thead>
                    <tr>
                        <th scope="cowl">{{$t('audit.scenario.use')}}</th>
                        <th scope="col">{{$t('audit.resource.name')}}</th>
                        <th scope="col">{{$t('audit.scenario.action')}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="resource of resources" :key="resource.id">
                        <td>
                            <div class="radio">
                                <input class="radio__input" type="radio" name="select-resource"
                                       :id="'select-resource' + resource.id"
                                       v-model="resourceId"
                                       :value="resource.id"
                                       @change="$emit('input', resourceId)"
                                />
                                <label class="radio__label" :for="'select-resource' + resource.id">
                                </label>
                            </div>
                        </td>
                        <td>{{resource.name}}</td>
                        <td>
                            <button
                                @click="deleteResource(resource)"
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

            <p v-if="!isValid && hasBeenSent" id="upload-error" class="info-error">
                <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                    <icon-alert/>
                </icon-base-decorative>
                <span>{{$t('audit.form.error.emptyResourceId')}}</span>
            </p>
        </div>
    </div>
</template>

<script>
import InputValidationDisplay from "../InputValidationDisplay";
import IconBaseDecorative from "../../../components/icons/IconBaseDecorative";
import IconAlert from "../../../components/icons/IconAlert";
import IconPlus from "../../../components/icons/IconPlus";
import IconDelete from "../../../components/icons/IconDelete";
import IconValid from "../../../components/icons/IconValid";
import FileUpload from "../../../components/FileUpload";
export default {
    name: 'auditUploadForm',
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
            resources: [],
            resourceId: this.value,
            createResourceForm:{
                name: '',
                content: '',
                errorMsg: '',
                successMsg: ''
            }
        }
    },
    created() {
        this.resourceService.findByProjectId(
            this.projectId,
            (resources) =>
                this.resources = resources,
            (error) => {
                console.error(error)
            }
        );
    },
    methods:{
        onAddResource(content) {
            this.createResourceForm.content = '';
            this.createResourceForm.content = content;
        },
        createResource() {
            if(!this.isNameValid){
                this.createResourceForm.errorMsg = this.$t("audit.form.error.fileNameError");
                return;
            }
            if(!this.isContentValid){
                this.createResourceForm.errorMsg = this.$t("audit.form.error.uploadError");
                return;
            }
            this.resourceService.create(
                this.createResourceForm.name,
                this.projectId,
                btoa(unescape(encodeURIComponent(this.createResourceForm.content))),
                (resource) => {
                    this.createResourceForm.name = '';
                    this.createResourceForm.successMsg = this.$t("audit.form.error.resourceSuccess");
                    this.resources.push(resource)
                },
                (error) => console.error(error)
            )
        },
        deleteResource(resource) {
            this.resourceService.delete(
                resource.id,
                () => {
                    let index = this.resources.indexOf(resource);
                    if(index !== -1){
                        this.resources.splice(index, 1);
                    }
                },
                (error) => console.error(error)
            )
        },
    },
    computed:{
        isNameValid(){
            return !! this.createResourceForm.name;
        },
        isContentValid(){
            return !!this.createResourceForm.content;
        },
        describedBy(){
            let value = null;
            if(this.createResourceForm.successMsg) {
                value = "name-success"
            }
            else if(this.createResourceForm.errorMsg) {
                value = "name-error"
            }
            else if(!this.isValid && this.hasBeenSent) {
                value = "upload-error"
            }
            else {
                value = null
            }
            return value
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../AuditLaunch.style";
</style>