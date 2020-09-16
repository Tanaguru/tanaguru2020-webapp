<template>
    <main class="wrapper" id="page" role="main">
            <adminContractList />
    </main>
</template>

<script>
import adminContractList from '../components/Admin/AdminContractList'

export default {
    name: 'Config',
    components : {
        adminContractList
    },
    data(){
        return {
        }
	},
	metaInfo(){
		return {
			// if no subcomponents specify a metaInfo.title, this title will be used
			title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.configuration"),
			meta: [
				{
					name: 'robots', content: 'noindex'
				}
			]
		}
	},
	created(){
		if(this.$store.state.user.appRole.name != 'USER'){
			this.$router.replace('/administration')
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	position: relative;
}

// General layout for each section
$width-aside: 9.6rem; //
$mgb-size: 5rem; // padding-bottom after each layout-content block

.layout-content {
	display: flex;

	&:not(:last-child) {
		margin-bottom: $mgb-size;

		.layout-content__aside {
			position: relative;

			&::after {
				display: block;
				position: absolute;
				top: 0;
				left: 50%;
				width: .1rem;
				height: calc(100% + #{$mgb-size});
				transform: translateX(-50%);
				border-left: 2px dashed $border-secondary;
				content: "";
				z-index: -1;
			}
		}
	}

	.layout-content__aside {
		flex: 0 0 $width-aside;

		svg {
			margin-left: 50%;
			transform: translateX(-50%);
		}
	}

	.layout-content__main {
		flex: 1 1 auto;
	}
}

// Custom radio buttons
.radio-custom {
	padding: 0;
	border: 0;

	.radio-custom__legend {
		margin-bottom: 1.6rem;
		color: $text-secondary;
		font-weight: 600;
	}

	.radio-custom__wrapper {
		@media #{$media-xs-viewport} {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}
	}
}

.radio-custom-input {
	position: absolute;
	opacity: 0;

	&:hover + .radio-custom-label {
		background-color: rgba($border-secondary, .5);
	}

	&:focus + .radio-custom-label {
		background-color: $border-secondary;
	}

	& + .radio-custom-label {
		&::after {
			content: none;
		}
	}

	&:checked + .radio-custom-label {
		&::after {
			content: url("#{$img-path}checked.svg");
		}
	}
}

.radio-custom-label {
	display: block;
	position: relative;
	margin-bottom: 3rem;
	padding: 4rem 2rem 3.2rem;
	background-color: $bg-primary;
	color: $text-secondary;
	text-align: center;
	box-shadow: 0 2px 16px 0 rgba(5, 90, 127, .1);

	@media #{$media-xs-viewport} {
		flex: 0 1 48%;
	}

	@media #{$media-md-viewport} {
		flex: 0 1 21.875%;
		margin-bottom: 0;
	}

	&::after {
		position: absolute;
		bottom: -2rem;
		left: -2rem;
		width: 4rem;
		height: 4rem;
	}

	.radio-custom-label__icon {
		display: block;
		margin: 0 auto 1rem;
	}

	.radio-custom-label__text {
		font-size: $medium-font-size;
		font-weight: 600;
	}
}

.radio-addition {
	margin: 3.2rem 0;
	padding: 0;
	border: 0;

	.radio {
		display: inline-block;

		&:not(:last-child) {
			margin-right: 9.6rem;
		}
	}
}


</style>
