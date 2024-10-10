<template>
  <div>
    <TheHeader />
    <main class="stockPage">
      <div v-if="editable" class="stockModify">
        <div class="stockForm">
          <v-select class="flex-item" v-model="selectedProduct" :options="products" label="name" />
          <b-form-group class="flex-item" id="fieldset-1" label="Quantity:" label-for="input-1">
            <div class="input-group mb-3">
              <select class="form-select w-50" v-model="selectedSign">
                <option value="1">Add</option>
                <option value="0">Substract</option>
              </select>
              <input type="text" class="form-control w-50" v-model="quantity" />
            </div>
          </b-form-group>
          <b-button class="flex-item" @click="addStock">Add to Stock Table</b-button>
        </div>
        <div class="stockContainer ml-5">
          <div class="stockDataContainer">
            <div class="stockData" v-for="(s, index) in getStocks" v-bind:key="index">
              <p> Product: {{ s.name }}<br>Quantity: {{ s.quantity }}</p>
              <div class="cross" @click="deleteStock(index)">&#x2715;</div>
            </div>
          </div>
          <div class="stockTrigger">
            <b-button class="flex-item" @click="changeStock">Change Stock</b-button>
          </div>
        </div>
      </div>
      <div class="separator"></div>
      <div class="chartStock">
        <h3 class="mb-5">Stock Variation History</h3>
        <v-select v-model="selectedProductChart" :options="products" label="name"
          @option:selected="getChartDatas(selectedProductChart.id)" />
        <LineChartGenerator id="my-chart" :options="getChartOptions" :data="getChartData" />
      </div>
      <div class="separator"></div>
      <div class="w-100 mb-5">
        <h3 class="mb-5 mt-5">Stock Variation Log</h3>
        <b-table striped hover :items="getLastStocks" :fields="stockFields" class="w-75 m-auto" />
      </div>



    </main>
    <TheFooter />
  </div>
</template>


<script>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import { Line as LineChartGenerator } from 'vue-chartjs';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
)

export default {
  name: 'StockVar',
  data() {
    return {
      products: [],
      quantity: 0,
      selectedProduct: {
        id: "",
        code: "",
        name: "",
        description: "",
        stock: 0,
        image_url: "",
        tags: "",
        properties: ""
      },
      selectedProductChart: {

      },
      stocks: [],
      last_stocks_info: [],
      stockFields: ["product_id", "product_name", "date", "quantity"],
      chartData: {
        labels: [],
        datasets: [
          {
            label: '',
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true
      },
      selectedSign: '1',
      editable: true
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
      if ('guest'.localeCompare(payload.role) === 0) {
        this.editable = false;
      }
    }

    this.products = await this.$store.dispatch("loadProducts");
    this.last_stocks_info = await this.$store.dispatch("getStocks");
    this.selectedProductChart = this.products[0];
    await this.getChartDatas(this.selectedProductChart.id);
  },
  computed: {
    getStocks() {
      return this.stocks;
    },
    getLastStocks() {
      return this.last_stocks_info;
    },
    getChartData() {
      return this.chartData;
    },
    getChartOptions() {
      return this.chartOptions;
    }
  },
  methods: {
    addStock: async function () {
      var n = parseInt(this.quantity);

      if (this.selectedSign === '0') {
        n -= n * 2;
      }

      if (n != 0 && (this.selectedProduct.stock + n) >= 0) {
        const obj = {
          name: this.selectedProduct.name,
          product_id: this.selectedProduct.id,
          quantity: n
        }

        this.stocks.push(obj);
        this.selectedProduct = {};
        this.quantity = 0;
      }
    },
    deleteStock: async function (index) {
      this.stocks.splice(index, 1);
    },
    changeStock: async function () {
      let stocks = this.stocks.map(stock => {
        let newStock = { ...stock };
        delete newStock["name"];
        return newStock;
      });

      const obj = {
        token: await this.$store.dispatch('getToken'),
        stocks: stocks
      }

      const response = await this.$store.dispatch('changeStock', obj);
      if (response.status == 200) {
        this.stocks = [];
        this.last_stocks_info = await this.$store.dispatch("getStocks");
        this.getChartDatas(this.selectedProductChart.id);
        this.$bvToast.toast('stock changed successfully', {
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

    },
    getChartDatas: async function (product_id) {
      let data = await this.$store.dispatch("getChartData", {
        token: await this.$store.dispatch("getToken"),
        id: product_id
      });

      var chartLabel = [];
      var chartData = [];
      data.forEach(e => {
        chartLabel.push(e.year);
        chartData.push(e.quantity);
      });

      this.chartData = {
        labels: chartLabel,
        datasets: [
          {
            label: 'stock variation of product: ' + product_id,
            backgroundColor: "#748A9D",
            data: chartData
          }
        ]
      }
    }

  },
  components: {
    TheHeader,
    TheFooter,
    LineChartGenerator
  },
}

</script>

<style>
.stockModify {
  display: flex;
  flex-wrap: nowrap;
  width: 90%;
  margin: auto;
  justify-content: space-between;
  min-height: 40vh;
}

.stockForm {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  border: 1px grey solid;
  border-radius: 10px;
  width: 30%;
}

.stockContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-radius: 10px;
  width: 70%;
  padding: 2vh 2vw;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.stockDataContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-radius: 10px;
  width: 100%;
  padding: 2vh 2vw;
  background-color: whitesmoke;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  gap: 2vw;
}

.stockData {
  display: flex;
  flex-wrap: nowrap;
  gap: 5%;
  border: 1px grey dashed;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  text-align: start;
  width: 20%;
  padding: 1vh;
}

.stockData>.cross {
  color: rgb(70, 70, 70);
}

.stockData>.cross:hover {
  color: red;
  cursor: pointer;
}

.stockTrigger {
  width: 70%;
  margin: 1vh 15%;
}

.lastStocks {
  width: 70%;
  margin: 10vh 15%;
  padding: 2vh 2vw;
  text-align: start;
  border-radius: 10px;
  background-color: whitesmoke;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.chartStock {
  width: 70%;
  margin: 10vh 15%;
}

.separator {
  border: 1px grey dotted;
  width: 90%;
  margin: 5vh 5%;
}

.stockPage {
  min-height: 100vh;
}
</style>