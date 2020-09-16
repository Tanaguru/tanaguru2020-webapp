<template>
    <div class="file-upload form-block">
        <label>
            <span>{{label}}</span>
            <input name="file-uploader" type="file" :accept="format" @change="loadFileData" :required="required" />
        </label>
    </div>
</template>

<script>
export default {
    name: 'file-upload',
    props: ['label', 'required', 'format'],
    data() {
        return {
            loaded: false
        }
    },
    methods: {
        loadFileData(ev) {
            const file = ev.target.files[0];
            const reader = new FileReader();

            reader.onload = e => {
                this.loaded = true;
                this.$emit("load", e.target.result);
            }
            reader.readAsText(file);
        }
    },
}
</script>

<style scoped>
    span{
        display: block;
    }
</style>
