<!-- From : https://fr.vuejs.org/v2/cookbook/editable-svg-icons.html -->

<template>
	<svg xmlns="http://www.w3.org/2000/svg"
		 :width="width"
		 :height="height"
		 viewBox="0 0 24 24"
		 aria-hidden="true"
		 focusable="false"
	>
		<slot/>
	</svg>
</template>

<script>
export default {
	name: 'iconBaseDecorative',
	props: {
		width: {
			type: [Number, String],
			default: 24
		},
		height: {
			type: [Number, String],
			default: 24
		},
	},
	computed: {
		viewBox() {
			return '0 0 ' + this.width + ' ' + this.height
		}
	}
}
</script>
