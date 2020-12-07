<template>
    <div class="test-hierarchy-overview">
        <p>{{testHierarchy.code}} - {{testHierarchy.name}}</p>
        <div class="test-container" v-if="testsByTestHierarchyCode[testHierarchy.code]">
            <p v-for="test of testsByTestHierarchyCode[testHierarchy.code]">{{test.name}}</p>
        </div>
        <div class="children-container">
            <test-hierarchy-json-overview v-for="child of testHierarchy.children" :key="child.code" :test-hierarchy="child" :tests-by-test-hierarchy-code="testsByTestHierarchyCode"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'test-hierarchy-json-overview',
        props: ['testHierarchy', 'testsByTestHierarchyCode'],
        date(){
            return {

            }
        }
    }
</script>

<style lang="scss">
.children-container{
    margin-left: 25px;
}

.test-container{
    border: black dotted 1px;
    padding: 0 15px;
}
</style>