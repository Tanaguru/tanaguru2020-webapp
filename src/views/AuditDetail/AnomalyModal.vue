<template>
    <div class="modal-content">
        <header class="modal-header" id="modalTitle">
            <h1 class="modal-header__title">
                {{ $t('auditDetail.synthesis.modal.criteria') }} {{ criteriaResult.testHierarchy.code }} -
                {{ criteriaResult.testHierarchy.name }}
                <span>Page {{ index + 1 }} : {{ auditPage.name }} - </span>
                <p id="status--failed" class="status status--failed" v-if="criteriaResult.status == 'failed'">
                {{ criteriaResult.status }}</p>
                <p id="status--passed" class="status status--passed" v-if="criteriaResult.status == 'passed'">
                    {{ criteriaResult.status }}</p>
                <p id="status--cantTell" class="status status--cantTell" v-if="criteriaResult.status == 'cantTell'">
                    {{ criteriaResult.status }}</p>
                <p id="status--inapplicable" class="status status--inapplicable"
                v-if="criteriaResult.status == 'inapplicable'">{{ criteriaResult.status }}</p>
            </h1>

            <button type="button" class="btn btn--nude btn--icon" @click="closeModal"
                    :aria-label="$t('action.closeModal')">
                <icon-base-decorative width="18" height="18">
                    <icon-close/>
                </icon-base-decorative>
                <span>{{ $t('action.close') }}</span>
            </button>
        </header>
        <section class="modal-body" id="modalDescription">
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
                <li class="list-anomaly__item" v-if="testResultByStatus['inapplicable']">
                    <span class="error-nbr error-nbr--inapplicable">
                        {{ criteriaResult.nbTI }}

                        <icon-base-informative icon-label="results inapplicable" width="20" height="20">
                            <icon-not-applicable/>
                        </icon-base-informative>
                    </span>
                    <span class="status status--inapplicable">Inapplicable :</span>
                    <p class="test-description" v-for="testResult in testResultByStatus['inapplicable']" v-if="testById[testResult.tanaguruTest]" :key="testResult.id">
                            {{ testById[testResult.tanaguruTest].name }}
                    </p>
                </li>

                <li class="list-anomaly__item" v-if="testResultByStatus['passed']">
                    <span class="error-nbr error-nbr--passed">
                        {{ criteriaResult.nbTP }}

                        <icon-base-informative icon-label="results passed" width="20" height="20">
                            <icon-compliant/>
                        </icon-base-informative>
                    </span>
                    <span class="status status--passed">passed :</span>
                    <p class="test-description" v-for="testResult in testResultByStatus['passed']" v-if="testById[testResult.tanaguruTest]" :key="testResult.id">
                            {{ testById[testResult.tanaguruTest].name }}
                    </p>
                </li>

                <li class="list-anomaly__item" v-if="testResultByStatus['failed']">
                    <span class="error-nbr error-nbr--failed">
                        {{ criteriaResult.nbTF }}

                        <icon-base-informative icon-label="results failed" width="20" height="20">
                            <icon-improper/>
                        </icon-base-informative>
                    </span>
                    <span class="status status--failed">failed :</span>
                    <p class="test-description" v-for="testResult in testResultByStatus['failed']" v-if="testById[testResult.tanaguruTest]" :key="testResult.id">
                            {{ testById[testResult.tanaguruTest].name }}
                    </p>
                </li>

                <li class="list-anomaly__item" v-if="testResultByStatus['cantTell']">
                    <span class="error-nbr error-nbr--cantTell">
                        {{ criteriaResult.nbTCT }}

                        <icon-base-informative icon-label="results cantTell" width="20" height="20">
                            <icon-qualify/>
                        </icon-base-informative>
                    </span>
                    <span class="status status--cantTell">cantTell :</span>
                    <p class="test-description" v-for="testResult in testResultByStatus['cantTell']" v-if="testById[testResult.tanaguruTest]" :key="testResult.id">
                            {{ testById[testResult.tanaguruTest].name }}
                    </p>
                </li>
            </ul>
        </section>
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
            this.$modal.close();
        }
    },
};
</script>

<style lang="scss" scoped>
.modal-header__title {
    span {
        display: block;
        margin-top: 1.6rem;
        font-size: $base-font-size;
        line-height: 1.5;
    }
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

.test-description {
    width: 80%;
    margin: auto;
}
</style>
