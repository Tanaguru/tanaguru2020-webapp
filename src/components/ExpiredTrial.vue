<template>
    <div class="wrapper expired-info">
        <p tabindex="0">{{ $t('global.expiredMessage') }}</p>
    </div>
</template>

<script>
export default {
    name: "ExpiredTrial",
    data() {
        return {
        }
    }
}
</script>

<style lang="scss" scoped>
.expired-info {
    background-color: #A0B4C8;
    padding: 1rem;
}
</style>