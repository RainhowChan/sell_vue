<template>
  <div class="goods-container">
    <div class="goods">
      <div class="menu-wrapper" ref="menu">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index}"
              @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>
          {{item.name}}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="food">
        <ul>
          <li v-for="(item, index) in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                <div class="icon">
                  <img :src="food.icon" alt="" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月销{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">&yen;{{food.price}}</span><span class="old" v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <v-cartcontrol :food="food" @cartadd="controlElement"></v-cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <v-shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
                  :min-price="seller.minPrice"></v-shopcart>
    </div>
    <transition name="slide">
      <div class="food-detail-wrapper" v-if="showFoodDetail">
        <v-food-detail :food="selectedFood" @back="closeFoodDetail"></v-food-detail>
      </div>
    </transition>

  </div>
</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import shopCart from '../shopcart/shopcart';
  import cartControl from '../cartcontrol/cartcontrol';
  import foodDetail from '../food/food.vue';
  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        showFoodDetail: false,
        selectedFood: {}
      };
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((res) => {
        res = res.body;
        if (res.errno === ERR_OK) {
          this.goods = res.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menu, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.food, {
          click: true,
          probeType: 3
        });
        this.foodsScroll.on('scroll', pos => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.food.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu(index, event) {
        if (event._constructed) {
          let foodList = this.$refs.food.getElementsByClassName('food-list-hook');
          let el = foodList[index];
          this.foodsScroll.scrollToElement(el, 300);
        }
      },
      controlElement(element) {
        this.$nextTick(() => { // 优化体验  异步执行动画
          this.$refs.shopcart.drop(element);
        });
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.showFoodDetail = true;
      },
      closeFoodDetail() {
        this.showFoodDetail = false;
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach(goods => {
          goods.foods.forEach(food => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    components: {
      'v-shopcart': shopCart,
      'v-cartcontrol': cartControl,
      'v-food-detail': foodDetail
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/style/mixin.styl";
  @import "./goods.styl";
</style>

