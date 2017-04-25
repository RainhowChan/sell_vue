<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <router-link tag="div" to="/goods" class="tab-item">
        <a>商品</a>
      </router-link>
      <router-link tag="div" to="/ratings" class="tab-item">
        <a>评论</a>
      </router-link>
      <router-link tag="div" to="/seller" class="tab-item">
        <a>商家</a>
      </router-link>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
  import header from './components/header/Header';

  const ERR_OK = 0;

  export default {
    name: 'app',
    data() {
      return {
        seller: {}
      };
    },
    created() {
      this.$http.get('/api/seller')
        .then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            this.seller = response.data;
          }
        });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "common/style/app.styl";
</style>
