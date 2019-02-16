import '../scss/ig-widgets.scss';
import 'babel-polyfill';
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';
import Vue from 'vue/dist/vue.common'

const service = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  },
});

//  <img :src="item.images.standard_resolution.url" :alt="item.caption ? item.caption.text: item.link" />

new Vue({
  el: '#ig-widgets',
  template:  `
  <div class="ig-widgets">
    <ul class="ig-widgets__wrap">
      <li class="ig-widgets__item" v-for="item in pictures" :key="item.id">
        <a :href="item.link" target="_blank">
          <figure v-bind:style="{ 'background-image': 'url(' + item.images.standard_resolution.url + ')' }">
            <figcaption>{{ item.caption ? item.caption.text: item.link }}</figcaption>
          </figure>
        </a>
      </li>
    </ul>
    <div class="ig-widgets__msg" v-if="!pictures.length">努力加載中...</div>
  </div>
  `,
  data() {
    return {
      userId: document.querySelector('#ig-widgets').getAttribute('data-id'),
      token: document.querySelector('#ig-widgets').getAttribute('data-token'),
      max: document.querySelector('#ig-widgets').getAttribute('data-max') || 9,
      pictures: [],
    }
  },
  computed: {
    url() {
      return `https://api.instagram.com/v1/users/${this.userId}/media/recent/?access_token=${this.token}`;
    }
  },
  methods: {
    async getPictures() {
      const ret = await service.get(this.url, {
        adapter: jsonpAdapter,
      }).then(res => res.data).catch(err => err);
      console.log(ret);
      const { data: pictures = [] } = ret;
      if(!pictures.length) {
        return;
      }
      this.pictures = pictures.slice(0, this.max);
    }
  },
  created() {
    this.getPictures();
  }
})