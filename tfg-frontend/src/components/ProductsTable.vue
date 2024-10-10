<template>
    <div class="myTable">
        <div class="tableOptions">
            <MySearcher @searchInput="search" />
            <div class="w-25 d-flex flex-row">
                <select class="form-select w-75 mr-4" v-model="selected">
                    <option value="code" selected>ordering by code</option>
                    <option value="name">ordering by name</option>
                    <option value="description" selected>ordering by description</option>
                    <option value="stock" selected>ordering by stock</option>
                </select>
                <button type="button" @click="showModifyModal" class="btn btn-secondary w-25" v-if="canModify">
                    <span>Create <b-icon icon="plus" animation="fade" /></span>
                </button>
            </div>
        </div>

        <div class="productsContainer mt-5">
            <div class="productContainer card" v-bind:key="p.id" v-for="p in searchProducts"
                @click="showProductModal(p)">
                <img class="flex-item" :src="p.image_url" />
                <h3 class="productName flex-item">{{ p.name }}</h3>
                <p class="flex-item productDesc">STOCK: <span :class="{lowStock: p.stock <= 10}">{{ p.stock }}</span> <br> {{ p.description }}</p>
            </div>
        </div>



        <b-modal ref="product-modal" size="xl" centered hide-footer hide-header>
            <ProductModal @back="hideProductModal" @reload="loadProducts" @refresh="showProductModal"
                :selectedProduct="selectedProduct" :selectedProperties="selectedProperties" />
        </b-modal>


        <b-modal centered ref="my-modal" hide-footer hide-header>
            <h2 class="text-center">Add Product</h2>
            <div class="container m-1">
                <b-form-group class="flex-item" id="fieldset-1" label="code:" label-for="input-1">
                    <b-form-input id="input-1" v-model="selectedProduct.code" :state="inputRequired('code')" trim />
                    <b-form-invalid-feedback id="input-live-feedback1">
                        This field is obbligatory.
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group class="flex-item " id="fieldset-1" label="name:" label-for="input-1">
                    <b-form-input id="input-1" v-model="selectedProduct.name" :state="inputRequired('name')" trim />
                    <b-form-invalid-feedback id="input-live-feedback2">
                        This field is obbligatory.
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group class="flex-item" id="fieldset-1" label="description:" label-for="input-1">
                    <b-form-input id="input-1" v-model="selectedProduct.description" trim />
                </b-form-group>
                <b-form-group class="flex-item" id="fieldset-1" label="stock:" label-for="input-1">
                    <b-form-input id="input-1" v-model="selectedProduct.stock" trim />
                </b-form-group>
                <b-form-group class="flex-item" id="fieldset-1" label="image_url:" label-for="input-1">
                    <b-form-input id="input-1" v-model="selectedProduct.image_url" trim />
                </b-form-group>
            </div>
            <div class="d-flex justify-content-around">
                <b-button class="mt-3" variant="outline-danger" block @click="hideModifyModal">close</b-button>
                <b-button class="mt-3" variant="outline-success" block @click="addProduct">add</b-button>
            </div>
        </b-modal>
    </div>
</template>


<script>
import MySearcher from './MySearcher.vue';
import ProductModal from './ProductModal.vue';

export default {
    name: 'ProductsTable',
    data() {
        return {
            products: [],
            tablefields: ["code", "name", "description", "stock"],
            searchInput: "",
            selected: "code",
            selectedProduct: {
                id: "",
                name: "",
                code: "",
                description: "",
                stock: 0,
                image_url: "",
                tags: "",
                properties: ""
            },
            selectedProperties: [],
            canModify: true,
        }
    },
    async created() {
        await this.loadProducts();
        const payload = await this.$store.dispatch('getClaims');
        if ('guest'.localeCompare(payload.role) === 0) {
            this.canModify = false;
        }
    },
    computed: {
        searchProducts() {
            var filteredProducts = []
            this.products.forEach(p => {
                if (p.code.includes(this.searchInput) || p.name.includes(this.searchInput) ||
                    p.description.includes(this.searchInput) || p.tags.includes(this.searchInput ||
                        p.properties.includes(this.searchInput))) {
                    filteredProducts.push(p);
                }
            });

            filteredProducts.sort((a, b) => { return (a[this.selected] > b[this.selected]) ? 1 : (a[this.selected] < b[this.selected]) ? -1 : 0; });

            return filteredProducts;
        }
    },
    methods: {
        search: async function (searchInput) {
            this.searchInput = searchInput;
        },
        loadProducts: async function () {
            const token = await this.$store.dispatch("getToken");
            const products = await this.$store.dispatch("loadProducts", token);
            this.$store.commit('setProducts', { products });
            this.products = this.$store.getters.getProducts.products;
        },
        showModifyModal: async function () {
            this.selectedProduct = {
                id: "",
                code: "",
                name: "",
                description: "",
                stock: 0,
                image_url: "",
                tags: "",
                properties: ""
            }
            this.$refs['my-modal'].show();
        },
        hideModifyModal: async function () {
            this.$refs['my-modal'].hide();
        },
        addProduct: async function () {
            const token = await this.$store.dispatch("getToken");
            const product = {
                code: this.selectedProduct.code,
                name: this.selectedProduct.name,
                description: this.selectedProduct.description,
                stock: parseInt(this.selectedProduct.stock),
                image_url: this.selectedProduct.image_url,
                token: token
            }

            if (product.name != "" && product.code != "") {
                await this.$store.dispatch("addProduct", product);
                await this.hideModifyModal();
                await this.loadProducts();
            }

        },
        showProductModal: async function (item) {
            this.selectedProduct = this.products.find(product => product.id == item.id);
            this.selectedProperties = [];
            if (this.selectedProduct.property_names != null) {
                const propertyNames = JSON.parse(this.selectedProduct.property_names);
                const propertyValues = JSON.parse(this.selectedProduct.property_values);
                for (var i = 0; i < propertyNames.length; i++) {
                    var obj = {
                        propertyName: propertyNames[i],
                        propertyValue: propertyValues[i],
                        delete: undefined,
                    }
                    this.selectedProperties.push(obj);
                }
            }
            this.$refs['product-modal'].show();
        },
        hideProductModal: async function () {
            this.$refs['product-modal'].hide();
            this.editable = false;
        },
        inputRequired: function (property) {
            return this.selectedProduct[property].length > 0 ? true : false;
        }
    },
    components: {
        MySearcher,
        ProductModal
    }
}
</script>

<style>
.myTable {
    display: block;
    margin: 5vh 4vw;
    padding: 5vh 2vw;
    background-color: whitesmoke;
    border-radius: 20px;
}

.tableOptions {
    height: 5vh;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin: 1vh;
    justify-content: space-between;
}

.productContainer {
    width: 16vw;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding-bottom: 4vh;
}

.productsContainer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 1vw;

}

.productContainer img {
    height: 30vh;
    border: 1px rgb(235, 234, 234) solid;
    border-radius: 5px;
}

.productContainer:hover {
    border: 1px grey solid;
}

b-modal {
    width: auto;
}

.productName {
    margin-top: 2vh;
    border-bottom: 1px grey solid;
}

.productDesc {
    text-align: start;
    height: 3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.addButton {
    position: fixed;
    bottom: 5vh;
    right: 2vw;
    background-color: #e342f1d3;
    border-radius: 20px;
}

.addButton:hover {
    background-color: var(--neutral-dark);
}

.lowStock {
    color: red;
}
</style>