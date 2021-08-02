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
                <p id="status--inapplicable" class="status status--inapplicable"
                v-if="status == 'inapplicable'">
                    {{$t('entity.audit.result.inapplicable')}}</p>
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
    </div>
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconArrowBlue from '../../components/icons/IconArrowBlue'
import IconClose from '../../components/icons/IconClose'

export default {
    name: 'AnomalyModal',
    components: {
        IconBaseDecorative,
        IconArrowBlue,
        IconClose    
    },
    props: ['audit','testHierarchy','status'],
    methods: {
        closeModal() {
            this.$modal.close();
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

</style>
