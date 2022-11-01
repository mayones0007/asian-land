<template>
  <div class="page" :class="{'page-mobile': !isDesktop}">
    <h2>{{titleText}}</h2>
    <RoutePoint
      v-for='favorite in myFavorites'
      :key="favorite"
      :FullSize="true"
      :showHeart="true"
      :routePoint="favorite"
      buttonIcon="house.svg"
      buttonText="Book It"
    />
  </div>
</template>

<script>
import RoutePoint from './CustomComponents/RoutePoint.vue'
export default {
  components: {
    RoutePoint,
  },
  computed: {
    myFavorites () {
      return this.$store.state.userModule.myFavorites
    },
    titleText () {
      if (this.myFavorites.length) {
        return "Favorites: " + this.myFavorites.length
      } else {
        return "There's nothing here"
      }
    },
    isDesktop(){
      return this.$store.state.appModule.isDesktop
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 2% 10%;
  &-mobile {
    padding: 2%;
  }
}
</style>