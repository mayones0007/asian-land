<template>
  <div class="room" :class="{'room-mobile': !isDesktop}">
    <Gallery
      :pictures="currentPictures(room.id)"
    />
    <div class="room__info">
      <div class="room__info-header">
        <div>{{room.name}}</div>
        <div class="feature">
          <img :src="`${$baseUrl}/icons/person.svg`" alt="star">
          {{room.sleeps}}
        </div>
        <div class="feature">{{room.area}}м2</div>
      </div>
      <div class="description-text">
        {{room.description}}
      </div>
      <div class="features">
        <div v-for="feature in currentFeatures(room.id)" :key="feature" class="feature feature-light">
          {{feature}}
        </div>
      </div>
      <MyButton
        :title="buttonText"
        :icon="buttonIcon"
        @click="$emit('roomClick')"
        class="button"
      />
    </div>
  </div>
</template>

<script>
import Gallery from './Gallery.vue'
import MyButton from './MyButton.vue'

export default {
  components: {
    Gallery,
    MyButton
  },
  props: ['room', 'buttonText', 'buttonIcon'],
  computed: {
    isDesktop(){
      return this.$store.state.appModule.isDesktop
    },
  },
  methods: {
    currentPictures(id) {
      return this.$store.state.placesModule.pictures.filter(picture => picture.roomId === id).map(picture => picture.fileName)
    },
    currentFeatures(id) {
      return this.$store.state.placesModule.features.filter(feature => feature.roomId === id).map(feature => feature.name)
    },
  },
}
</script>

<style scoped lang="scss">
.room {
  margin: 15px 0;
  padding: 20px;
  border-radius: 5px;
  background-color:aliceblue;
  display: grid;
  overflow: hidden;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  border: solid 1px rgba(0, 0, 0, 0.076);
  cursor: default;
}

.room-mobile {
  grid-template-columns: 1fr;
  grid-auto-flow: row;
}

.description-text {
  text-align: justify;
  font-weight: 300;
  user-select: text;
  white-space: pre-line;
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
  font-size: 0.9em;
  padding: 8px;
  background-color:rgb(255, 255, 255);
  border-radius: 20px;
  border: solid rgb(240, 240, 240) 1px;
  align-items: center;
  white-space: nowrap;
  &-light{
    font-weight: 200;
  }
}
.room__info {
  width: 100%;
  height: 100%;
  display: grid;
  align-content: space-between;
}
.room__info-header {
  display: grid;
  grid-template-columns: 1fr 50px 50px;
  gap: 5px;
  align-items: center;
  justify-items: start;
  margin-bottom: 10px;
}
.button {
  justify-self: end;
}
</style>
