<template>
<div>
    <section>
        <p class="has-text-centered is-italic" style="margin: 50px auto 30px auto;">Please select a client to view and create their daily digests</p>
            <div class="columns is-mobile is-multiline is-centered">
            <router-link class="column is-4 is-narrow is-one-third-widescreen is-half-tablet is-three-quarters-mobile" v-for="client in clients" :key="client.code" :to="{ name:client.category.toLowerCase(), params: {active_client: client.code}}">
                <div class="digest-client-card">
                    <div class="digest-client-logo-container">
                        <img :src="`/images/${client.code}.png`"/>
                    </div>
                    <div class="digest-client-details" style="text-align:center;">
                        <feather class="right-icon is-pulled-right" type="chevron-right" style="margin-top: 8px;"/>
                        <p class="client-code is-size-6">{{ client.code }}</p>
                        <p class="client-name">{{ client.description }}</p>
                    </div>
                </div>
            </router-link>
        </div>
    </section>
</div>

</template>


<script>
export default {
   data() {
       return {
            clients: [
                {
                    code: "EWB",
                    description: "Eastwest Bank",
                    category: "SOC"
                },
                {
                    code: "IL",
                    description: "Insular Life",
                    category: "SOC"
                },
                {
                    code: "BOC",
                    description: "Bank of Commerce",
                    category: "SOC"
                },
                {
                    code: "DBP",
                    description: "Development Bank of PH",
                    category: "SOC"
                },
                {
                    code: "UBP",
                    description: "UnionBank of the PH",
                    category: "NOC"
                }
            ]
       }
   }
}
</script>


<style scoped>
/* digest */
.digest-client-card {
    background-color: white; 
    border-radius: 20px;
    transition: 0.3s;
}

.digest-client-card:hover {
    box-shadow: 0px 3px 6px #00000080;
}

.digest-client-logo-container {
    display: flex; 
    height: 130px; 
    padding: 15px;    
}

img {
    max-height: 80px; 
    height: auto; 
    margin: auto; 
    max-width: 230px
}

.digest-client-details {
    text-align: center; 
    background-color: #003944;
    border-radius: 0 0 10px 10px;
    padding: 10px; 
    color: white; 
    letter-spacing: 1px;
    text-transform: uppercase;
}

.right-icon {
    float: right; 
    top: 10px; 
    position: relative;
}

.client-code {
    margin-left: 24px;
    font-weight: bold;
}

.client-name {
    font-size: 8pt;
    margin-left: 24px;
}
</style>