<template>
    <button
        @click="scrollToTop"
        class="btn btn--shadow btn--icon btn--top"
        style="position:fixed; bottom:3.4rem;right:3.4rem;"
        v-if="scrollpx > 800"
    >
        <icon-base-decorative width="20" height="27" viewBox="0 0 32 32"><icon-top /></icon-base-decorative><!-- @whitespace --><span v-html="$t('action.goTop')"></span>
    </button>
</template>

<script>
import IconBaseDecorative from './icons/IconBaseDecorative';
import IconTop from '../components//icons/IconTop';

export default {
    name: 'BackToTop',
    components: {
		IconBaseDecorative,
		IconTop
    },
    data() {
        return {
        	scrollpx : 0,
        }
    },
    methods: {
        handleScroll() {
			this.scrollpx = window.scrollY;
		},

		scrollToTop(index) {
            document.getElementById('page').scrollIntoView();
        },
    },
    created() {
        window.addEventListener('scroll', this.handleScroll);
    },
	destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>