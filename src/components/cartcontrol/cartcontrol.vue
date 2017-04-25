<template>
  <div class="cartcontrol">
      <div class="cart-decrease" @click="decreaseCart">
        <transition name="translate">
            <div class="inner icon-remove_circle_outline" v-show="food.count>0"></div>
        </transition>
      </div>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) { // 通过better-scroll派发的事件才能触发点击
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('cartadd', event.target);
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "./cartcontrol.styl";
</style>

