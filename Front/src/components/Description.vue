<template>
  <div v-if="currentPlace" class="page" :class="{'page-mobile': !isDesktop}">
    <div>
      <Gallery
        :pictures="this.currentPictures"
      />
      <SavePanel v-if="!isDesktop"/>
      <h2 v-if="!isDesktop && placeFeatures.length">Facilities</h2>
      <div class="features">
        <div v-for="feature in placeFeatures" :key="feature.name" class="feature">
          {{feature.name}}
        </div>
      </div>
      <h2 v-if="!isDesktop && currentPlace.description">Description</h2>
      <div class="description-text">{{currentPlace.description}}</div>
      <h2>Rooms</h2>
      <Rooms
        v-for="room in currentRooms"
        :key="room.id"
        :room="room"
        buttonText="Reserve room"
      />
      <div class="review">
        <textarea 
          class="review__input"
          type="text"
          placeholder="Review"
          v-model="inputValue"
        />
        <div class="review__buttons" :class="{'review__buttons-mobile': !isDesktop}">
          <div class="raiting">Raiting
            <img
              v-for='star in 5' :key="'star'+star"
              :src="`${$baseUrl}/icons/star.svg`"
              alt="star"
              class="review__buttons-star"
              :class="{'review__buttons-star--hovered': star <= starHovered}"
              @click="onStarHover(star)"
            >
          </div>
          <MyButton
            title="Sent review"
            :isDisabled="!this.inputValue || !this.starHovered"
            :icon="'send.svg'"
            @click="saveRewiew"
          />
        </div>
      </div>
      <ReviewMessages/>
    </div>
    <SavePanel v-if="isDesktop"/>
  </div>
</template>

<script>
import {router} from '../router'
import MyButton from './CustomComponents/MyButton.vue'
import Rooms from './CustomComponents/Rooms.vue'
import ReviewMessages from './CustomComponents/ReviewMessages.vue'
import SavePanel from './CustomComponents/SavePanel.vue'
import Gallery from './CustomComponents/Gallery.vue'

export default {
  components: {
    MyButton,
    Gallery,
    SavePanel,
    ReviewMessages,
    Rooms
  },
  data() {
    return {
      inputValue: '',
      starHovered: '',
    }
  },
  computed: {
    currentRoute() {
      return router.currentRoute.value.params.id
    },
    currentPlace() {
      return this.$store.state.placesModule.place
    },
    currentRooms() {
      return this.$store.state.placesModule.rooms
    },
    placeFeatures() {
      return this.$store.state.placesModule.features.filter(feature => feature.roomId === null)
    },
    currentReviews() {
      return this.$store.state.placesModule.reviews
    },
    currentPictures() {
      return this.$store.state.placesModule.pictures.map(picture => picture.fileName)
    },
    isDesktop() {
      return this.$store.state.appModule.isDesktop
    },
  },
  methods: {
    onStarHover(star) {
      this.starHovered = star
    },
    saveRewiew(){
      this.$store.dispatch('newReview', {'text':this.inputValue, 'raiting':this.starHovered})
      this.starHovered = this.inputValue = ''
    },
  },
  created(){
    this.$store.dispatch("getPlace", this.currentRoute)
    this.$store.dispatch("getFeatures", {placeId: this.currentRoute})
  },
}
</script>

<style scoped lang="scss">

.page {
  padding: 20px 40px;
  display: grid;
  grid-template-columns: 1fr 350px;
  align-items: start;
  gap: 20px;
  &-mobile {
    padding: 3%;
    grid-template-columns: 1fr;
    text-align: start;
  }
}

.description-text {
  margin: 20px 0;
  font-size: 1.2em;
  text-align: justify;
  font-weight: 300;
  user-select: text;
  white-space: pre-line;
}

.review {
  display: grid;
  background-color:rgb(249, 249, 249);
  border-radius: 5px;
  border: solid rgb(240, 240, 240) 1px;
  margin: 30px 0;
}

.review__input {
  @include input;
  box-sizing: border-box;
  border-radius: 5px 0 0 0;
  height: 60px;
  padding: 15px;
  width: 100%;
  height: 100px;
  resize: vertical;
  };

.review__buttons-star {
  height: 23px;
  padding-left: 8px;
  filter: grayscale(1) brightness(1.7);
  &--hovered {
    filter: grayscale(0);
  }
}

.raiting {
  display: flex;
  font-weight: 300;
  align-items: center;
  margin-left: 15px;
}

.review__buttons {
  display: flex;
  gap: 15px;
  justify-content: space-between;
  padding: 15px 20px 20px 0;
  &-mobile {
    flex-direction: column;
    padding-top: 15px 0px 0 0px;
  }
}
.features {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0;
}

.feature {
  display: flex;
  gap: 5px;
  padding: 8px;
  border-radius: 5px;
  border: solid rgb(240, 240, 240) 1px;
  align-items: center;
  white-space: nowrap;
  font-weight: 300;
}
h2 {
  margin: 10px 0 5px 0;
}
</style>
