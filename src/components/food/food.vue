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
          <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好評率{{food.rating}}</span>
        </div>
        <div class="price">
          <span class="now">&yen;{{food.price}}</span><span class="old"
                                                            v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      back() {
        this.$emit('back');
      }
    },
    created() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "./food.styl";
</style>

