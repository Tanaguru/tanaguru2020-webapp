<template>
    <div id="session-popup" v-if="$store.state.user && isWindowVisible" class="session-popup">
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
    export default {
        name: 'sessionPopup',
        props: ['bus'],
        data() {
            return {
                timer: null,
                sessionDuration: 1800000,
                currentDate: null,
                lastApiCallDate: new Date(),
            }
        },
        created() {
            this.bus.$on('api-call', (req) => {
                this.lastApiCallDate = new Date()
            });

            this.configService.getSessionDuration(
                (sessionDuration) => {
                    this.sessionDuration = sessionDuration * 1000
                },
                (error) => {
                    console.error(error)
                }
            )

            this.currentDate = new Date();
            this.timer = setInterval(this.refreshCurrentDate, 10000);
        },
        computed: {
            isWindowVisible() {
                // Show window 5 mn before timeout
                return this.$store.state.user && this.lastApiCallDate && this.currentDate && (this.lastApiCallDate.getTime() + this.sessionDuration - 300000 <= this.currentDate.getTime());
            },

            isTimedOut(){
                return this.$store.state.user && this.lastApiCallDate && this.currentDate && (this.lastApiCallDate.getTime() + this.sessionDuration <= this.currentDate.getTime());
            }
        },
        methods: {
            maintainSession() {
                this.userService.me(
                    () => {
                    },
                    () => {
                    }
                );
            },
            refreshCurrentDate() {
                this.currentDate = new Date();
                if(this.isTimedOut){
                    this.$store.dispatch("logout")
                }
            }
        },
        beforeDestroy() {
            clearInterval(this.timer)
        },
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
