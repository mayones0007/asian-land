<template>
  <div>
    <div class="welcome" :class="{'welcome-mobile': !isDesktop}">
      <img class="welcome__picture" :src="`${$baseUrl}/img/${welcomeImage.image}`" alt="asian.land">
      <div class="welcome__text">{{ welcomeImage.text }}</div>
    </div>
    <MyButton
      v-if="!isDesktop"
      title="Фильтры"
      :icon="'filter.svg'"
      class="places__filters-button"
      @click="toggleFiltersSize"
    />
    <div v-if="isFullSizeFilters | isDesktop" class="places__filters" :class="{'places__filters-mobile': !isDesktop}">
      <Select
        :name="'Category'"
        :fieldName="'category'"
      />
    </div>
    <div class="page">
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
</template>

<script>
import RoutePoint from './CustomComponents/RoutePoint.vue'
import Select from './CustomComponents/Select.vue'
import MyButton from './CustomComponents/MyButton.vue'

export default {
  components: {
    RoutePoint,
    Select,
    MyButton,
  },
  data(){
    return {
      isFullSizeFilters: false,
    }
  },
  computed: {
    selectedRegion() {
      return this.$store.state.placesModule.selectedRegion
    },
    filteredPlaces() {
      return this.$store.state.placesModule.filteredPlaces
    },
    welcomeImage() {
      if (this.selectedRegion) {
        return {image: this.filteredPlaces[0].picture, text: this.selectedRegion}
      } else {
        return {image: "chelovek-gora.webp", text: "Find your best place"}
      }
    },
    isDesktop(){
      return this.$store.state.appModule.isDesktop
    },
  },
  methods: {
    toggleFiltersSize() {
      this.isFullSizeFilters = !this.isFullSizeFilters;
    },
  },
  created() {
    this.$store.dispatch("getPlaces")
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin: 3%;
}

.places__gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  padding: 20px 0px;
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

.places__filters {
  @include panel(to bottom);
  font-weight: 500;
  color: rgb(105, 105, 105);
  &-mobile {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  &-button {
    margin-top: 20px;
  }
  .calendar {
    width: 230px;
    z-index: 1;
  }
}
</style>
