<template>
    <div>
		<ul class="tabs">
			<li v-for="(tab, i) in tabs" :key="i" class="tabs__item">
				<button
					class="btn tabs__btn"
					:class="{ 'is-active': tab.isActive }"
					@click="selectTab(i)"
				>
				{{ tab.name }}
				</button>
			</li>
		</ul>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        data: () => {
            return {
                selectedIndex: 0,
                tabs: []
            }
        },
        methods: {
            selectTab(i) {
                this.selectedIndex = i
                this.tabs.forEach((tab, index) => {
                    tab.isActive = (index === i)
                });
                this.$emit('activeTab', this.selectedIndex)
            }
        },
        created() {
            this.tabs = this.$children;
        },
        mounted(){
            this.selectTab(0)
        }
    }
</script>
