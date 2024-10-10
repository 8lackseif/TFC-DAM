<template>
    <div class="input-group mb-3 w-25"> 
        <input v-model="searchInput" type="text" class="form-control" placeholder="search ..."/>
        <button @click="sendSearchInput" class="btn btn-secondary">
            <b-icon icon="Search"/>
        </button>
    </div>
</template>


<script>

export default {
    name: 'MySearcher',
    data (){
        return {
            searchInput: '',
        }
    },
    created(){
    },
    methods: {
        sendSearchInput: async function(){
            this.$emit('searchInput', this.searchInput );
        }
    }
  }
</script>

<style>
</style>