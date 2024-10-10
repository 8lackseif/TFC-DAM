<template>
    <div class="productDetailsContainer">
        <h2 class="text-center">Product Details</h2>

        <div class="productInfoContainer">
            <div class="container flex-item m-1">
                <b-form-group class="flex-item" id="fieldset-1" label="code:" label-for="input-1">
                    <b-form-input id="input-1" v-model="copySelectedProduct.code" trim :disabled="editable"
                        :state="inputRequired('code')" />
                    <b-form-invalid-feedback id="input-live-feedback1">
                        This field is obbligatory.
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group class="flex-item " id="fieldset-2" label="name:" label-for="input-1">
                    <b-form-input id="input-1" v-model="copySelectedProduct.name" trim :disabled="editable"
                        :state="inputRequired('name')" />
                    <b-form-invalid-feedback id="input-live-feedback2">
                        This field is obbligatory.
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group class="flex-item" id="fieldset-3" label="description:" label-for="input-1">
                    <b-form-textarea id="input-1" v-model="copySelectedProduct.description" rows="3" max-rows="3"
                        :disabled="editable" />
                </b-form-group>
                <b-form-group class="flex-item" id="fieldset-4" label="image_url:" label-for="input-1">
                    <b-form-input id="input-1" v-model="copySelectedProduct.image_url" trim :disabled="editable" />
                </b-form-group>
            </div>
            <div class="flex-item">
                <h3 class="text-center">Tags</h3>
                <div class="tagSelect" v-if="!editable">
                    <v-select class="w-75" v-model="selectedTag" :options="tags" label="name" />
                    <b-button @click="bindTag">add</b-button>
                </div>
                <div class="tagsContainer">
                    <div class="tag" v-bind:key="t" v-for="(t, index) in getTags">
                        <p>{{ t }}</p>
                        <div class="cross" v-if="!editable" @click="unbindTag(index)">&#x2715;</div>
                    </div>
                </div>
            </div>
            <div class="flex-item properties">
                <h3 class="text-center">Properties</h3>
                <b-table class="text-start flex-item" sticky-header striped hover responsive
                    :items="copySelectedProperties" :fields="computedFields">
                    <template v-slot:cell(delete)="{ item }">
                        <span><b-btn @click="deleteProperty(item)">delete</b-btn></span>
                    </template>
                </b-table>
                <div class="input-group mb-3 w-75" v-if="!editable">
                    <b-input class="flex-item" v-model="newProperty.propertyName" trim />
                    <b-input class="flex-item" v-model="newProperty.propertyValue" trim />
                    <b-btn class="flex-item w-25" @click="addProperty">add</b-btn>
                </div>
            </div>
        </div>

        <div class="d-flex align-items-center justify-content-around" v-if="canModify">
            <b-button class="w-25" variant="outline-danger" block @click="deleteProduct"> delete </b-button>
            <b-button class="w-25" variant="outline-info" block @click="setModify"> {{ modifyText }}</b-button>
        </div>

    </div>
</template>

<script>

export default {
    props: {
        selectedProduct: {
            type: Object,
            required: true
        },
        selectedProperties: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            editable: true,
            canModify: true,
            modifyText: "Modify",
            fields: [
                { key: 'propertyName', label: 'Property Name' },
                { key: 'propertyValue', label: 'Property Value' },
                { key: 'delete', label: 'actions', requiresModifyMode: true },
            ],
            newProperty: {},
            copySelectedProduct: { ...this.selectedProduct },
            copySelectedProperties: [...this.selectedProperties],
            product_tags: [],
            tags: [],
            selectedTag: "",
        }
    },
    async created() {
        const payload = await this.$store.dispatch('getClaims');
        if ('guest'.localeCompare(payload.role) === 0) {
            this.canModify = false;
        }

        this.product_tags = JSON.parse(this.copySelectedProduct.tags);
        this.product_tags = this.product_tags.filter(tag => tag != "");
        this.tags = await this.$store.dispatch('getTags');
    },
    methods: {
        changeEditable: async function () {
            this.editable = !this.editable;
        },
        deleteProduct: async function () {
            if (confirm("do you want to delete " + this.selectedProduct.name + " from your list?")) {
                const token = await this.$store.dispatch('getToken');
                const obj = {
                    token: token,
                    id: this.selectedProduct.id
                }
                const response = await this.$store.dispatch('deleteProduct', obj);
                if (response.status == 200) {
                    await this.$emit('reload');
                    await this.$emit('back');
                }
                else {
                    this.$bvToast.toast('error when deleting product', {
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
        setModify: async function () {
            this.editable = !this.editable;
            if (this.modifyText === "Modify") {
                this.newProperty = {
                    propertyName: undefined,
                    propertyValue: undefined
                }
                this.modifyText = "Save";
            }
            else {
                this.modifyText = "Modify";
                if (JSON.stringify(this.copySelectedProduct) != JSON.stringify(this.selectedProduct)) {
                    const token = await this.$store.dispatch('getToken');
                    const product = {
                        id: this.copySelectedProduct.id,
                        code: this.copySelectedProduct.code,
                        name: this.copySelectedProduct.name,
                        description: this.copySelectedProduct.description,
                        image_url: this.copySelectedProduct.image_url,
                        token: token
                    }
                    const response = await this.$store.dispatch("modifyProduct", product);
                    if (response.status == 200) {
                        this.$bvToast.toast('changes saved', {
                            title: 'success',
                            autoHideDelay: 5000,
                            appendToast: true,
                            variant: "success",
                            solid: true,
                            toaster: "b-toaster-bottom-right"
                        });
                    }
                    else {
                        this.$bvToast.toast(response.data, {
                            title: 'error ' + response.status,
                            autoHideDelay: 5000,
                            appendToast: true,
                            variant: "danger",
                            solid: true,
                            toaster: "b-toaster-bottom-right"
                        });
                    }

                    await this.$emit('reload');
                    await this.$emit('refresh', { id: this.selectedProduct.id });
                }
            }
        },
        deleteProperty: async function (item) {
            const token = await this.$store.dispatch('getToken');
            const property = {
                id: this.selectedProduct.id,
                property_name: item.propertyName,
                token: token
            }
            await this.$store.dispatch("deleteProperty", property);
            await this.$emit('reload');
            this.copySelectedProperties = this.selectedProperties.filter(property => property.propertyName != item.propertyName);
        },
        addProperty: async function () {
            const token = await this.$store.dispatch('getToken');
            const property = {
                id: this.selectedProduct.id,
                property_name: this.newProperty.propertyName,
                property_value: this.newProperty.propertyValue,
                token: token
            }
            await this.$store.dispatch("addProperty", property);
            await this.$emit('reload');
            this.copySelectedProperties.push(this.newProperty);
            this.newProperty = {
            }
        },
        inputRequired: function (property) {
            return this.copySelectedProduct[property].length > 0 ? true : false;
        },
        unbindTag: async function (index) {
            const query = {
                token: await this.$store.dispatch('getToken'),
                product_id: this.copySelectedProduct.id,
                name: this.product_tags[index]
            }
            await this.$store.dispatch("unbindTag", query);
            this.product_tags.splice(index, 1);
            await this.$emit('reload');
        },
        bindTag: async function () {
            const query = {
                token: await this.$store.dispatch('getToken'),
                product_id: this.copySelectedProduct.id,
                name: this.selectedTag.name
            }
            await this.$store.dispatch("bindTag", query);
            this.product_tags.push(this.selectedTag.name);
            await this.$emit('reload');
        }
    },
    computed: {
        computedFields() {
            if (this.editable) {
                return this.fields.filter(field => !field.requiresModifyMode);

            }
            else {
                return this.fields;
            }
        },
        getTags() {
            return this.product_tags;
        }
    }

}
</script>

<style>
.productDetailsContainer {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
}

.productInfoContainer {
    display: flex;
    flex-wrap: nowrap;
    gap: 1vw;
}

.tagsContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1vw;
}

.tag {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.2vw;
    height: 3vh;
    padding: 0.2vh 0.5vw;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.137);
    justify-content: center;
    background-color: rgb(225, 226, 226);
}

.tag>.cross {
    color: rgb(70, 70, 70);
}

.tag>.cross:hover {
    color: red;
    cursor: pointer;
}

.properties {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.tagSelect {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 2vh;
    gap: 0.2vw;
}
</style>