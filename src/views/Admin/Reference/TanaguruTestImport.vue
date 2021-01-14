<template>
    <div>
        <form>
            <div class="form-block">
                <file-upload :id="'test-uploader'" :label="$t('references.form.testListFile') + ' :'" @load="onAddTestListJson" :required="true" format=".json" />
                <p class="error">{{testInputError}}</p>
            </div>

            <div class="form-block" v-for="testReference of referencesFromTestList">
                <file-upload :id="'reference-' + testReference" :label="$t('references.form.referenceFile') + ' ' + testReference + ' :'" @load="(content)=>{onAddReferenceJson(content, testReference)}" :required="false" format=".json" />
                <p class="error" v-if="referenceInputErrorByReferenceCode[testReference]">{{referenceInputErrorByReferenceCode[testReference]}}</p>

                    <div v-if="testHierarchyByReferenceCode[testReference]">
                        <label for="reference-code-reset">{{$t('references.form.codeResetLabel')}} : </label>
                        <input id="reference-code-reset" type="text"  v-model="testHierarchyByReferenceCode[testReference].code" placeholder="Code" required/>
						<p class="info-error" v-if="!testHierarchyByReferenceCode[testReference].code">
							<icon-base-decorative width="16" height="16" viewBox="0 0 16 16"><icon-alert /></icon-base-decorative>
							<span>{{$t('references.form.emptyLabel')}}</span>
						</p>

						<p class="info-error" v-if="isLabelUsed(testHierarchyByReferenceCode[testReference].code)">
							<icon-base-decorative width="16" height="16" viewBox="0 0 16 16"><icon-alert /></icon-base-decorative>
							<span>{{$t('references.form.labelAlreadyExists')}}</span>
						</p>
					</div>
                </div>

            <div v-if="isCreationButtonVisible">
                <button type="button" class="btn btn--default" @click="createTestsAndReferences">{{$t('action.create')}}</button>
                <p class="info-success" v-if="isCreationButtonEnabled">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16"><icon-valid /></icon-base-decorative>
                    <span>{{$t('references.form.ready')}}</span>
                </p>
                <p v-else class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16"><icon-alert /></icon-base-decorative>
                    <span>{{$t('references.form.disabled')}}</span>
                </p>
            </div>
            <div id="result-output" v-if="isWorking">
                <p>Tests : {{creationOutput.testCount}} / {{tests.length}}</p>
                <p>Test Hierarchies : {{creationOutput.testHierarchyCount}} / {{creationOutput.testHierarchyMax}}</p>
                <p>Test Hierarchies rule assign : {{creationOutput.testHierarchyAssignCount}} / {{creationOutput.testHierarchyAssignMax}}</p>
            </div>
        </form>

        <div v-if="Object.keys(testHierarchyByReferenceCode).length > 0">
            <h3>{{$t('references.overview')}}</h3>
            <label for="overview-select">{{$t('references.overviewSelect')}} :</label>
            <div class="select">
                <select v-model="overviewSelection" id="overview-select">
                    <option v-for="reference of Object.keys(testHierarchyByReferenceCode)" :key="reference.id" :value="reference" selected>{{reference}}</option>
                </select>
            </div>

            <div v-if="overviewSelection && testHierarchyByReferenceCode[overviewSelection]">
                <test-hierarchy-json-overview v-for="child of testHierarchyByReferenceCode[overviewSelection].children" :key="child.name" :test-hierarchy="child" :tests-by-test-hierarchy-code="testsByRuleByReferenceCode[overviewSelection]"/>
            </div>
        </div>
    </div>
</template>

<script>
    import FileUpload from "@/components/FileUpload";
	import TestHierarchyJsonOverview from "./TestHierarchyJsonOverview";
	import IconValid from "@/components/icons/IconValid";
	import IconAlert from "@/components/icons/IconAlert";
	import IconBaseDecorative from "@/components/icons/IconBaseDecorative";
	export default {
        name: 'tanaguru-test-import',
        components: {FileUpload, TestHierarchyJsonOverview, IconValid, IconAlert, IconBaseDecorative},
        props: ['existingReferences'],
        data(){
            return {
                tests: [],
                testsByRuleByReferenceCode: {},
                testHierarchyByReferenceCode: {},

                testInputError: "",
                referenceInputErrorByReferenceCode: {},

                overviewSelection: '',

                isWorking: false,
                creationOutput: {
                    testCount: 0,
                    testHierarchyCount: 0,
                    testHierarchyMax: 0,
                    testHierarchyAssignCount: 0,
                    testHierarchyAssignMax: 0
                }
            }
        },
        methods : {
            onAddTestListJson(content){
                this.testInputError = "";
                this.testsByRuleByReferenceCode = {};
                this.testHierarchyByReferenceCode = {};
                this.referenceInputErrorByReferenceCode = {};

                try{
                    let parsedContent = JSON.parse(content);
                    if(parsedContent instanceof Array){

                        let isError = false;
                        for(const test of parsedContent){
                            //check test validity
                            if(!test.name || !test.ressources){
                                this.testInputError = this.$t('references.form.invalidTestFile');
                                isError = true;
                                break;
                            }

                            if(test.ressources){
                                for(const reference of Object.keys(test.ressources)){
                                    if(! this.testsByRuleByReferenceCode[reference]){
                                        this.$set(this.testsByRuleByReferenceCode, reference, {});
                                    }
                                    for(const rule of test.ressources[reference]){
                                        if(! this.testsByRuleByReferenceCode[reference][rule]){
                                            this.$set(this.testsByRuleByReferenceCode[reference], rule, []);
                                        }
                                        this.testsByRuleByReferenceCode[reference][rule].push(test);
                                    }
                                }
                            }
                        }

                        if(isError){
                            this.testsByRuleByReferenceCode = {};
                            this.testInputError = this.$t('references.form.invalidTestFile');
                        }else{
                            this.tests = parsedContent;
                        }
                    }else{
                        this.tests = [];
                        this.testInputError = this.$t('references.form.invalidTestFile');
                    }
                }catch (e) {
                    this.testInputError = this.$t('error.parseJson')
                }

            },
            onAddReferenceJson(content, reference){
                this.$delete(this.referenceInputErrorByReferenceCode, reference);
                try{
                    let parsedContent = JSON.parse(content);
                    if(this.checkTestHierarchyRec(parsedContent, reference, {})){
                        this.$set(this.testHierarchyByReferenceCode, reference, parsedContent);
                    }
                }catch (e) {
                    console.error(e);
                    this.$set(this.referenceInputErrorByReferenceCode, reference, this.$t('error.parseJson'));
                }

            },

            checkTestHierarchyRec(testHierarchy, reference, codes){
                let result = true;
                if(! testHierarchy.name ||
                ! testHierarchy.code){
                    this.$set(this.referenceInputErrorByReferenceCode, reference, this.$t('references.form.invalidReferenceFile'));
                    result = false;
                }else{
                    let hierarchyRanks = {};
                    for(const child of testHierarchy.children){
                        if(hierarchyRanks[child.rank]){
                            result = false;
                            this.$set(this.referenceInputErrorByReferenceCode, reference, this.$t('references.form.duplicatedRank') + ' ' + child.code);
                            break;
                        }

                        if(codes[child.code]){
                            result = false;
                            this.$set(this.referenceInputErrorByReferenceCode, reference, this.$t('references.form.duplicatedCode') + ' ' + child.code);
                            break;
                        }else{
                            codes[child.code] = true
                        }

                        if(!this.checkTestHierarchyRec(child, reference, codes)){
                            result = false;
                            break;
                        }
                    }
                }
                return result
            },

            createTestsAndReferences(){
                if(this.isCreationButtonEnabled){
                    this.isWorking = true;
                    this.creationOutput.testCount = 0;
                    this.creationOutput.testHierarchyCount = 0;
                    this.creationOutput.testHierarchyMax = 0;
                    this.creationOutput.testHierarchyAssignCount = 0;
                    this.creationOutput.testHierarchyAssignMax = 0;

                    let persistedTestByTest = {};
                    let promises = [];
                    for(const test of this.tests){
                        promises.push(
                            this.tanaguruTestService.create(test,
                                (persistedTest)=>{

                                    this.creationOutput.testCount += 1;
                                    persistedTestByTest[test.name] = persistedTest;
                                },
                                (error)=>{
                                    console.error(error)
                                }
                            )
                        )
                    }

                    Promise.all(promises).then(() =>{
                        for(const referenceCode of Object.keys(this.testHierarchyByReferenceCode)){
                            this.createTestHierarchyRec(null, null, referenceCode, this.testHierarchyByReferenceCode[referenceCode], persistedTestByTest);
                        }
                    });
                }
            },

            createTestHierarchyRec(parent, reference, baseReferenceCode,  testHierarchy, persistedTestByTestName){
                let testHierarchyToPersist = {};
                Object.assign(testHierarchyToPersist, testHierarchy);
                delete testHierarchyToPersist.children;

                if(parent){
                    testHierarchyToPersist.parentId = parent.id;
                }

                if(reference){
                    testHierarchyToPersist.referenceId = reference.id;
                }

                this.creationOutput.testHierarchyMax += 1;
                this.testHierarchyService.create(
                    testHierarchyToPersist,
                    (persistedTestHierarchy) =>{
                        this.creationOutput.testHierarchyCount += 1;
                        this.assignTestHierarchyTests(persistedTestHierarchy, baseReferenceCode, persistedTestByTestName);
                        if(!reference){
                            this.$emit('addReference', persistedTestHierarchy)
                        }
                        for(const child of testHierarchy.children){
                            this.createTestHierarchyRec(persistedTestHierarchy, reference ? reference : persistedTestHierarchy, baseReferenceCode, child, persistedTestByTestName);
                        }
                    },
                    (error) => {
                        console.error(error);
                    }
                )
            },

            assignTestHierarchyTests(persistedTestHierarchy, baseReferenceCode,  persistedTestByTestName){
                if(this.testsByRuleByReferenceCode[baseReferenceCode] &&
                    this.testsByRuleByReferenceCode[baseReferenceCode][persistedTestHierarchy.code]){
                    this.creationOutput.testHierarchyAssignMax += this.testsByRuleByReferenceCode[baseReferenceCode][persistedTestHierarchy.code].length;
                    this.testHierarchyService.addTestList(
                        persistedTestHierarchy.id,
                        this.testsByRuleByReferenceCode[baseReferenceCode][persistedTestHierarchy.code]
                            .map((test)=>{
                                return persistedTestByTestName[test.name].id;
                            }),
                        () =>{
                            this.creationOutput.testHierarchyAssignCount += this.testsByRuleByReferenceCode[baseReferenceCode][persistedTestHierarchy.code].length;
                        },
                        (error)=>{
                            console.error(error)
                        });
                }
            },

			isLabelUsed(label){
				return this.existingReferences.some(
					(existingLabel)=>{
						console.log(existingLabel.code + ' ' + label)
						return existingLabel.code === label
					}
				)
			}
        },
        computed : {
            referencesFromTestList(){
                return Object.keys(this.testsByRuleByReferenceCode);
            },

            isCreationButtonVisible(){
                return !this.isWorking && Object.keys(this.testHierarchyByReferenceCode).length > 0;
            },

            isCreationButtonEnabled(){
                return this.isCreationButtonVisible && !Object.keys(this.testHierarchyByReferenceCode).some(
                    (baseReferenceCode)=>{
                        let newCode = this.testHierarchyByReferenceCode[baseReferenceCode].code;
                        return ! newCode ||
                            this.existingReferences.some(
                            (existingReference)=>{
                                return existingReference.code === newCode;
                            }
                        )
                    }
                )
            }
        }
    }
</script>

<style lang="scss">
.error{
    margin: .5rem 0 0;
    color: $color-red;
    font-size: $small-font-size;
}
</style>
