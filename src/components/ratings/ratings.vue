<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <v-star :size="36" :score="seller.serviceScore"></v-star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <v-star :size="36" :score="seller.foodScore"></v-star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <v-split></v-split>
      <v-rating-select :ratings="ratings" :onlyContent="onlyContent" :selectType="selectType"
                       @toSelectType="toSelectType" @toOnlyContent="toOnlyContent"></v-rating-select>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" alt="" width="24" height="24">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <v-star :size="24" :score="rating.score"></v-star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length>0">
                <span class="icon-thumb_up"></span>
                <span v-for="item in rating.recommend" class="item">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
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
  import RatingSelect from '../ratingselect/ratingselect';
  import moment from 'moment';
  /* eslint-disable no-unused-vars */
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      };
    },
    created() {
      this.$http.get('/api/ratings').then((res) => {
        res = res.body;
        if (res.errno === ERR_OK) {
          this.ratings = res.data;
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.ratings, {
                click: true,
                probeType: 3
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
      });
    },
    components: {
      'v-star': Star,
      'v-split': Split,
      'v-rating-select': RatingSelect
    },
    methods: {
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
      needShow(selectType, text) {
        if (this.onlyContent && !text) { // 只显示有内容的评论开关打开  且没有文字内容
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return selectType === this.selectType;
        }
      }
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
  @import "./ratings.styl";
</style>

