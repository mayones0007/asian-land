<template>
  <div class="background" @click.self="setLoginPopup">
    <div class="login-window"  :class="{'login-window-mobile': !isDesktop}" @keyup.esc.stop="setLoginPopup" @keyup.enter.stop="login">
      <h2>Sign in</h2>
      <div class="button-close" @click="setLoginPopup"/>
      <div class="form">
        <input class="form__input-text" ref="name" v-model="email" type="text" placeholder="E - mail" tabindex="-1">
        <input class="form__input-text" v-model="password" type="password" placeholder="Password">
        <MyButton @click="login" title="Log In"/>
        <div>Not registered yet? <router-link :to="{name: $options.routeNames.registration}" @click="setLoginPopup">Register</router-link></div>
      </div>
    </div>
  </div>
</template>

<script>
import MyButton from './MyButton.vue'
import { routeNames } from '../../router'
export default {
  routeNames,
  name: 'LoginPopup',
  components: {
    MyButton,
  },
  data: () => ({
    email: '',
    password: ''
  }),
  computed: {
    isDesktop(){
      return this.$store.state.appModule.isDesktop
    },
  },
  methods: {
    setLoginPopup(){
      this.$store.commit('setLoginPopup')
    },
    login(){
      this.$store.dispatch('login', {email:this.email, password:this.password})
    },
  },
  mounted() {
    this.$refs.name.focus();
  }
}
</script>

<style lang="scss" scoped> 
.background {
  @include background_popup;
}

.login-window {
  position: fixed;
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  background-color: white;
  width: 340px;
  border-radius: 10px;
  padding: 30px;
  transform:translate(-50%,-50%);
  text-align: center;
}

.login-window-mobile {
  width: 80%;
}

.form {
  display: grid;
  gap: 20px;
}

.button-close {
  position: absolute;
  background: url("https://marshrutka.su/api/icons/close-btn.png") center/100% no-repeat;
  width: 25px;
  height: 25px;
  right: 20px;
  top: 20px;
  cursor: pointer;
}

.button-close:hover {
  filter: brightness(0.5);
}

.form__link {
  color: rgb(0, 212, 141);
}

.form__link:hover {
  filter: brightness(0.5);
}

.form__input-text {
  @include input;
}
</style>