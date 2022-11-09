<template>
  <div>
    <div class="welcome" :class="{'welcome-mobile': !isDesktop}">
      <img class="welcome__picture" :src="`${$baseUrl}/img/${welcomeImage.image}`" alt="asian.land">
      <div class="welcome__text">{{ welcomeImage.text }}</div>
    </div>
    <MyButton
      v-if="!isDesktop"
      title="Filters"
      :icon="'filter.svg'"
      class="places__filters-button"
      @click="toggleFiltersSize"
    />
    <div class="page" :class="{'page-mobile': !isDesktop}">
      <div v-if="this.isFullSizeFilters || isDesktop" class="filters">
        <Select
          :name="'Category'"
          :fieldName="'category'"
        />
        <div class="filters__item">
        <h2>Facilities</h2>
        <div v-for="feature in features" :key="feature">
          <input type="checkbox" :id="feature" v-model="filter[feature]">
          <label :for="feature">{{feature}}</label>
        </div>
        </div>
        <MyButton
          title="Search"
          @click="getPlaces"
        />
      </div>
      <div>
        <RoutePoint
          v-for="place in filteredPlaces"
          :showHeart="true"
          :key="place.id"
          :FullSize="true"
          :routePoint="place"
          buttonIcon="house.svg"
          buttonText="Book It"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RoutePoint from './CustomComponents/RoutePoint.vue'
import MyButton from './CustomComponents/MyButton.vue'
import Select from './CustomComponents/Select.vue'

export default {
  components: {
    RoutePoint,
    MyButton,
    Select
  },
  data(){
    return {
      isFullSizeFilters: false,
      filter: {}
    }
  },
  computed: {
    selectedRegion() {
      return this.$store.state.placesModule.selectedRegion
    },
    filteredPlaces() {
      return this.$store.state.placesModule.filteredPlaces
    },
    features() {
      return this.$store.state.placesModule.featuresList
    },
    welcomeImage() {
      if (this.selectedRegion) {
        return {image: this.filteredPlaces[0].picture, text: this.selectedRegion}
      } else {
        return {image: "welcome.webp", text: "Find your best place"}
      }
    },
    isDesktop(){
      return this.$store.state.appModule.isDesktop
    },
  },
  methods: {
    toggleFiltersSize() {
      this.isFullSizeFilters = !this.isFullSizeFilters
    },
    getPlaces() {
      this.$store.dispatch("getPlaces", this.filter)
    }
  },
  created() {
    this.$store.dispatch("getPlaces")
    this.$store.dispatch("getFeaturesList")
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin: 20px 3%;
  display: grid;
  grid-template-columns: 300px 1fr;
  align-items: start;
  gap: 20px;
  &-mobile {
    grid-template-columns: 1fr;
    margin: 0px 3%;
  }
}

.welcome {
  position:relative;
  height: 450px;
  &-mobile {
    height: 350px;
  }
}

.welcome__picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.welcome__text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 90%;
  font-size: min(max(40px, 6vw), 70px);
  color: white;
  font-weight: 900;
}

.filters {
  display: grid;
  box-sizing: border-box;
  top: 20px;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(45deg, rgb(235, 246, 255), rgb(207, 233, 255));
  border: solid rgb(240, 240, 240) 1px;
  border-radius: 10px;
  font-weight: 300;
}

.filters__item {
  display: grid;
  width: 100%;
  justify-items: start;
}

.places__filters-button {
  margin: 10px 0;
}
</style>
