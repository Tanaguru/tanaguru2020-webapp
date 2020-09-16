<template>
	<div class="rotate__inner" @mouseover="openTooltip" @mouseleave="closeTooltip" :aria-controls="'page-' + i+1 + '-name'" :aria-expanded="tooltipOpen">
		<span class="page">
			<span class="page__number">Page n°{{currentSynthesisPage * 10 + i + 1 }} -</span>

			<span class="page__name">{{ page.name }}</span>
		</span>

		<p
			:id="'page-' + i+1 + '-name'"
			class="tooltip-name"
			role="tooltip"
			v-show="tooltipOpen"
		>
			{{ page.name }}
		</p>
	</div>
</template>

<script>
export default {
  name: 'HeaderRow',
  props: [ 'page', 'i', 'currentSynthesisPage' ],
  data(){
      return {
        tooltipOpen: false,
      }
  },
  methods: {
      openTooltip(i){
          this.tooltipOpen = true
      },
      closeTooltip(i){
          this.tooltipOpen = false
      }
  }
}
</script>
