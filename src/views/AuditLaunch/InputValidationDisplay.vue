<template>
    <div>
        <icon-base-decorative v-if="value">
            <icon-checked/>
        </icon-base-decorative>

        <icon-base-decorative v-else>
            <icon-unchecked/>
        </icon-base-decorative>
    </div>
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative';
import IconChecked from '../../components/icons/IconChecked';
import IconUnchecked from '../../components/icons/IconUnchecked';

export default {
    name: 'input-validation-display',
    props: ['value'],
    components: {
        IconBaseDecorative,
        IconChecked,
        IconUnchecked
    }
}
</script>

<style lang="scss" scoped>
svg {
	margin-top: .3rem;
    margin-left: 50%;
    transform: translateX(-50%);
}
</style>
