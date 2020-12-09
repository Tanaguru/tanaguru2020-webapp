<template>
	<footer class="footer" role="contentinfo">
		<div class="footer__img">
			<div class="wrapper">
				<img src="/assets/images/footer-desktop.svg" alt="" />
			</div>
		</div>
		<div class="footer__content">
			<div class="wrapper">
				<p class="footer-copyright">{{$t('global.footerContent',
					{
						date: new Date().getFullYear(),
						appVersion: $store.getters.appVersion,
						serverVersion: $store.getters.serverVersion
					})}}</p>
				<ul class="footer-menu list-unstyled">
					<li class="footer-menu__item">
						<a href="#" class="link-simple">{{$t('page.legals')}}</a>
					</li>
					<li class="footer-menu__item">
						<a href="#" class="link-simple">{{$t('page.privacy')}}</a>
					</li>
					<li class="footer-menu__item">
						<a href="#" class="link-simple">{{$t('page.credits')}}</a>
					</li>
					<li class="footer-menu__item">
						<a href="#" class="link-simple">{{$t('page.access')}}</a>
					</li>
					<li class="footer-menu__item">
						<a href="#" class="link-simple">{{$t('page.sitemap')}}</a>
					</li>
				</ul>
			</div>
		</div>
	</footer>
</template>

<script>
  export default {
      name: 'tngFooter',
      data(){
        return{
          locale : "en"
        }
      },
      methods: {
        updateLocale : function(){
          this.$i18n.locale = this.locale;
        },
      }
  }
</script>

<style lang="scss" scoped>
.footer {
	margin-top: 12rem;

	&__img {
		text-align: right;

		img {
			width: 100%;
			max-width: 63.6rem;
			margin-bottom: -1rem;
		}
	}

	&__content {
		padding: 4rem 0;
		border-top: 1px solid $border-secondary;
		color: $text-tertiary;
		font-family: $font-stack-secondary;
		font-size: $small-font-size;
		text-align: center;
	}
}

.footer-copyright {
	margin: 0;
}

.footer-menu {
	list-style-type: none;

	&__item {
		display: inline-block;

		&:not(:last-child) {
			&::after {
				display: inline-block;
				margin: 0 .5rem;
				content: "-";
			}
		}
	}
}
</style>
