<template>
    <div class="modal-content">
        <header class="modal-header" id="modalTitle">
            <h1 class="modal-header__title">
                Test {{ criteriaResult.testHierarchy.code }} -
                {{ criteriaResult.testHierarchy.name| nameWithoutConditions }}
                <h2 class="modal-header__conditions" style="white-space: pre-line">{{ criteriaResult.testHierarchy.name| conditions }}</h2>
                <span>Page {{ index + 1 }} : {{ auditPage.name }} - </span>
                <p id="status--failed" class="status status--failed" v-if="criteriaResult.status == 'failed'">
                    {{$t('entity.audit.result.failed')}}</p>
                <p id="status--passed" class="status status--passed" v-if="criteriaResult.status == 'passed'">
                    {{$t('entity.audit.result.passed')}}</p>
                <p id="status--cantTell" class="status status--cantTell" v-if="criteriaResult.status == 'cantTell'">
                   {{$t('entity.audit.result.cantTell')}}</p>
                <p id="status--inapplicable" class="status status--inapplicable" v-if="criteriaResult.status == 'inapplicable'">
                    {{$t('entity.audit.result.inapplicable')}}</p>
                <p id="status--untested" class="status status--untested" v-if="criteriaResult.status == 'untested'">
                   {{$t('entity.audit.result.untested')}}</p>
            </h1>

            <button type="button" class="btn btn--nude btn--icon" @click="closeModal()"
                    :aria-label="$t('action.closeModal')">
                <icon-base-decorative width="18" height="18">
                    <icon-close/>
                </icon-base-decorative>
                <span>{{ $t('action.close') }}</span>
            </button>
        </header>
        <main class="modal-body" id="modalDescription">
            <div class="links">
                <a class="link-independent link-independent--icon" :href="criteriaResult.testHierarchy.urls[0]">
                    <icon-base-decorative>
                        <icon-arrow-blue/>
                    </icon-base-decorative>
                    <span>{{ $t('auditDetail.synthesis.modal.rule') }}</span>
                </a>

                <router-link class="link-independent link-independent--icon"
                             :to="'/audits/' + audit.id + '/pages/' + auditPage.id ">
                    <icon-base-decorative>
                        <icon-arrow-blue/>
                    </icon-base-decorative>
                    <span>{{ $t('auditDetail.synthesis.modal.seeDetails') }}</span>
                </router-link>
            </div>

            <ul class="list-anomaly">
                <li class="list-anomaly__item" v-if="testResultByStatus['inapplicable'] && criteriaResult.nbET > 0">
                    <span class="error-nbr error-nbr--inapplicable">
                        {{ criteriaResult.nbET }}

                        <icon-base-informative icon-label="results inapplicable" width="20" height="20">
                            <icon-not-applicable/>
                        </icon-base-informative>
                    </span>
                    <span class="status status--inapplicable">{{$t('entity.audit.result.inapplicable')}} :</span>
                    <p class="test-description" v-for="testResult in testResultByStatus['inapplicable']" v-if="testById[testResult.tanaguruTest] && testResult.nbElementPassed" :key="testResult.id">
                            {{ testById[testResult.tanaguruTest].name }} 
                            <span>({{ testResult.nbElementUntested }})</span>
                    </p>
                </li>

                <li class="list-anomaly__item" v-if="testResultByStatus['passed'] && criteriaResult.nbEP > 0">
                    <span class="error-nbr error-nbr--passed">
                        {{ criteriaResult.nbEP }}

                        <icon-base-informative icon-label="results passed" width="20" height="20">
                            <icon-compliant/>
                        </icon-base-informative>
                    </span>
                    <span class="status status--passed">{{$t('entity.audit.result.passed')}} :</span>
                    <p class="test-description" v-for="testResult in testResultByStatus['passed']" v-if="testById[testResult.tanaguruTest] && testResult.nbElementPassed" :key="testResult.id">
                            {{ testById[testResult.tanaguruTest].name }}
                            <span>({{ testResult.nbElementPassed }})</span>

                    </p>
                </li>

                <li class="list-anomaly__item" v-if="testResultByStatus['failed'] && criteriaResult.nbEF > 0">
                    <span class="error-nbr error-nbr--failed">
                        {{ criteriaResult.nbEF }}

                        <icon-base-informative icon-label="results failed" width="20" height="20">
                            <icon-improper/>
                        </icon-base-informative>
                    </span>
                    <span class="status status--failed">{{$t('entity.audit.result.failed')}} :</span>
                    <p class="test-description" v-for="testResult in testResultByStatus['failed']" v-if="testById[testResult.tanaguruTest] && testResult.nbElementFailed" :key="testResult.id">
                            {{ testById[testResult.tanaguruTest].name }}
                            <span>({{ testResult.nbElementFailed }})</span>
                    </p>
                </li>

                <li class="list-anomaly__item" v-if="testResultByStatus['cantTell'] && criteriaResult.nbECT > 0">
                    <span class="error-nbr error-nbr--cantTell">
                        {{ criteriaResult.nbECT }}

                        <icon-base-informative icon-label="results cantTell" width="20" height="20">
                            <icon-qualify/>
                        </icon-base-informative>
                    </span>
                    <span class="status status--cantTell">{{$t('entity.audit.result.cantTell')}} :</span>
                    <p class="test-description" v-for="testResult in testResultByStatus['cantTell']" v-if="testById[testResult.tanaguruTest] && testResult.nbElementCantTell" :key="testResult.id">
                            {{ testById[testResult.tanaguruTest].name }}
                            <span>({{ testResult.nbElementCantTell }})</span>
                    </p>
                </li>
            </ul>
        </main>
    </div>
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconBaseInformative from '../../components/icons/IconBaseInformative'
import IconArrowBlue from '../../components/icons/IconArrowBlue'
import IconClose from '../../components/icons/IconClose'
import IconCompliant from '../../components/icons/IconCompliant'
import IconImproper from '../../components/icons/IconImproper'
import IconNotApplicable from '../../components/icons/IconNotApplicable'
import IconQualify from '../../components/icons/IconQualify'

export default {
    name: 'AnomalyModal',
    components: {
        IconBaseDecorative,
        IconBaseInformative,
        IconArrowBlue,
        IconClose,
        IconCompliant,
        IconImproper,
        IconNotApplicable,
        IconQualify
    },
    props: ['audit', 'auditPage', 'criteriaResult', 'index'],
    data() {
        return {
            testResults: [],
            testById: {}
        }
    },
    created() {
        this.testResultService.findAllByTestHierarchyResult(
            this.criteriaResult.id,
            this.sharecode,
            (testResults) => {

                this.testResults = testResults;
                for (const testResult of testResults) {
                    this.tanaguruTestService.findById(
                        testResult.tanaguruTest,
                        (test) => {
                            this.$set(this.testById, test.id, test);
                        }
                    )
                }
            },
            (error) => {
                console.error(error);
            }
        )
    },
    computed: {
        testResultByStatus() {
            let result = {};
            for (const testResult of this.testResults) {
                if (!result[testResult.status]) {
                    result[testResult.status] = [];
                }
                result[testResult.status].push(testResult);
            }
            return result;
        }
    },
    methods: {
        closeModal() {
            document.body.style.overflow = "auto"
            this.$modal.close();
        },
    },    
    filters: {
        nameWithoutConditions: function (value) {
			if (!value) return ''
			value = value.replace(/ *\(#[^)]*\) */g, " ").replace(/[\[\]\`]+/g,'')
			if(value.includes(';')){
				value = value.substring(0,value.lastIndexOf("?")+1)
			}
			return value
		},
        conditions: function(value){
            if (!value) return ''
			value = value.replace(/ *\(#[^)]*\) */g, " ").replace(/[\[\]\`]+/g,'')
			if(value.includes(';')){
				value = value.replaceAll(' ;','.').replaceAll(' .','.').replaceAll('\n','\n• ')
				value = value.substring(0,value.lastIndexOf("•"))
                value = value.substring(value.lastIndexOf('?')+1, value.length)
			}else{
                value = ''
            }
			return value
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-header__title {
    span {
        display: block;
        font-size: $base-font-size;
        line-height: 1.5;
    }
}

.modal-header__conditions{
    @extend %h3-like;
    line-height: 125%;
    margin: 0;
    margin-bottom: 1em;
  
}

.links {
    .link-independent:not(:last-child) {
        margin-right: 1.6rem;
    }
}

.list-anomaly {
    margin: 3.2rem 0 0;
    padding: 0;
    font-family: $font-stack-secondary;
    font-size: $medium-font-size;
    list-style: none;

    .list-anomaly__item {
        margin-bottom: 2.4rem;
    }
}

.error-nbr {
    display: inline-block;
    position: relative;
    margin-right: 1.6rem;
    width: 5rem;
    height: 5rem;
    border-width: 2px;
    border-style: solid;
    border-radius: 50%;
    background-color: $bg-primary;
    font-family: $font-stack-secondary;
    font-size: $medium-font-size;
    font-weight: 600;
    line-height: 5rem; // disable sass-lint
    text-align: center;

    svg {
        position: absolute;
        right: -.3rem;
        bottom: -.6rem;
    }

    &.error-nbr--failed {
        border-color: $color-improper;
        color: $color-improper;
    }

    &.error-nbr--passed {
        border-color: $color-compliant;
        color: $color-compliant;
    }

    &.error-nbr--inapplicable {
        border-color: $color-not-applicable;
        color: $color-not-applicable;
    }

    &.error-nbr--cantTell {
        border-color: $color-qualify;
        color: $color-qualify;
    }

    &.error-nbr--untested {
        border-color: $color-untested;
        color: $color-untested;
    }
}

.status {
    font-weight: 600;

    &.status--failed {
        color: $color-improper;
    }

    &.status--passed {
        color: $color-compliant;
    }

    &.status--inapplicable {
        color: $color-not-applicable;
    }

    &.status--cantTell {
        color: $color-qualify;
    }

    &.status--untested {
        color: $color-untested;
    }
}

#status--failed {
    border: 2px solid $color-improper;
    border-radius: .5em;
    padding: 0 .5em;
    font-size: .5em;
    display: inline;
}

#status--passed {
    border: 2px solid $color-compliant;
    border-radius: .5em;
    padding: 0 .5em;
    font-size: .5em;
    display: inline;
}

#status--inapplicable {
    border: 2px solid $color-not-applicable;
    border-radius: .5em;
    padding: 0 .5em;
    font-size: .5em;
    display: inline;
}

#status--cantTell {
    border: 2px solid $color-qualify;
    border-radius: .5em;
    padding: 0 .5em;
    font-size: .5em;
    display: inline;
}

#status--untested {
    border: 2px solid $color-untested;
    border-radius: .5em;
    padding: 0 .5em;
    font-size: .5em;
    display: inline;
}

.test-description {
    width: 80%;
    margin: auto;
}
</style>
