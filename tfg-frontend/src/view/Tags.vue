<template>
  <div>
    <TheHeader />
    <main class="TagsPage">
      <div class="tagsOptions">
        <MySearcher @searchInput="search" />
      </div>
      <div class="tagsContainer fromTagsPage">
        <div class="tag" v-bind:key="t.index" v-for="t in filterTags">
          <p>{{ t.name }}</p>
          <div class="cross" v-if="editable" @click="deleteTag(t.name)">&#x2715;</div>
        </div>
      </div>
      <div class="input-group mb-3 w-25 mt-5 ml-5" v-if="editable">
        <input v-model="newTag" trim class="form-control" type="text" placeholder="add tag ..."/>
        <button @click="addTag" class="btn btn-secondary">add</button>
      </div>
      <div class="popularTagsChart">
        <h3>Tags Count</h3>
        <Doughnut :options="chartOptions" :data="chartData" />
      </div>
    </main>
    <TheFooter />
  </div>
</template>


<script>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import MySearcher from '@/components/MySearcher.vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: 'ProductTags',
  data() {
    return {
      tags: [],
      searchInput: '',
      editable: true,
      newTag: '',
      chartData: {
        labels: [],
        datasets: [{
          backgroundColor: [],
          data: [],
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
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

    this.tags = await this.$store.dispatch('getTags');
    await this.createChartData();
  },
  methods: {
    search: async function (searchInput) {
      this.searchInput = searchInput;
    },
    deleteTag: async function (tagname) {
      const query = {
        token: await this.$store.dispatch('getToken'),
        name: tagname
      }
      this.$store.dispatch('deleteTag', query);
      this.tags = this.tags.filter(t => t.name != tagname);
    },
    addTag: async function () {
      const query = {
        token: await this.$store.dispatch('getToken'),
        name: this.newTag
      }
      await this.$store.dispatch('addTag', query);
      this.tags = await this.$store.dispatch('getTags');
    },
    createChartData: async function () {
      let chartData = await this.$store.dispatch('getPopularTagsData');
      var labels = [];
      var data = [];
      var colors = [];

      chartData.forEach(e => {
        labels.push(e.tag_name);
        data.push(e.count);
        let rcolor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        colors.push(rcolor);
      });

      this.chartData = {
        labels: labels,
        datasets: [{
          backgroundColor: colors,
          data: data,
        }]
      }
    }
  },
  computed: {
    filterTags() {
      var filteredTags = [];
      filteredTags = this.tags.filter(t => t.name.includes(this.searchInput));
      filteredTags.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
      return filteredTags;
    },
    getChartData() {
      return this.chartData;
    },
    getChartOptions() {
      return this.chartOptions;
    }
  },
  components: {
    TheHeader,
    TheFooter,
    MySearcher,
    Doughnut
  }
}
</script>

<style>
.TagsPage {
  min-height: 100vh;
}

.fromTagsPage {
  margin: 0vh 3vw;
}

.tagsOptions {
  height: 5vh;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin: 5vh 2vw;
  padding: 1vh;
  justify-content: space-between;
}

.popularTagsChart {
  margin: 5vh;
  height: 50vh;
}
</style>