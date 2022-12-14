<template>
  <div class="header">
    <router-link :to="{name: $options.routeNames.places}" class="logo">
      <div class="logo__name">asian.land</div>
    </router-link>
    <Search
      v-if="isDesktop || isStartPage"
      :class="{'search-form-mobile': !isDesktop}"
    />
    <div v-if="user.name" :class="{'user-menu': isDesktop, 'user-menu-mobile': !isDesktop}" @click="toggleMenuSize" @click.self="toggleMenuSize">
      <Avatar
        :userName="user.name"
        :userImg="`${$baseUrl}/avatars/`+ user.avatar"
        :hideName="!isDesktop"
      />
      <img v-if="isLogIn" :src="`${$baseUrl}/icons/arrow.png`" alt="arrow" class="user-menu__arrow" :class="{'user-menu__arrow-down': isFullMenuSize && !isDesktop}">
      <div class="user-menu__dropdown-content" v-if="isLogIn && isFullMenuSize">
        <router-link :to="{name: $options.routeNames.myFavorites}" class="dropdown-content__link">My Favorites</router-link>
        <router-link :to="{name: $options.routeNames.newPlace}" class="dropdown-content__link">My Objects</router-link>
        <router-link :to="{name: $options.routeNames.settings}" class="dropdown-content__link">Settings</router-link>
        <div class="dropdown-content__link" @click="setLoginPopup">Log out</div>
      </div>
    </div>
    <MyButton
      v-if="!isLogIn"
      title="Sign in"
      @click="setLoginPopup"
      icon="login.svg"
    />
  </div>
</template>

<script>
import { router, routeNames } from '../../router'
import Avatar from './Avatar.vue'
import Search from './Search.vue'
import MyButton from './MyButton.vue'
import { isDesktop } from '../../services/screenSize.service'
export default {
  name: 'Header',
  components: {
    Avatar,
    Search,
    MyButton
  },
  routeNames,
  data: () => ({
    selectedRegion: '',
    isFullMenuSize: isDesktop(),
  }),
  computed:{
    user() {
      return this.$store.state.userModule.user
    },
    isLogIn(){
      return !!this.user.name
    },
    isDesktop(){
      return this.$store.state.appModule.isDesktop
    },
    isStartPage(){
      return this.$route.fullPath  === '/'
    }
  },

  methods: {
    setLoginPopup(){
      if (this.isLogIn){
        this.$store.dispatch('logOut')
      } else {
        this.$store.commit('setLoginPopup')
      }
    },
    setSelectedRegion () {
      this.$store.commit('setSelectedRegion', this.selectedRegion)
      window.scroll(0, 530)
      if (router.currentRoute.name !== 'MyPlaces') {
        router.push({ name: routeNames.places })
      }
      this.selectedRegion = ""
    },
    toggleMenuSize() {
      if(!isDesktop()) {
        this.isFullMenuSize = !this.isFullMenuSize
      }
    },
  },
}
</script>

<style lang="scss" scoped> 
.header {
  @include panel(to bottom);
}

.logo {
  @include flex-between-center-g15;
  text-decoration: none;
  color: #29333f;
  height: 30px;
  font-size: 1.6em;
  font-weight: 400;
  gap: 5px;
  align-items: flex-end;
}

.logo__icon {
  height: 40px;
}

.logo__name {
  line-height: 25px;
}

.search-form {
  display: flex;
}
.search-form-mobile {
  position: absolute;
  top: 120px;
}
.search-form__input-text {
  @include input;
  height: 40px;
  border-radius: 5px 0 0 5px;
  width: 20vw;
  min-width: 200px;
}

.user-menu__arrow {
  transition-duration: 400ms;
  width: 20px;
  height: 20px;
  padding: 8px;
  border-radius: 50%;
  background-color: white;
  transform: rotate(-180deg);
  border: solid 1px rgba(0, 0, 0, 0.076);
}

.user-menu__arrow-down {
  transform: rotate(0deg);
}

.login-panel__button-login {
  cursor: pointer;
  padding: 10px;
}

.login-panel__button-login:hover {
  color: green;
}

.user-menu {
  @include flex-between-center-g15;
  position: relative;
  font-size: 1.1em;
  font-weight: 300;
  z-index: 2;
  height: 80px;
}

.user-menu-mobile {
  @include flex-between-center-g15;
  position: relative;
  font-size: 1.1em;
  font-weight: 300;
  z-index: 2;
  height: 80px;
}

.user-menu__dropdown-content {
  position: absolute;
  top: 80px;
  right: -10px;
  background-color: #f1f1f1;
  min-width: 160px;
  -webkit-appearance: none;
  box-shadow: 0px 8px 8px 0px rgba(0,0,0,0.1);
  border-radius: 0 0 5px 5px;
}

.dropdown-content__link {
  display: grid;
  text-decoration: none;
  color: transparent;
  transition-duration: 300ms;
  font-size: 0.9em;
  line-height: 0%;
  font-weight: 300;
  text-align: end;
  padding: 0 15px;
}

.dropdown-content__link:last-child:hover {
  border-radius: 0 0 5px 5px;
  color: red !important;
  cursor: pointer;
}

.dropdown-content__link:hover {
  background-color: #ddd;
}

.user-menu:hover .user-menu__arrow {
  transform: rotate(0deg);
}

.user-menu:hover .dropdown-content__link {
  line-height: 300%;
  color: black;
}
.user-menu-mobile .dropdown-content__link {
  line-height: 300%;
  color: black;
}
</style>
