<template>
  <header class="header">
    <div class="headerLeft">
        <img :src="logoPath" @click="goHome">
    </div>
    <TheNavigator/>
    <div class="headerRight">
      <span @click="logout"><a><strong>LOGOUT</strong></a></span>
      <span><strong>User : </strong> {{ username }}</span>
    </div>
  </header>
</template>


<script>
import TheNavigator from '@/components/TheNavigator';

export default {
    name: 'TheHeader',
    data (){
        return {
            username: '',
            role: '',
            logoPath: require('@/assets/logo.png'),
        }
    },
    created(){
        this.init();
    },
    methods: {
        init: async function() {
            const payload = await this.$store.dispatch("getClaims");
            if(payload !== null){
              this.username = payload.username;
            }    
        },
        goHome: function(){
            if(this.$route.path !== '/home'){
                this.$router.push("/home");
            }
        },
        logout: async function(){
          await this.$store.dispatch('logout');
          this.$router.push('/');
        }
    },
    components: {
      TheNavigator,
    }
  }
</script>




<style>
.header {
  background-color: #748a9de7;
  display: flex;
  max-height: 10vh;
  position: fixed;
  top: 0;
  z-index: 5;
  width: 100%;
  align-items: center;
}

.headerLeft {
  width: 5%;
}

.headerLeft img {
    height: 10vh;
    width: auto;
}

.headerRight {
  width: 30%;
  text-align: end;
}

.headerRight span {
  margin-right: 1vw;
  cursor: pointer;
}

</style>