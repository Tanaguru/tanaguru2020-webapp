<template>
    <div id="session-popup" class="session-popup">
        <div class="session-popup__inner" aria-live="assertive">
			<p>{{$t('global.session.expiresSoon')}}</p>

			<button @click="maintainSession"
					class="btn btn--default">
				<span>{{$t('global.session.maintainButtonLabel')}}</span>
			</button>
		</div>
    </div>
</template>

<script>

	import store from "@/store";

	export default {
        name: 'sessionPopup',
        methods: {
			maintainSession() {
				store.dispatch('refreshToken')
			},
		}
    }

</script>

<style lang="scss" scoped>
.session-popup {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: #055A7F;
	opacity: .97;
	z-index: 200;

	.session-popup__inner {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		max-width: 35rem;
		padding: 3rem;
		transform: translate(-50%, -50%);
		border-radius: .3rem;
		background-color: $color-white;
		text-align: center;
	}
}
</style>
