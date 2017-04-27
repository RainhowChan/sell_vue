<template>
  <div class="food" ref="food">
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image" alt="">
        <div class="back" @click="back">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}</span>
        </div>
        <div class="price">
          <span class="now">&yen;{{food.price}}</span>
          <span class="old" v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
        </div>
        <div class="cartcontrol-wrapper" v-show="food.count>0">
          <v-cart-control :food="food"></v-cart-control>
        </div>
        <transition name="fade">
          <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="putToCart">加入购物车</div>
        </transition>
      </div>
      <v-split v-show="food.info"></v-split>
      <div class="info" v-show="food.info">
        <div class="title">商品介绍</div>
        <div class="text">{{food.info}}</div>
      </div>
      <v-split v-show="food.ratings"></v-split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <v-rating-select :ratings="food.ratings" :desc="desc" :onlyContent="onlyContent" :selectType="selectType"
                         @toSelectType="toSelectType" @toOnlyContent="toOnlyContent"></v-rating-select>
        <div class="rating-wrapper">
          <ul v-if="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" :src="rating.avatar" alt="" width="12" height="12">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span>{{rating.text}}</span>
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || food.ratings.length===0">
            暂时没有评论哦！
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import CartControl from '../cartcontrol/cartcontrol';
  import Split from '../split/split';
  import RatingSelect from '../ratingselect/ratingselect';
  import moment from 'moment';
  /* eslint-disable no-unused-vars */
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      back() {
        this.$emit('back');
      },
      putToCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count = 1;
        }
      },
      toSelectType(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toOnlyContent(bool) {
        this.onlyContent = bool;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(rateType, text) {
        if (this.onlyContent && !text) { // 只显示有内容的评论开关打开  且没有文字内容
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return rateType === this.selectType;
        }
      }
    },
    created() {
      this.selectType = ALL;
      this.onlyContent = false;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    components: {
      'v-cart-control': CartControl,
      'v-split': Split,
      'v-rating-select': RatingSelect
    },
    filters: {
      formatDate(time) {
        let day = moment(time);
        return day.format('YYYY-M-D H:mm');
      }
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/style/mixin.styl";
  @import "./food.styl";
</style>

