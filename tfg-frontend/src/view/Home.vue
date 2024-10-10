<template>
    <div>
        <TheHeader/>
        <div id="HomePage">
          <ProductsTable />
        </div>
        <TheFooter/>
    </div>
</template>


<script>
import TheHeader from '@/components/TheHeader';
import TheFooter from '@/components/TheFooter';
import ProductsTable from '@/components/ProductsTable';

export default {
    name: 'Home_page',
    data() {
      return {
      }
    },
    created(){
      this.init();
    },
    methods: {
      init: async function() {
        const token = await this.$store.dispatch('getToken');
        if( token === null){
        this.$router.push('/');
        }
        else{
          const payload = await this.$store.dispatch("getClaims");
          if("1".localeCompare(payload.first_login) == 0){
            this.$router.push('/reset_pwd');
          }
          if("administrator".localeCompare(payload.role) == 0){
            this.isAdmin = true;
          }
        }
      }

    },
    components:{
      TheHeader,
      TheFooter,
      ProductsTable,
    }
  }

</script>

<style>
  #HomePage {
      min-height: 100vh;
  }

</style>
