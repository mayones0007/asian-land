<template>
  <div class="page" :class="{'page-mobile': !isDesktop}">
    <div v-if="this.myPlaces && !this.isNewObject">
      <div v-if="isAdmin">
        <label for="hiddenOnly">Hidden only</label>
        <input type="checkbox" id="hiddenOnly" :checked="hiddenOnly" v-model="hiddenOnly">
      </div>
      <div v-if="!place.id">
        <h2>Your objects</h2>
        <RoutePoint
          v-for="place in this.myPlaces"
          :key="place.id"
          :FullSize="!isAdmin"
          :routePoint="place"
          buttonIcon="pensil.svg"
          buttonText="Edit"
          @routeClick="getPlace(place)"
        />
      </div>
    </div>
    <MyButton v-if="!this.isNewObject && !place.id" class="button" title="Create new object" @click="createNewObject"/>
    
    <div v-if="isShowForm" class="form" :class="{'form-mobile': !isDesktop}">
      <h2 class="form__header">Object</h2>
      <div v-for="field in this.placeFields" :key="field.name" class="form__item">
        <label :for="field.fieldName">{{field.name}}</label>
        <div>
          <input 
            class="form__input"
            :id="field.fieldName"
            v-model="place[field.fieldName]" 
            :placeholder="field.placeholder"
            :type="field.type"
            :list="field.name"
            @blur="validate(field.fieldName)"
          >
          <datalist v-if="field.autofull" :id="field.name">
            <option v-for="option in options(field.fieldName)" :key="option">{{option}}</option>
          </datalist>
          <div v-if="this.validation[field.fieldName]" class="input-text-wrong">{{this.validation[field.fieldName]}}</div>
        </div>
      </div>
      <div v-if="isAdmin" class="form__item">
        <label for="isAccepted">Show</label>
        <input type="checkbox" id="isAccepted" v-model="place.isAccepted" true-value=1 false-value=0>
      </div>
      <textarea class="form__textarea" type="text" placeholder="Description" v-model="place.description"></textarea>
    </div>

    
    <div v-if="this.room.id || this.isNewRoom" class="form" :class="{'form-mobile': !isDesktop}">
      <h2 class="form__header">Room</h2>
      <div class="form__item">
        <label for="roomName">Name</label>
        <input class="form__input" id="roomName" v-model="room.name" type="text">
      </div>
      <div class="form__item">
        <label for="roomSleeps">Sleeps</label>
        <input class="form__input" id="roomSleeps" v-model="room.sleeps" type="number">
      </div>
      <div class="form__item">
        <label for="roomArea">Area</label>
        <input class="form__input" id="roomArea" v-model="room.area" type="number">
      </div>
      <div class="form__item">
        <label for="features">Features</label>
        <div class="features">
          <div v-for="feature in this.features" :key="feature" class="feature feature-light">
            {{feature.name}}
            <img :src="`${$baseUrl}/icons/close.svg`" alt="close" class="select__reset-button" @click="deleteFeature(feature)">
          </div>
          <div class="features__input">
            <input class="form__input form__input-features" id="features" type="text" list="featuresList" v-model="feature">
            <MyButton title="Add" :noLeftRadius="true" @click="addFeature()"/>
          </div>
          <datalist id="featuresList">
            <option v-for="feature in featuresList" :key="feature">{{feature}}</option>
          </datalist>
        </div>
      </div>
      <textarea class="form__textarea" type="text" placeholder="Описание" v-model="room.description"></textarea>
    </div>

    <div class="gallery__container" v-if="place.name || room.name">
      <h2>Pictures</h2>
      <div class="gallery">
        <div v-for="picture in currentPictures" :key="picture" class="gallery__item">
          <img :src="`${$baseUrl}/img/${picture}`" class="gallery__item-image">
          <img :src="`${$baseUrl}/icons/trash.svg`" class="gallery__item-button" @click="deletePicture(picture)">
        </div>
        <div v-for="picture in addedPictures" :key="picture" class="gallery__item">
          <img :src="picture" class="gallery__item-image">
          <img :src="`${$baseUrl}/icons/trash.svg`" class="gallery__item-button" @click="deleteNewPicture(picture)">
        </div>
        <input class="form__picture" type="file" id="file" ref="file" multiple accept="image/*" @change="addPlacePicture()">
        <label for="file" class="gallery__item">
          <img :src="`${$baseUrl}/icons/plus.svg`">
          <div>PHOTO</div>
        </label>
      </div>
    </div>

    <div v-if="place.id && !room.id && !this.isNewRoom">
      <h2 v-if="currentRooms.length">Rooms</h2>
      <Rooms
        v-for="room in currentRooms"
        :key="room.id"
        :room="room"
        buttonIcon="pensil.svg"
        buttonText="Edit"
        @roomClick="getRoom(room)"
      />
      <MyButton title="Add new room" @click="createNewRoom"/>
    </div>

    <div class="form__buttons">
      <MyButton v-if="this.isNewObject" :title="buttonTitle" :isDisabled="!isFilledPictures || !isFilledForm || isLoading" @click="addNewPlace"/>
      <MyButton v-if="this.isNewRoom" :title="buttonTitle" :isDisabled="!isFilledPictures || !isFilledRoomForm || isLoading" @click="addNewRoom"/>
      <MyButton v-if="place.id && !this.isNewRoom" title="Save" @click="edit"/>
      <MyButton v-if="place.id || room.id || this.isNewObject" title="Cancel" isRed="true" @click="cancel"/>
      <MyButton v-if="place.id && !this.isNewRoom" title="Delete" :isRedEmpty="true" @click="deleteIt"/>
    </div>
  </div>
</template>

<script>
import MyButton from './CustomComponents/MyButton.vue'
import RoutePoint from './CustomComponents/RoutePoint.vue'
import Rooms from './CustomComponents/Rooms.vue'
import { placeFields } from '../data/place.data'
import { validation } from '../services/validation.service'

export default {
  components: {
    MyButton,
    RoutePoint,
    Rooms
  },
  data: () => ({
    place: {},
    room: {},
    features: [],
    hiddenOnly: false,
    addedPictures: [],
    isLoading: false,
    feature: '',
    isNewObject: false,
    isNewRoom: false,
    validation: {},
    placeFields,
  }),
  computed: {
    myPlaces() {
      return this.hiddenOnly ? this.$store.state.placesModule.myPlaces.filter((item) => item.isAccepted !== 1) : this.$store.state.placesModule.myPlaces
    },
    isShowForm() {
      return this.place.id && !this.room.id && !this.isNewRoom || this.isNewObject
    },
    isDesktop(){
      return this.$store.state.appModule.isDesktop
    },
    currentPictures() {
      return this.isNewRoom ? [] : this.$store.state.placesModule.pictures.filter(picture => 
        this.room.id ? picture.roomId === this.room.id : picture.roomId === null).map(picture => picture.fileName)
    },
    isAdmin(){
      return this.$store.state.userModule.user.role === "admin"
    },
    buttonTitle() {
      return this.isAdmin ? "Add" : "Sent for verification"
    },
    isFilledForm() {
      return Object.values(this.place).filter((item) => item !== "").length > 8
    },
    isFilledRoomForm() {
      return Object.values(this.room).filter((item) => item !== "").length > 3
    },
    isFilledPictures() {
      return (this.currentPictures.length + this.addedPictures.length) > 1
    },
    currentRooms() {
      return this.$store.state.placesModule.rooms
    },
    featuresList() {
      return this.$store.state.placesModule.featuresList
    },
  },
  methods: {
    validate(fieldName){
      this.validation[fieldName] = validation(this.place[fieldName], fieldName)
    },
    addNewPlace(){
      this.isLoading = true
      this.$store.dispatch('addNewPlace', [this.place, this.$refs.file.files])
      this.place = {}
      this.addedPictures = []
      this.isNewObject = false
      this.isLoading = false
    },
    addNewRoom(){
      this.isLoading = true
      this.$store.dispatch('addNewRoom', [this.room, this.place.id, this.features, this.$refs.file.files])
      this.room = {}
      this.addedPictures = []
      this.isNewRoom = false
      this.isLoading = false
    },
    edit() {
      this.room.id ? this.editRoom() : this.editPlace()
    },
    deleteIt() {
      this.room.id ? this.deleteRoom() : this.deletePlace()
    },
    createNewObject() {
      window.scroll(0, 0)
      this.addedPictures = []
      this.$store.commit('setPictures', [])
      this.isNewObject = true
    },
    createNewRoom() {
      window.scroll(0, 0)
      this.$store.dispatch("getFeaturesList")
      this.isNewRoom = true
      this.addedPictures = []
      this.features = []
    },
    addFeature(){
      if(!this.features.find(feature => feature.name === this.feature) && this.feature) { 
        this.features.push({roomId: this.room.id ,name:this.feature, placeId: this.place.id}) 
        }
      this.feature = ''
    },
    deleteFeature(feature){
      this.features.splice(this.features.indexOf(feature), 1)
    },
    editPlace(){
      this.isLoading = true
      delete this.place.picture
      const pictures = this.$refs.file.files
      if (this.addedPictures.length){
        this.$store.dispatch('editPlace', [this.place, pictures])
      } else {
      this.$store.dispatch('editPlace', [this.place])
      }
      this.place = {}
      this.addedPictures = []
      this.$store.commit('setPictures', [])
      this.isLoading = false
    },
    editRoom(){
      this.isLoading = true
      const pictures = this.$refs.file.files
      if (this.addedPictures.length){
        this.$store.dispatch('editRoom', [this.room, this.features, this.place.id, pictures])
      } else {
        this.$store.dispatch('editRoom', [this.room, this.features, this.place.id,])
      }
      this.room = {}
      this.addedPictures = []
      this.$store.commit('setPictures', [])
      this.isLoading = false
    },
    deletePlace(){
      this.$store.dispatch('deletePlace', this.place.id)
      this.$store.commit('setPictures', [])
      this.place = {}
    },
    deleteRoom(){
      const inputs = [this.room.id, this.place.id]
      this.$store.dispatch('deleteRoom', inputs)
      this.$store.commit('setPictures', [])
      this.room = {}
    },
    getPlace(place) {
      this.place = place
      this.$store.dispatch("getRooms", this.place.id)
      this.$store.dispatch("getFeatures", {placeId: this.place.id})
    },
    getRoom(room) {
      this.room = room
      this.$store.dispatch("getFeaturesList")
      this.features = this.$store.state.placesModule.features.filter(feature => feature.roomId === room.id)
    },
    addPlacePicture(){
      const files = this.$refs.file.files
      Array.from(files).forEach(file => {
          const reader = new FileReader()
          reader.onload = () => {
          this.addedPictures.push(reader.result)
        }
        reader.readAsDataURL(file)
      })
    },
    deleteNewPicture(picture) {
      this.addedPictures.splice(this.addedPictures.indexOf(picture),1)
    },
    deletePicture(picture) {
      this.$store.dispatch("deletePicture", picture)
      this.$store.dispatch("getPictures", this.place.id)
    },
    options(fieldName) {
      return new Set(this.myPlaces.map((place) => place[fieldName]))
    },
    cancel() {
      if (this.room.id || this.isNewRoom) {
        this.room = {}
        this.isNewRoom = false
        this.addedPictures = []
      } else {
        if (this.place.id || this.isNewObject) {
          this.place = {}
          this.isNewObject = false
          this.addedPictures = []
        }
      }
    }
  },
  created() {
    this.$store.dispatch("getMyPlaces")
  }
}

</script>

<style lang="scss" scoped>
.page {
  padding: 3% 20%;
  &-mobile {
    padding: 3%;
  }
}

.form {
  @include grid-g20;
  margin: 20px 0;
}

.form__item {
  display: grid;
  grid-template-columns: 100px 1fr;
  text-align: start;
  align-items: center;
}

.form__input {
  @include input;
  width: 100%;
  &-features{
    height: 37px;
    border-radius: 5px 0 0 5px;
  }
}

.form__textarea {
  @include input;
  box-sizing: border-box;
  height: 60px;
  padding: 15px;
  width: 100%;
  height: 200px;
  resize: vertical;
}

.form__header {
  justify-self: center;
  margin: 0;
}

.gallery__item {
  height: 200px;
  width: 300px;
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 15px;
  font-size: 1.3em;
  font-weight: 400;
  color: rgb(0, 201, 134);
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: solid rgb(190, 190, 190) 1px;
}

.gallery__item-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  filter: brightness(0.9);
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
.form__picture {
  display: none;
}

.form__buttons {
  display: grid;
  grid-auto-flow: column;
  gap: 20px;
  margin-top: 100px;
}
.gallery__item-button{
  position: absolute;
  width: 20px;
  height: 20px;
  right: 15px;
  top: 15px;
  cursor: pointer;
}
.features {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.feature {
  display: flex;
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
.select__reset-button {
  width: 22px;
  height: 22px;
}
.features__input {
  display:grid;
  grid-template-columns: 150px 40px;
  height: 100%;
}
.gallery__container {
  margin: 20px 0;
}
.input-text-wrong {
  color: red;
  font-size: 0.6em;
  text-align: start;
}
</style>