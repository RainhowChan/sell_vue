<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <v-star :size="36" :score="seller.score"></v-star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <v-split></v-split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item, index) in seller.supports">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <v-split></v-split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="container">
          <ul class="pic-list" ref="pic">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" alt="" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <v-split></v-split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="info in seller.infos">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import Star from '../star/star';
  import Split from '../split/split';
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from '../../common/script/store';
  export default {
    props: {
      seller: Object
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch: {
      seller: function () {
        this._initScroll();
        this._initPicScroll();
      }
    },
    mounted() {
      this._initScroll();
      this._initPicScroll();
    },
    methods: {
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        }
      },
      _initPicScroll() {
        if (this.seller.pics) { // TODO 在mounted()方法中this.seller还没有初始化完成
          let picWidth = 120; // TODO 在切换选项卡时 updated()不会被调用
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.pic.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.container, {
                eventPassThrough: 'vertical',
                scrollX: true
              });
            } else {
              this.$nextTick(() => {
                this.picScroll.refresh();
              });
            }
          });
        }
      },
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      }
    },
    components: {
      'v-star': Star,
      'v-split': Split
    }
  }
  ;
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/style/mixin.styl";
  @import './seller.styl';
</style>

