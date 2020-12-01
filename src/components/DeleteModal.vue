<template>
	<div class="modal-content">
		<header class="modal-header" id="modalTitle">
			<button type="button" class="btn btn--nude btn--icon" @click="closeModal" :aria-label="$t('action.closeModal')">
				<icon-base-decorative width="18" height="18"><icon-close /></icon-base-decorative>
				<span>{{$t('action.close')}}</span>
			</button>
		</header>
		<!-- first screen -->
		<section v-if="unconfirmed" class="modal-body" id="modalDescription">
            <p>{{ message }}</p>
			<div id="buttons">
				<button type="button" class="btn btn--default btn--icon" @click="confirmDeletion">
					<icon-base-decorative width="18" height="18"><icon-checked /></icon-base-decorative>
					<span>{{$t('action.confirm')}}</span>
				</button>
				<button type="button" class="btn btn--default btn--icon" @click="rejectHandler" :aria-label="$t('action.closeModal')">
					<icon-base-decorative width="18" height="18"><icon-close /></icon-base-decorative>
					<span>{{$t('action.cancel')}}</span>
				</button>
			</div>
		</section>

		<!-- After confirm screen -->
		<section v-else class="modal-body" id="modalEndMessage">
            <p>{{$t('archives.done')}}</p>
			<p>{{$t('archives.actionConfirmed')}}</p>
			<div id="buttons">
				<button type="button" class="btn btn--default btn--icon" @click="resolveHandler" :aria-label="$t('action.closeModal')">
					<icon-base-decorative width="18" height="18"><icon-close /></icon-base-decorative>
					<span>Close</span>
				</button>
			</div>
		</section>
	</div>
</template>

<script>
import IconBaseDecorative from './icons/IconBaseDecorative'
import IconClose from './icons/IconClose'
import IconChecked from './icons/IconChecked'

  export default {
    name: 'DeletionModal',
	components: {
		IconBaseDecorative,
		IconClose,
		IconChecked
	},
	data() {
		return {
			unconfirmed: true
		}
	},
    props: {
        message: {
			type: String,
            required: true
		},
		resolve: {
			type: Function,
			required: true
		},
		reject: {
			type: Function,
			required: true,
		},
    },
    methods: {
       resolveHandler() {
			// this value will be passed to `then`
			this.resolve()
		},
		rejectHandler() {
			// this value will be passed to `catch`
			this.reject()
		},
		confirmDeletion() {
			this.unconfirmed = false
		},
		closeModal() {
			if(this.unconfirmed === true){
				this.$modal.close()
			}
			else {
				this.resolveHandler()
			}
		}
    },
  };
</script>

<style lang="scss" scoped>
	.modal-body {
		text-align: center;
	}
	#buttons {
		width: 30%;
		margin: auto;
		display: flex;
		justify-content: space-around;
	}

</style>
