<template>
<div>
    <div class="modal-card" style="overflow: visible; width: 1250px; height: calc(100vh - 40px);">
        <header class="modal-card-head has-background-primary">
            <p class="modal-card-title has-text-white is-size-5 is-capitalized">{{ sharepointAppFile.Name }}</p>
        </header>
        <section class="modal-card-body">
            <iframe :src="$parent.$parent.sharepointBlobUrl+'#toolbar=0'" height="100%" width="100%" allowfullscreen="true"></iframe>
            <!-- <VueDocPreview :value="'https://gracefhp.com/back-end/public/img/logos/ToolCenterDocumentation.docx'" type="office" /> -->
            <!-- <VueDocPreview :value="$parent.$parent.sharepointBlobUrl" type="office" /> -->
        </section>
    </div>
</div>
</template>

<script>

    export default {
        name: 'viewSharepointFile',
        data() {
            return {
                sharepointAppBaseUrl: 'https://tthiholdings.sharepoint.com',
                sharepointAppFile: {}
            }
        },
        mounted() {
            this.fetchFile();
        },
        methods: {
            fetchFile: async function() {
                this.sharepointAppFile = this.$parent.$parent.selectedSharepointAppFile;
            }
        }
    }
</script>
