<template>
  <div class="container mx-auto bg-gray-100 rounded-xl shadow border p-8 m-10">
    <div class="grid justify-center">
      <div class="justify-center mt-5 mb-2">
        <h1 class="font-bold w-100 text-center">
          Salman's Practical Test
        </h1>
      </div>
      <div>
        <input
            type="search"
            v-model="search"
            placeholder="Search by movie title"
            class="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-60 p-2.5"
        />
      </div>
    </div>
    <div class="grid grid-col-12 justify-center" v-if="loading">
      <div class="justify-center mt-5 mb-2">
        <p class="text-center">
          Loading...
        </p>
      </div>
    </div>
    <div v-else class="py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 px-10">
      <div class="item error" v-if="search&&!movies.length">
        <p>No results found!</p>
      </div>
      <div v-for="movie in movies" :key="movie">
        <div class="rounded-lg bg-white shadow-lg">
          <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w342/' +  movie.poster_path"  alt="{{ movie.title}}" class="object-cover rounded-t-lg" />
          <img v-else src="https://placeholder.pics/svg/342x512/A3A3A3-999999/141512-9C9C9C/No%20Image"  alt="{{ movie.title}}" class="object-cover rounded-t-lg" />
          <div class="p-4">
            <h2 class="mb-2 text-xs font-semibold">{{ movie.title }}</h2>
            <p class="mb-2 text-xs text-gray-700">
            Released: {{ format_date(movie.release_date) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="grid justify-center" v-if="movies.length&&!loading">
      <div class="justify-center mt-2 mb-2">
        <button type="button" @click="prevPage" class="gap-2 mx-1 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" :disabled="page == 1 ? true : false">Previous</button>
        <button type="button" @click="nextPage" class="gap-2 mx-1 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" :disabled="page == lastPage ? true : false">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from "vue";
import debounce from 'lodash/debounce';
import moment from 'moment';


let search = ref('');
const discoverMovieURL = "https://api.themoviedb.org/3/discover/movie?api_key=136d55d9c6878da748d19b6aa4870c86";
const updateMovieURL = "https://api.themoviedb.org/3/search/movie?api_key=136d55d9c6878da748d19b6aa4870c86";

export default {

  components: {},

  data() {
    return {
      movies: [],
      page: 1,
      loading: false,
      search: '',
      postURL: '',
      lastPage: 11234556
    }
  },
  mounted() {
    this.postURL = discoverMovieURL;
    this.fetchData(this.postURL);
  },
  methods: {
    fetchData(url, params = null) {

      this.loading = true;
      var current = (this.page + 1);

      axios.get(url, { params: params })
          .then(({data}) => {
            this.movies = data.results;
            this.loading = false;
            this.lastPage = data.total_pages;
          })
          .catch((err) => {
            console.log(err);
          })
    },
    prevPage() {
      this.loading = true;
      this.page--;
    },
    nextPage() {
      this.loading = true;
      this.page++;
    },
    format_date(value) {
      if (value) {
        return moment(String(value)).format('MMMM D, Y');
      }
    },
  },
  watch: {
    search(value) {
      this.page = 1;

      if (!value || value.length === 0) {
        this.postURL = discoverMovieURL;
      } else {
        this.postURL = updateMovieURL;
      }
      this.fetchData(this.postURL, {'page': this.page, 'query': value});
    },
    page(value) {
      var queryString = {'page': value};
      if (this.search && this.search.length) {
        queryString.query = this.search;
      }
      this.fetchData(this.postURL, queryString);
    }
  },
}

</script>
