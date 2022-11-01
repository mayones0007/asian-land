<template>
  <div class="registration">
    <div class="registration__form">
      <h2>Registration</h2>
        <div v-for="field in userFields" :key="field.name">
          <div class="form__input">
            <input
              class="form__input-text"
              v-model="user[field.name]"
              :type="field.currentType || field.type"
              :placeholder="field.placeholder"
              @blur="validate(field.name)"
            >
            <img
              v-if="field.type === 'password'"
              class="form__input-password"
              :src="`${$baseUrl}/icons/eye-${!!field.show}.png`"
              @click="togglePasswordVisibility(field.name)"
            >
          </div>
          <div v-if="this.validation[field.name]" class="input-text-wrong">{{this.validation[field.name]}}</div>
        </div>
      <MyButton 
        title="Sign up"
        :isDisabled="!inputIsCorrect"
        @click="registration"
      />
      <div>Already registered?
        <a class="registration__link" @click="setLoginPopup">Sign in</a>
      </div>
    </div>
  </div>
</template>

<script>
import MyButton from './CustomComponents/MyButton.vue'
import { validation } from '../services/validation.service'
import { userFields } from '../data/user.data'
export default {
  components: {
    MyButton,
  },
  data: () => ({
    userFields,
    user: {},
    validation: {},
  }),
  computed: {
    inputIsCorrect(){
      return !Object.values(this.validation).reduce((a, b) => a + b, '') && Object.values(this.user).length > 4
    },
  },
  methods: {
    validate(fieldName){
      this.validation[fieldName] = validation(this.user[fieldName], fieldName)
    },
    setLoginPopup(){
      this.$store.commit('setLoginPopup')
    },
    registration(){
      this.$store.dispatch('registration', this.user)
    },
    togglePasswordVisibility(fieldName){
      const field = this.userFields.find(field => field.name === fieldName)
      if(field.currentType === 'text') {
        field.currentType = 'password'
        field.show = false
      } else {
        field.currentType = 'text'
        field.show = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.registration {
  width: 350px;
  margin: 100px auto;
}

.registration__form {
  display: grid;
  gap: 20px;
  text-align: center;
}

.registration__link {
  color: green;
  cursor: pointer;
  text-decoration: underline;
}

.form__input-text {
  @include input;
}

.input-text-wrong {
  color: red;
  font-size: 0.6em;
  text-align: start;
}

.form__input {
  display: grid;
  grid-template-columns: 1fr 0;
}

.form__input-password {
  width: 20px;
  height: 20px;
  margin: auto 0;
  margin-left: -30px;
  cursor: pointer;
}
</style>