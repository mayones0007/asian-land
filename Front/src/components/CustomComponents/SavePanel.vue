<template>
  <div class="save-panel__info" :class="{'save-panel__info-mobile': !isDesktop}">
    <div class="name">
      {{currentPlace.name}}
      <ButtonHeart
        :placeId="currentPlace.id"
      />
      <ShareButton/>
    </div>
    <div v-for="field in infoFields" :key="field.name" class="save-panel__item">
      <div>{{field.name}}</div>
      <a v-if="field.type === 'email'" class= "link" :href="`mailto:${currentPlace[field.fieldName]}`">{{currentPlace[field.fieldName]}}</a>
      <a v-else-if="field.type === 'tel'" class= "link" :href="`tel:${currentPlace[field.fieldName]}`">{{currentPlace[field.fieldName]}}</a>
      <a v-else-if="field.type === 'url'" class= "link" :href="`http://${currentPlace[field.fieldName]}`" target="_blank">{{currentPlace[field.fieldName]}}</a>
      <div v-else>{{currentPlace[field.fieldName]}}</div>
    </div>
    <div v-if="currentPlace.raiting" class="save-panel__item">
      <div>Raiting</div>
      <div class="raiting" v-if="currentPlace.raiting">
        <img
          v-for='star in currentPlace.raiting' :key="'star'+star"
          :src="`${$baseUrl}/icons/star.svg`"
          alt="star"
          class="raiting__star"
        >
      </div>
    </div>
    <div v-if="coords" class="map">
      <yandex-map
        :coords="coords" 
        zoom="20"
        :controls="controls"
        @map-was-initialized="mapInitialized"
      >
      <ymap-marker 
        :coords="coords" 
        marker-id="Старт" 
        hint-content=""
      />
      </yandex-map>
    </div>
    <div class="save-panel__buttons" :class="{'save-panel__buttons-mobile': !isDesktop}">
      <Datepicker
        v-model="date"
        format="dd MMM"
        range
        class="calendar"
      />
      <MyButton
        title="Reserve"
      />
    </div>
  </div>
</template>

<script>
import MyButton from './MyButton.vue'
import ButtonHeart from './ButtonHeart.vue'
import ShareButton from './ShareButton.vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss'
import { placeFields } from '../../data/place.data'

export default {
  name: 'SavePanel',
  components: {
    MyButton,
    ButtonHeart,
    ShareButton,
    Datepicker
  },
  data(){
  return {
      controls: ['fullscreenControl'],
      myMap: null,
      date: [],
      placeFields
    }
  },
  computed: {
    currentPlace() {
      return this.$store.state.placesModule.place
    },
    isDesktop(){
      return this.$store.state.appModule.isDesktop
    },
    coords() {
      return this.currentPlace.coords ? this.currentPlace.coords.split(',') : undefined
    },
    infoFields() {
      return this.placeFields.filter((field) => field.info && this.currentPlace[field.fieldName])
    },
  },
  methods: {
    mapInitialized(e){
      this.myMap = e
    },
  },
  onMounted(){
    const startDate = new Date()
    const endDate = new Date(new Date().setDate(startDate.getDate() + 7))
    this.date = [startDate, endDate]
  }
}
</script>

<style lang='scss' scoped>

.save-panel__info {
  display: grid;
  position: sticky;
  box-sizing: border-box;
  justify-items: start;
  top: 20px;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(45deg, rgb(235, 246, 255), rgb(207, 233, 255));
  border: solid rgb(240, 240, 240) 1px;
  border-radius: 5px;
  width: 320px;
  font-weight: 300;
}

.save-panel__info-mobile {
  position: relative;
  border-radius: 0 0 5px 5px;
  background: rgb(235, 246, 255);
  border: none;
  padding: 15px;
  right: 0;
  top: 0px;
  width: 100%;
}

.save-panel__buttons {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 90px;
  box-sizing: border-box;
  gap: 10px;
  width: 100%;
}

.save-panel__buttons-mobile {
  position: fixed;
  padding: 20px 20px 30px 20px;
  left: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgb(255, 255, 255), rgb(242, 242, 242));
  border: solid rgb(240, 240, 240) 1px;
  z-index: 1;
}

.raiting {
  display:flex;
}

.raiting__star {
  height: 19px;
  margin-right: 4px;
}
.map {
  height: 200px;
  width: 100%;
}

.ymap-container {
  width: 100%;
  height: 100%;
}

.name {
  font-weight: 400;
  font-size: 1.2em;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 25px 25px;
  gap: 10px;
  text-align: start;
}

.link {
  color: rgb(0, 148, 99);
}
.save-panel__item {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  width: 100%;
  justify-items: start;
}
</style>