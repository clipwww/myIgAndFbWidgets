import "@babel/polyfill";
import Vue from 'vue/dist/vue.common';
import axios from 'axios';

const fbDomId = 'fb-widgets';
const igDomeId = 'ig-widgets';

new Vue({
  el: `#${fbDomId}`,
  data() {
    let fanPage = null;
    try {
      fanPage = JSON.parse(window.localStorage.getItem('__unifbpage__'))
    } catch (err) { console.log(err) }
    return {
      fanPage,
      action: document.getElementById(fbDomId)?.getAttribute('action') ?? `https://clipwww-nuxt-express-project.herokuapp.com/api/fb/uniustyle`
    }
  },
  computed: {
    posts() {
      return this.fanPage?.posts?.filter((item, index) => index < 3) ?? [];
    }
  },
  created() {
    this.getFanPagePosts();
  },
  methods: {
    async getFanPagePosts() {
      try {
        const { data: ret } = await axios.get(this.action);
        if (!ret.success) {
          return;
        }
        
        this.fanPage = ret.item;
        window.localStorage.setItem('__unifbpage__', JSON.stringify(this.fanPage))

      } catch (err) { console.log(err) }
    },
    toPureHtmlString(htmlString: string) {
      return htmlString
        .replace(/<[^>]*>?/gm, '')
        .trim();
    },
  },
})

new Vue({
  el: `#${igDomeId}`,
  data() {
    let items = [];
    try {
      items =  JSON.parse(window.localStorage.getItem('__uniigpage__') || '[]');
    } catch (err) { console.log(err) }
    return {
      items,
      action: document.getElementById(igDomeId)?.getAttribute('action') ?? `https://clipwww-nuxt-express-project.herokuapp.com/api/ig/ustylelife`
    }
  },
  computed: {
    posts() {
      return this.items?.filter((item, index) => index < 9) ?? [];
    }
  },
  created() {
    this.getIgPosts();
  },
  methods: {
    async getIgPosts() {
      try {
        const { data: ret } = await axios.get(this.action);
        if (!ret.success) {
          return;
        }
        
        this.items = ret.items;
        window.localStorage.setItem('__uniigpage__', JSON.stringify(this.items))

      } catch (err) { console.log(err) }
    },
  },
})