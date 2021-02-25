<template>
    <header class="layout-header">
        <h2 class="layout-title">
			<span class="layout-title__number">
				<span class="layout-title-number">{{number}}</span>
			</span>
			<span class="layout-title__text">
				<span class="layout-title-text" v-html="title"></span>
			</span>
        </h2>

		<div class="layout-header__content" v-show="number === 4">
			<p>{{$t('audit.resolution.explanation')}}</p>
		</div>

        <div class="layout-header__content" v-show="number === 7">
            <p class="layout-content-heading__info" id='pages-explanations'>
                {{$t('audit.basicAuth.explanation')}}</p>
        </div>
    </header>
</template>

<script>
    export default{
        name: 'auditFormSectionHeader',
        props: ['title', 'number']
    }
</script>

<style lang="scss" scoped>
    // General layout for each section
    $width-aside: 9.6rem; //
    $mgb-size-mobile: 3.2rem; // padding-bottom after each layout-content block
    $mgb-size-desktop: 5rem; // padding-bottom after each layout-content block

    .layout-header {
        position: relative;
        padding-bottom: 3.2rem;

        @media #{$media-md-viewport} {
            padding-bottom: 4rem;
        }

        &::after {
            @media #{$media-md-viewport} {
                display: block;
                position: absolute;
                top: 0;
                left: calc(#{$width-aside} / 2);
                width: .1rem;
                height: 100%;
                transform: translateX(-50%);
                border-left: 2px dashed $border-secondary;
                content: "";
                z-index: -1;
            }
        }

        .layout-header__content {
            @media #{$media-md-viewport} {
                margin-left: $width-aside;
            }

            p {
                margin-bottom: 0;

                @media #{$media-md-viewport} {
                    margin: 0;
                }
            }
        }
    }

    .layout-title {
        display: flex;
        margin: 0;
        align-items: center;

        .layout-title__number {
            flex: 0 0 3.2rem;

            @media #{$media-md-viewport} {
                flex: 0 0 $width-aside;
            }
        }
    }

    .layout-title-number {
        display: block;
        width: 3.2rem;
        height: 3.2rem;
        margin-right: .8rem;
        border-radius: 50%;
        background-color: $text-secondary;
        color: $color-white;
        font-family: $font-stack-secondary;
        font-size: $medium-font-size;
        font-weight: 600;
        line-height: 3.2rem; // sass-lint:disable-line property-unit
        text-align: center;

        @media #{$media-md-viewport} {
            margin-right: 0;
            margin-left: 50%;
            width: 4.8rem;
            height: 4.8rem;
            transform: translateX(-50%);
            line-height: 4.8rem; // sass-lint:disable-line property-unit
        }
    }

    .layout-title-text {
        .small {
            font-size: $base-font-size;
        }
    }
</style>
