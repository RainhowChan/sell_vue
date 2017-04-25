<template>
  <div v-show="showFlag">
    I am food!
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    props: {
      food: {
        type: Object
      }
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>

</style>

