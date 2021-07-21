<template>
    <div class="modal-content">
        <header class="modal-header" id="modalTitle">
            <h1 class="modal-header__title">Source code</h1>

            <button type="button" class="btn btn--nude btn--icon" @click="closeModal()"
                    :aria-label="$t('action.closeModal')">
                <icon-base-decorative width="18" height="18">
                    <icon-close/>
                </icon-base-decorative>
                <span>{{ $t('action.close') }}</span>
            </button>
        </header>

        <main class="modal-body" id="modalDescription">
            <pre id="sourcecode">
                <code id="source">
                    {{ sourceCode }}
                </code>
            </pre>
        </main>
    </div>
</template>

<script>
import IconBaseDecorative from '../components/icons/IconBaseDecorative.vue'
import IconClose from '../components/icons/IconClose'

export default {
    name: 'SourceCodeModal',
    components: {
        IconBaseDecorative,
        IconClose
    },
    props: ['sourceCode'],
    methods: {
        closeModal() {
            const el = document.body;
            el.classList.remove('noScroll');
            el.classList.add('scroll');

            this.$modal.close();
        }
    },
};
</script>

<style lang="scss" scoped>
#sourcecode {
    overflow-x: scroll;
}

</style>
