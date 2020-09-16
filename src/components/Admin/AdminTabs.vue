<template>
    <div>
		<ul class="tabs">
			<li v-for="(tab, index) in tabs" :key="index" class="tabs__item">
				<button
					class="btn tabs__btn"
					:class="{ 'is-active': tab.isActive }"
					@click="selectTab(tab)"
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
                tabs: []
            }
        },
        methods: {
            selectTab(selectedTab) {
                this.tabs.forEach(tab => {
                    tab.isActive = tab.name === selectedTab.name;
                });
            }
        },
        created() {
			this.tabs = this.$children;
        }
    }
</script>
