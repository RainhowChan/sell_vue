<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">&yen;{{totalPrice}}</div>
        <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="ball in balls" v-show="ball.show" class="ball">
        <div class="inner inner-hook"></div>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="content">
          <ul>
            <li v-for="(food, index) in selectFoods" class="food">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>&yen;{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <v-cartcontrol :food="food"></v-cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade-mask">
      <div class="list-mask" v-show="listShow" @click="toggleList"></div>
    </transition>
  </div>

</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import cartControl from '../cartcontrol/cartcontrol';
  export default {
    data() {
      return {
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: [], // 已经完成动画的小球
        fold: true // 购物车清单折叠
      };
    },
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    methods: {
      drop(element) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = element;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectFoods.forEach(food => {
          food.count = 0;
        });
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`需要支付${this.totalPrice}元`);
      }
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach(food => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach(food => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还需¥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() {
        return this.totalPrice < this.minPrice ? 'not-enough' : 'enough';
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.content, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    transitions: {
      drop: {
        beforeEnter(element) {
          let count = this.balls.length;
          while (count--) {
            let ball = this.balls[count];
            if (ball.show) {
              let rect = ball.el.getBoundingClientRect();
              let x = rect.left - 32;
              let y = -(window.innerHeight - rect.top - 22);
              element.style.display = '';
              element.style.webkitTransform = `translate3d(0,${y}px,0)`;
              element.style.transform = `translate3d(0,${y}px,0)`;
              let inner = element.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
              inner.style.transform = `translate3d(${x}px,0,0)`;
            }
          }
        },
        enter(element) {
          /* eslint-disable no-unused-vars */
          let rf = element.offsetHeight;// 触发浏览器重绘
          this.$nextTick(() => {
            element.style.webkitTransform = 'translate3d(0,0,0)';
            element.style.transform = 'translate3d(0,0,0)';
            let inner = element.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = 'translate3d(0,0,0)';
            inner.style.transform = 'translate3d(0,0,0)';
          });
        },
        afterEnter(element) {
          let ball = this.dropBalls.shift();
          if (ball) {
            ball.show = false;
            element.style.display = 'none';
          }
        }
      }
    },
    components: {
      'v-cartcontrol': cartControl
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/style/mixin.styl";
  @import "./shopcart.styl";
</style>

