<template>
    <div>
        <TheHeader />
        <div class="migrationPage">
            <div class="migrationContainer">
                <b-button @click="downloadData()">Export Data</b-button>
                <div class="importContainer">
                    <p>Select JSON file:</p>
                    <input v-on:change="handleFileUpload($event)" type="file" />
                    <div class="fileContentContainer">
                        <pre lang="json">{{ jsonHTML }}</pre>
                    </div>
                    <b-button @click="importData()">Import Data</b-button>
                </div>
            </div>
        </div>
        <TheFooter />
    </div>
</template>


<script>
import TheHeader from '@/components/TheHeader';
import TheFooter from '@/components/TheFooter';

export default {
    name: 'MigrationPage',
    data() {
        return {
            fileContent: "",
            jsonHTML: "",
            meta: [
                { charset: 'utf-8' },
                { equiv: 'Content-Type', content: 'text/html' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }

            ],
            toastType: "danger"
        }
    },
    async created() {
        const token = await this.$store.dispatch('getToken');
        if (token === null) {
            this.$router.push('/');
        }
        else {
            const payload = await this.$store.dispatch("getClaims");
            if ("1".localeCompare(payload.first_login) == 0) {
                this.$router.push('/reset_pwd');
            }
        }
    },
    methods: {
        downloadData: async function () {
            let data = await this.$store.dispatch("exportData");
            data.products.forEach(product => {
                product.properties = JSON.parse(product.properties);
                product.tags = JSON.parse(product.tags);
                product.stock_var = JSON.parse(product.stock_var);
            });
            const file = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file);
            a.download = "data.json";
            a.click();
        },
        handleFileUpload: async function (e) {
            let reader = new FileReader();
            reader.onload = e => {
                let json = JSON.parse(e.target.result);
                this.fileContent = json;
                this.jsonHTML = JSON.stringify(json, undefined, 2);
            };
            let files = e.target.files || e.dataTranfer.files;
            if (!files.length) {
                this.fileContent = "No File";
            }
            reader.readAsText(files[0], "utf-8");
        },
        importData: async function () {
            let data = {
                token: await this.$store.dispatch("getToken"),
                products: this.fileContent.products,
                users: this.fileContent.users
            }
            let response = await this.$store.dispatch("importData", data);

            if (response.status == 200) {
                this.jsonHTML = "";
                this.fileContent = "";
                alert("Data imported successfully.");
            }
            else {
                console.log(response);
                this.$bvToast.toast('error when importing data, check json format.', {
                    title: 'error ' + response.status,
                    autoHideDelay: 5000,
                    appendToast: true,
                    variant: "danger",
                    solid: true,
                    toaster: "b-toaster-bottom-right"
                })
            }
        }
    },
    components: {
        TheFooter,
        TheHeader,
    }
}
</script>

<style>
.migrationPage {
    min-height: 100vh;
}

.migrationContainer {
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    margin: 3vh 5%;
}

.importContainer {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin: 5vh 0;
    gap: 0.5vw;
}

.fileContentContainer {
    width: 100%;
    border: solid black 1px;
    margin: 3vh 0;
    padding: 2vh 2vw;
    background-color: rgb(58, 57, 57);
    text-align: start;
    overflow: scroll;
    max-height: 50vh;
}

.fileContentContainer pre {
    color: rgb(217, 248, 248);
}
</style>