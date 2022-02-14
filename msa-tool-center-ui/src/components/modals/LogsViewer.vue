<template>
<div class="modal-card" style="overflow: visible;">
    <header class="modal-card-head has-background-primary">
        <p class="modal-card-title has-text-white is-size-5">{{ obj.subject }}</p>
    </header>
   
   <section class="modal-card-body asset-modal">
       <json-viewer
        :value="obj.metadata"
        :expand-depth=5
        copyable
        boxed
        sort></json-viewer>
   </section>
    
    <footer class="modal-card-foot custom">
        <div class="buttons is-pulled-right">
            <button class="button" type="button" @click="$parent.close()">Close</button>
        </div>
    </footer>
   
</div>
    
</template>

<script>
export default {
    props:['obj']
}
</script>


<style scoped>
.buttonEdit {
    background-color: #fff;
    border-color: #dbdbdb;
    border-width: 1px;
    color: #363636;
    cursor: pointer;
    -webkit-box-pack: center;
    justify-content: center;
    padding: calc(.5em - 1px) 1em;
    text-align: center;
    white-space: nowrap;
}
.buttonEdit:hover {
    border-color: #b5b5b5;
    color: #363636;
}

.asset-details table.edit-details{
    width: 100%; 
    padding-top: 12px;
    padding: 5px;
    border-bottom: 0.5px solid white !important;

}
.tdStyle {
    text-align: right;
    font-weight: 500;
    font-size: 10pt;
    color: #1f6d61;
    width: 200px;
    text-transform: uppercase;
    padding: 5px 20px 0px 0;
    border-bottom: 0.5px solid white;
}

.has-background-primary {
  background-color: #00d1b2 !important;
}

</style>