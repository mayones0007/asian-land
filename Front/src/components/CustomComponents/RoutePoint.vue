<template>
<div>
  <div 
    class="route-point"
    :class="{'route-point-full-size': isFullSize, 'route-point-mobile': !isDesktop}"
    @click.self="toggleSize"
  >
    <div class="route-point__name" :class="{'route-point__name-mobile': !isDesktop}">
      <img :src="`${$baseUrl}/icons/arrow.png`" alt="star" class="route-point__arrow" :class="{'route-point__arrow-down': isFullSize}" @click="toggleSize">
      <div @click="toggleSize">{{routePoint.name}}</div>
      <ButtonHeart
        :placeId="routePoint.id"
        v-if="!isDesktop && showHeart"
      />
    </div>
    <div v-if="isDesktop" class="route-point__info route-point__info-desktop">
      <div class="tag">{{routePoint.region}}</div>
      <div class="tag">{{routePoint.city}}</div>
      <div class="tag">{{routePoint.category}}</div>
      <ButtonHeart
        v-if="showHeart"
        :placeId="routePoint.id"
      />
    </div>
    <PlacePreview
      :routePoint="routePoint"
    />
    <div class="route-point__container">
      <div class="route-point__description">{{routePoint.description}}</div>
      <div v-if="!isDesktop" class="route-point__info">
        <div class="tag">{{routePoint.region}}</div>
        <div class="tag">{{routePoint.city}}</div>
        <div class="tag">{{routePoint.category}}</div>
      </div>
      <div class="route-point__buttons">
        <MyButton
          :title="buttonText"
          :icon="buttonIcon"
          @click="$emit('routeClick')"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import MyButton from './MyButton.vue'
import PlacePreview from './PlacePreview.vue'
import ButtonHeart from './ButtonHeart.vue'
export default {
  components: {
    MyButton,
    PlacePreview,
    ButtonHeart
  },
  props: ['routePoint', 'FullSize', 'showHeart', 'buttonText', 'buttonIcon'],
  data(){
    return {
      isFullSize: this.FullSize,
    }
  },
  computed: {
    isDesktop(){
      return this.$store.state.appModule.isDesktop
    },
  },
  methods: {
    toggleSize() {
      this.isFullSize = !this.isFullSize;
    },
  },
}
</script>

<style scoped lang="scss">

.route-point {
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 10px;
  background-color:aliceblue;
  height: 40px;
  display: grid;
  overflow: hidden;
  grid-template-rows: 40px 1fr;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  border: solid 1px rgba(0, 0, 0, 0.076);
  align-items: center;
  justify-items: center;
  cursor: default;
  &:hover {
    background-color:rgb(228, 243, 255);
  }
  &-full-size {
    height: 100%;
  }
}

.route-point-mobile {
  grid-template-columns: 1fr;
  grid-auto-flow: row;
}

.route-point__buttons {
  justify-self: end;
  align-self: end;
}
.route-point__name {
  display: flex;
  align-items: center;
  width: 100%;
  justify-self: start;
  gap: 10px;
}

.route-point__name-mobile {
  justify-content: space-between;
}

.route-point__description {
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  text-align: justify;
  overflow: hidden;
  font-weight: 300;
  text-indent: 20px;
}

.route-point__arrow {
  transition-duration: 400ms;
  width: 20px;
  height: 20px;
  padding: 8px;
  border-radius: 50%;
  background-color: white;
  transform: rotate(-180deg);
  border: solid 1px rgba(0, 0, 0, 0.076);
}

.route-point__arrow-down {
  transform: rotate(0deg);
}
.route-point__info {
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
  overflow: hidden;
  gap: 10px;
  &-desktop {
    justify-self: end;
    flex-wrap: nowrap;
    height: 40px;
  }
}
.route-point__container {
  display: grid;
  gap: 20px;
  height: 100%;
  width: 100%;
}
.tag {
  font-weight: 200;
  font-size: 0.9em;
  padding: 10px;
  background-color:rgb(255, 255, 255);
  border-radius: 20px;
  border: solid rgb(240, 240, 240) 1px;
}
</style>