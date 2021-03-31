<template>
	<div class='banner'>
		<div class="banner__wrapper wrapper">
			<div class="skip-link">
				<a href="#page" class="link-independent link-independent--icon">
					<icon-base-decorative width="16" height="16" viewBox="0 0 24 24"><icon-arrow-blue /></icon-base-decorative>
					<span>{{$t('global.skiplink')}}</span>
				</a>
			</div>
			<div class="params">
				<div class="params__language-desktop">
					<label class="screen-reader-text" for="locale">{{$t('global.language.label')}}</label>
					<div class="select select--lang">
						<select v-model="locale" name="locale" id="locale" @change="updateLocale">
							<option value="en" lang="en">
							{{$t('global.language.english')}}
							</option>
							<option value="fr" lang="fr">
							{{$t('global.language.french')}}
							</option>
						</select>
					</div>
				</div>
				<div class="params__help">
					<a href='https://www.notion.so/tanaguru/Tanaguru-2020-Documentation-7e5cb26b3a384a89a49808e7226b9d5c' class="link-independent link-independent--icon">
						<icon-base-decorative><icon-help-blue /></icon-base-decorative>
						<span>{{$t('global.help')}}</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import IconBaseDecorative from './icons/IconBaseDecorative'
import IconHelpBlue from './icons/IconHelpBlue'
import IconArrowBlue from './icons/IconArrowBlue'

  export default {
      name: 'banner',
      data(){
        return{
          locale : this.$i18n.locale
        }
      },
      methods: {
        updateLocale : function(){
			this.bus.$emit("updateLocale", this.locale);
        },
      },
	  components: {
    	IconBaseDecorative,
		IconHelpBlue,
		IconArrowBlue
  	}
  }
</script>

<style lang="scss" scoped>
.banner {
	border-bottom: 1px solid $border-secondary;
	font-family: $font-stack-secondary;
	font-size: $small-font-size;
	text-align: center;

	@media #{$media-md-viewport} {
		text-align: left;
	}

	.banner__wrapper {
		display: flex;
		align-items: center;
		justify-content: center;

		@media #{$media-md-viewport} {
			justify-content: space-between;
		}

		.select--lang {
			@media #{$media-md-viewport} {
				padding: 1rem 0;
				border-right: 1px solid $border-secondary;
				border-left: 1px solid $border-secondary;
			}

			&::before {
				width: 3rem;
			}

			&::after {
				right: 1.3rem;
				width: .7rem;
				height: .7rem;
				border-right: 1px solid $text-secondary;
				border-bottom: 1px solid $text-secondary;
			}

			select {
				border: 0;
				padding: 0 3rem 0 1.6rem;
			}

			&:focus-within {
				&::after {
					border-color: $color-white;
				}
			}
		}
	}
}

.skip-link {
	padding: 1rem 0;
	flex: 0 0 60%;
	border-right: 1px solid $border-secondary;

	@media #{$media-xs-viewport} {
		flex: 0 0 50%;
	}

	@media #{$media-md-viewport} {
		padding: 1rem .8rem 1rem 1.6rem;
		flex: 0 0 auto;
	}

	@media #{$media-wrapper-viewport} { // equivalent to $wrapper-width: 1120px
		border-left: 1px solid $border-secondary;
	}
}

.params {
	flex: 0 0 40%;

	@media #{$media-xs-viewport} {
		flex: 0 0 50%;
	}

	@media #{$media-md-viewport} {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
	}

	@media #{$media-wrapper-viewport} { // equivalent to $wrapper-width: 1120px
		border-right: 1px solid $border-secondary;
	}

	.params__language-desktop,
	.params__help {
		flex: 0 0 auto;
	}

	.params__language-desktop {
		display: none;

		@media #{$media-md-viewport} {
			display: block;
		}
	}

	.params__help {
		@media #{$media-md-viewport} {
			padding-right: 1.6rem;
			padding-left: 1.6rem;
		}
	}
}
</style>
