<template>
<div style="overflow: visible; width: auto; height: 640px; max-height: 785px">    
    <section>
        <div style="height: 540px; width: 960px;">
            <new-scheduled-template :data="{ ...data }" :margin_left="'0px'" :title="data.header.a" :type="data.type"/>
        </div>
    </section>
</div>
</template>

<script>
import newScheduledTemplate from '../templates/advisory/New'

export default {
    props: ['data'],
    components: {
        newScheduledTemplate
    },
    data() {
        return {
            isBusy: false,
            image: null
        }
    },
    watch: {
    },
    created() {
        
    },
    computed: {
    },
    methods: {
    }
}
</script>
<style lang="scss">
.actions-checkbox {
    .b-checkbox.checkbox {
        width: 100%;
        margin-bottom: 5px;
        align-items: end;
    }
}
</style>

<style lang="scss" scoped>

.dropdown-box {
    text-align: left;
    div, button {
        width: 350px;

        .icon {
            display: flex;
            flex: auto;
            justify-content: flex-end;
        }
    }
}
</style>