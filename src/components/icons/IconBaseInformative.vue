<!-- From : https://fr.vuejs.org/v2/cookbook/editable-svg-icons.html -->

<template>
	<svg xmlns="http://www.w3.org/2000/svg"
		:width="width"
		:height="height"
		:aria-label="iconLabel"
		viewBox="0 0 24 24"
		role="img"
  	>
	  	<title>{{ iconLabel }}</title>
		<slot />
  	</svg>
</template>

<script>
	export default {
  props: {
	iconLabel: {
      type: String,
      default: 'Nom accessible du svg'
    },
    width: {
      type: [Number, String],
      default: 24
    },
    height: {
      type: [Number, String],
      default: 24
    },
  }
}
</script>
