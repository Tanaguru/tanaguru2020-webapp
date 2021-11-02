<template>
    <div class="modal-content">
        <header class="modal-header" id="modalTitle">
            <h1 class="modal-header__title">
                Test {{ testHierarchy.code }} -
                {{ testHierarchy.name | format }}
                <span>{{$t('auditDetail.synthesis.allPages')}}</span>
                <p id="status--failed" class="status status--failed" v-if="status == 'failed'">
                    {{$t('entity.audit.result.failed')}}</p>
                <p id="status--passed" class="status status--passed" v-if="status == 'passed'">
                    {{$t('entity.audit.result.passed')}}</p>
                <p id="status--cantTell" class="status status--cantTell" v-if="status == 'cantTell'">
                   {{$t('entity.audit.result.cantTell')}}</p>
                <p id="status--inapplicable" class="status status--inapplicable" v-if="status == 'inapplicable'">
                   {{$t('entity.audit.result.inapplicable')}}</p>
                <p id="status--untested" class="status status--untested" v-if="status == 'untested'">
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
        <section class="modal-body" id="modalDescription">
            <div class="links">
                <a class="link-independent link-independent--icon" :href="testHierarchy.urls[0]">
                    <icon-base-decorative>
                        <icon-arrow-blue/>
                    </icon-base-decorative>
                    <span>{{ $t('auditDetail.synthesis.modal.rule') }}</span>
                </a>
            </div>
        </section>
        <ul class="list-anomaly" v-if="pagesConcerned">
            <li class="list-anomaly__item" v-if="status == 'failed'">
                <span class="status status--failed">{{$t('entity.audit.result.failed')}} {{$t('entity.test.onPage')}} :</span>
                <p class="test-description" v-for="(page, i) in pagesConcernedPaginated" :key="i">
                    <router-link class="link-independent link-independent--icon"
                        :to="'/audits/' + audit.id + '/pages/' + page.id">
                        <icon-base-decorative>
                            <icon-arrow-blue/>
                         </icon-base-decorative>
                        <span>Page n°{{page.id-Object.keys(allPagesById)[0]+1}} - {{page.name}}</span>
                    </router-link>
                </p>
            </li>
            <li class="list-anomaly__item" v-if="status == 'cantTell'">
                <span class="status status--cantTell">{{$t('entity.audit.result.cantTell')}} {{$t('entity.test.onPage')}} :</span>
                <p class="test-description" v-for="(page, i) in pagesConcernedPaginated" :key="i">
                    <router-link class="link-independent link-independent--icon"
                        :to="'/audits/' + audit.id + '/pages/' + page.id">
                        <icon-base-decorative>
                            <icon-arrow-blue/>
                         </icon-base-decorative>
                        <span>Page n°{{page.id-Object.keys(allPagesById)[0]+1}} - {{page.name}}</span>
                    </router-link>
                </p>
            </li>
            <li class="list-anomaly__item" v-if="status == 'inapplicable'">
                <span class="status status--inapplicable">{{$t('entity.audit.result.inapplicable')}} {{$t('entity.test.onPage')}} :</span>
                <p class="test-description" v-for="(page, i) in pagesConcernedPaginated" :key="i">
                    <router-link class="link-independent link-independent--icon"
                        :to="'/audits/' + audit.id + '/pages/' + page.id">
                        <icon-base-decorative>
                            <icon-arrow-blue/>
                         </icon-base-decorative>
                        <span>Page n°{{page.id-Object.keys(allPagesById)[0]+1}} - {{page.name}}</span>
                    </router-link>
                </p>
            </li>
            <li class="test-description">
                <pagination
                :current-page="currentPage"
                :total-pages="totalPages"
                @changePage="changePage"
                />
            </li>
        </ul>
        <div id="fetching-data" v-else>
            <p aria-live="polite">{{$t('auditDetail.synthesis.loading')}}</p>
        </div>
    </div>
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconArrowBlue from '../../components/icons/IconArrowBlue'
import IconClose from '../../components/icons/IconClose'
import Pagination from "../../components/Pagination";

export default {
    name: 'AnomalyGobalTestModal',
    components: {
        IconBaseDecorative,
        IconArrowBlue,
        IconClose,
        Pagination   
    },
    props: ['audit','testHierarchy','status', 'pagesResultsSynthesis', 'allPagesById'],
    data(){
        return {
            currentPage: 0,
            totalPages: 0,
            pagesConcerned: null
        }
    },
    created(){
        this.getPagesConcerned();
    },
    computed:{
        pagesConcernedPaginated(){
            return this.pagesConcerned.slice(this.currentPage*5,5*(this.currentPage+1));
        }
    },
    methods: {

        getPagesConcerned(){
            let result = []
            for(var pageId in this.pagesResultsSynthesis){
                if(this.pagesResultsSynthesis[pageId].status == this.status
                && this.status != 'passed'
                && this.status != 'untested'){
                    result.push(this.allPagesById[pageId])
                }
            }
            this.pagesConcerned = result;
            this.totalPages = Math.ceil(Object.keys(this.pagesConcerned).length/5)
        },

        closeModal() {
            this.$modal.close();
        },

        changePage(page) {
            this.currentPage = page;
        }
        
    },
    filters: {
        format: function (value) {
            if (!value) return ''
            value = value.replace(/ *\(#[^)]*\) */g, " ").replace(/[\[\]]+/g,'')
            return value
        }
    }
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
    margin: 2.4rem 0 0;
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

// Loading screen
#fetching-data {
    text-align: center;
    color: $text-secondary;
    font-family: $font-stack-secondary;
    font-weight: bold;

    img {
        max-height: 100rem;
    }
}

.test-description {
    width: 80%;
    margin: 0;
}
</style>
