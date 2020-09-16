<template>
    <div role="list" v-if="reference.children">
        <div role="listitem"
                v-for="child of reference.children"
                :key="child.id">
            <test-hierarchy-detail
                v-if="childrenResult[child.id]"
                :test-hierarchy="child"
                :reference="reference"
                :sharecode="sharecode"
                :tag-filters="tagFilters"
                :page-content="pageContent"
                :test-by-id="testById"
                :test-hierarchy-result="childrenResult[child.id]"
                :rank="0"/>
        </div>
    </div>
</template>

<script>
    import TestHierarchyDetail from "./TestHierarchyDetail";
    export default {
        name: 'pageResultRepositoryView',
        components: {TestHierarchyDetail},
        props: ['testHierarchyResult', 'tagFilters', 'testById', 'reference', 'pageContent', 'sharecode'],
        data(){
            return {
                childrenResult: {}
            }
        },
        created() {
            this.testHierarchyResultService.findByParent(
                this.testHierarchyResult.id,
                this.sharecode,
                (children) =>{
                    this.$set(this.testHierarchyResult, 'children', children)
                    for(const child of children){
                        this.$set(this.childrenResult, child.testHierarchy.id, child)
                    }
                },
                (error) => {
                    console.error(error)
                }
            )
        }
    }
</script>

<style lang="scss" scoped>

</style>
