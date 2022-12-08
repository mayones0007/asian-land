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
      <div v-for="group in this.placeFields" :key="group.groupName" class="form">
        <h2 class="form__header">{{group.groupName}}</h2>
        <div v-for="field in group.fields" :key="field.name">
          <div v-if="field.fieldName === 'features'" class="form__item">
            <label for="features">Features</label>
            <div class="features">
              <div v-for="feature in this.placeFeatures" :key="feature" class="feature feature-light">
                {{feature.name}}
                <img :src="`${$baseUrl}/icons/close.svg`" alt="close" class="select__reset-button" @click="deletePlaceFeature(feature, this.placeFeatures)">
              </div>
              <div class="features__input">
                <input class="form__input form__input-features" id="features" type="text" list="featuresList" v-model="feature">
                <MyButton title="Add" :noLeftRadius="true" @click="addPlaceFeature(this.placeFeatures)"/>
              </div>
              <datalist id="featuresList">
                <option v-for="feature in featuresList" :key="feature">{{feature}}</option>
              </datalist>
            </div>
          </div>
          <div v-else class="form__item">
            <label :for="field.fieldName">{{field.name}}{{field.required ? '*' : ''}}</label>
            <div>
              <input 
                class="form__input"
                :id="field.fieldName"
                v-model="place[field.fieldName]" 
                :placeholder="field.placeholder"
                :type="field.type"
                :list="field.name"
                @blur="validate(field, this.place)"
              >
              <datalist v-if="field.autofull" :id="field.name">
                <option v-for="option in options(field.fieldName)" :key="option">{{option}}</option>
              </datalist>
              <div v-if="this.validation[field.fieldName]" class="input-text-wrong">{{this.validation[field.fieldName]}}</div>
            </div>
          </div>
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
      <div v-for="field in this.roomFields" :key="field.name" class="form__item">
        <label :for="field.fieldName">{{field.name}}{{field.required ? '*' : ''}}</label>
        <div>
          <input 
            class="form__input"
            :id="field.fieldName"
            v-model="room[field.fieldName]" 
            :placeholder="field.placeholder"
            :type="field.type"
            :list="field.name"
            @blur="validate(field, this.room)"
          >
          <datalist v-if="field.autofull" :id="field.name">
            <option v-for="option in options(field.fieldName)" :key="option">{{option}}</option>
          </datalist>
          <div v-if="this.validation[field.fieldName]" class="input-text-wrong">{{this.validation[field.fieldName]}}</div>
        </div>
      </div>
      <div class="form__item">
        <label for="features">Features</label>
        <div class="features">
          <div v-for="feature in this.features" :key="feature" class="feature feature-light">
            {{feature.name}}
            <img :src="`${$baseUrl}/icons/close.svg`" alt="close" class="select__reset-button" @click="deleteFeature(feature, this.features)">
          </div>
          <div class="features__input">
            <input class="form__input form__input-features" id="features" type="text" list="featuresList" v-model="feature">
            <MyButton title="Add" :noLeftRadius="true" @click="addFeature(this.features)"/>
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
        <div v-for="(picture, index) in addedPictures" :key="picture" class="gallery__item">
          <img :src="picture" class="gallery__item-image">
          <img :src="`${$baseUrl}/icons/trash.svg`" class="gallery__item-button" @click="deleteNewPicture(index)">
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
    <LoadSpinner
      v-if="isLoading"
    />
  </div>
</template>

<script>
import MyButton from './CustomComponents/MyButton.vue'
import RoutePoint from './CustomComponents/RoutePoint.vue'
import LoadSpinner from './CustomComponents/LoadSpinner.vue'
import Rooms from './CustomComponents/Rooms.vue'
import { placeFields } from '../data/place.data'
import { roomFields } from '../data/room.data'
import { validation } from '../services/validation.service'

export default {
  components: {
    MyButton,
    RoutePoint,
    Rooms,
    LoadSpinner
  },
  data: () => ({
    place: {},
    room: {},
    features: [],
    placeFeatures: [],
    hiddenOnly: false,
    addedPictures: [],
    files: [],
    isLoading: false,
    feature: '',
    isNewObject: false,
    isNewRoom: false,
    validation: {},
    placeFields,
    roomFields
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
      return this.isNewRoom || this.isNewObject ? [] : this.$store.state.placesModule.pictures.filter(picture => 
        this.room.id ? picture.roomId === this.room.id : picture.roomId === null).map(picture => picture.fileName)
    },
    isAdmin(){
      return this.$store.state.userModule.user.role === "admin"
    },
    buttonTitle() {
      return this.isAdmin ? "Add" : "Sent for verification"
    },
    isFilledForm() {
      return Object.values(this.validation).every(value => value === '') && this.placeFields.every(field => !field.required || !!this.place[field.fieldName])
    },
    isFilledRoomForm() {
      return Object.values(this.validation).every(value => value === '') && this.roomFields.every(field => !field.required || !!this.room[field.fieldName])
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
    validate(field, model){
      this.validation[field.fieldName] = validation(model[field.fieldName], field.fieldName)
    },
    async addNewPlace(){
      this.isLoading = true
      const status = await this.$store.dispatch('addNewPlace', {place: this.place, features: this.placeFeatures, files: this.files})
      if (status === 200) {
        this.$store.dispatch("getMyPlaces")
        this.clearPlace()
        this.isNewObject = false
      }
      this.isLoading = false
    },
    async addNewRoom(){
      this.isLoading = true
      const status = await this.$store.dispatch('addNewRoom', {room: this.room, placeId: this.place.id, features: this.features, files: this.files})
      if (status === 200) {
        this.clearRoom()
        this.isNewRoom = false
      }
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
      this.files = []
      this.addedPictures = []
      this.placeFeatures = []
      this.isNewObject = true
    },
    createNewRoom() {
      window.scroll(0, 0)
      this.files = []
      this.addedPictures = []
      this.features = []
      this.isNewRoom = true
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
    addPlaceFeature(){
      if(!this.placeFeatures.find(feature => feature.name === this.feature) && this.feature) { 
        this.placeFeatures.push({roomId: this.room.id ,name:this.feature, placeId: this.place.id}) 
        }
      this.feature = ''
    },
    deletePlaceFeature(feature){
      this.placeFeatures.splice(this.placeFeatures.indexOf(feature), 1)
    },
    editPlace(){
      this.isLoading = true
      delete this.place.picture
      if (this.addedPictures.length){
        this.$store.dispatch('editPlace', {place: this.place, features: this.placeFeatures, files: this.files})
      } else {
      this.$store.dispatch('editPlace', {place: this.place, features: this.placeFeatures})
      }
      this.clearPlace()
      this.isLoading = false
    },
    editRoom(){
      this.isLoading = true
      if (this.addedPictures.length){
        this.$store.dispatch('editRoom', {room: this.room, placeId: this.place.id, features: this.features, files: this.files})
      } else {
        this.$store.dispatch('editRoom', {room: this.room, placeId: this.place.id, features: this.features})
      }
      this.clearRoom()
      this.isLoading = false
    },
    deletePlace(){
      this.$store.dispatch('deletePlace', this.place.id)
      this.clearPlace()
    },
    deleteRoom(){
      this.$store.dispatch('deleteRoom', {id: this.room.id, placeId: this.place.id})
      this.clearRoom()
    },
    async getPlace(place) {
      this.place = place
      await this.$store.dispatch("getRooms", this.place.id)
      await this.$store.dispatch("getFeatures", {placeId: this.place.id})
      await this.$store.dispatch("getFeaturesList")
      this.placeFeatures = this.$store.state.placesModule.features.filter(feature => feature.roomId === null)
    },
    getRoom(room) {
      this.room = room
      this.features = this.$store.state.placesModule.features.filter(feature => feature.roomId === room.id)
    },
    addPlacePicture(){
      this.files = [...this.files, ...this.$refs.file.files]
      Array.from(this.$refs.file.files).forEach(file => {
          const reader = new FileReader()
          reader.onload = () => {
          this.addedPictures.push(reader.result)
        }
        reader.readAsDataURL(file)
      })
    },
    deleteNewPicture(index) {
      this.files.splice(index,1)
      this.addedPictures.splice(index,1)
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
        this.isNewRoom = false
        this.clearRoom()
      } else if (this.place.id || this.isNewObject) {
        this.isNewObject = false
        this.clearPlace()
      }
    },
    clearRoom() {
      this.room = {}
      this.files = []
      this.addedPictures = []
    },
    clearPlace() {
      this.place = {}
      this.files = []
      this.addedPictures = []
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
.spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1;
}
</style>