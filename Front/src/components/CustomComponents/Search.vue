<template>
  <div class="search" @click="toggleSearchList">
    <input class="search__input" :class="{'search__input-active': listFullSize}" type="text" placeholder="Where are you going?" v-model="input">
    <div v-if="listFullSize" class="search__list">
      <div v-for="(region, index) in regions" :key="region" class="search__list-item" @click="setSelectedRegion(index)">
        <div>{{index}}</div>
        <div class="item__amount">{{placesAmountText(region)}}</div>
      </div>
      <div class="search__list-item" @click="setSelectedRegion('')">
        <div>Show all</div>
      </div>
    </div>
    <MyButton 
      title="Search" 
      :noLeftRadius="true"
    />
  </div>
</template>

<script>
import { router, routeNames } from '../../router'
import MyButton from './MyButton.vue'
import { numWord } from '../../services/numerals.service'

export default {
  components: {
    MyButton,
  },
  routeNames,
  data: () => ({
    selectedRegion: '',
    listFullSize: false,
    input: '',
  }),
  computed:{
    regions() {
      return Object.fromEntries(Object.entries(this.$store.state.placesModule.regions).filter(([key]) => key.toLowerCase().includes(this.input.toLowerCase())))
    },
  },

  methods: {
    setSelectedRegion (region) {
      this.$store.commit('setSelectedRegion', region)
      if (router.currentRoute.name !== 'MyPlaces') {
        router.push({ name: routeNames.places })
      }
      this.selectedRegion = ''
      this.input = ''
    },
    placesAmountText(number) {
      return numWord(number, ['object', 'objects'])
    },
    toggleSearchList() {
      this.listFullSize = !this.listFullSize
    }
  },
}
</script>

<style lang="scss" scoped> 

.search {
  display: flex;
  position: relative;
  z-index: 1;
}
.search__input {
  @include input;
  height: 40px;
  border-radius: 5px 0 0 5px;
  width: 20vw;
  min-width: 200px;
  &-active {
    border-radius: 5px 0 0 0;
  }
}
.search__list {
  position: absolute;
  box-sizing: border-box;
  display: grid;
  width: 100%;
  max-height: 200px;
  overflow: scroll;
  top: 42px;
  background-color: white;
  box-shadow: 0px 8px 8px 0px rgba(0,0,0,0.1);
  border-radius: 0 0 5px 5px;
  z-index: 1;
}
.search__list-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
  font-weight: 300;
  line-height: 20px;
  &:hover {
    background-color: rgb(240, 240, 240);
  }
  &:last-child {
    font-weight: 400;
    color: rgb(0, 154, 103);
    border-top: solid rgb(232, 232, 232) 1px;
  }
}
.item__amount {
  font-size: 14px;
  color: rgb(134, 134, 134);
}
</style>
