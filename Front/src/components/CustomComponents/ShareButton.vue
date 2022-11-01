<template>
  <div class="share-button">
    <img :src="`${$baseUrl}/icons/share.svg`" alt="share" class="share-button__icon" @click="setShowShareLinks()">
    <div v-if="showShareLinks" class="share-button__links">
      <a v-for="social in socials" :key="social.alt" :href="social.shareref + this.$route.path" target="_blank">
        <img :src="social.icon" :alt="social.alt" class="links__item">
      </a>
    </div>
  </div>
</template>

<script>
import { socials } from '../../data/socials.data'

export default {
  data() {
    return {
      socials: socials,
      showShareLinks: false,
    };
  },
  methods: {
    setShowShareLinks() {
      this.showShareLinks = !this.showShareLinks
    }
  }
}
</script>

<style lang='scss' scoped>
.share-button {
  position: relative;
  cursor: pointer;
  align-self: center;
  justify-self: center;
  height: 20px;
  width: 20px;
}

.share-button__icon {
  height: 100%;
  width: 100%;
}

.share-button__links {
  position: absolute;
  display: grid;
  top: 35px;
  right: 50%;
  transform: translate(50%,0);
  background-color: #ffffff;
  border-radius: 5px;
}

.links__item {
  width: 30px;
  height: 30px;
  padding: 5px;
  filter: invert(0.8);
  border-radius: 5px;
  &:hover {
    background-color: #000000;
  }
}

a {
  font-size: 0;
}
</style>