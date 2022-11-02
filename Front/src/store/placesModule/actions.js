import { axiosInstance } from '../../httpClient'
import { compressAndRenamePicture } from "../../services/file.service"

export const actions = {

  async getPlaces({ commit }) {
    try {
      const response = await (await axiosInstance.get('places'))
      const places = response.data
      commit("setPlaces", response.data)
      const regions = [...places.map((place) => place.region), ...places.map((place) => place.city)]
        .reduce((acc, el) => {
          acc[el] = (acc[el] || 0) + 1
          return acc
        }, {})
      commit("setRegions", regions)
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async getMyPlaces({ commit }) {
    try {
      const response = await axiosInstance.get('myplaces')
      commit("setMyPlaces", response.data)
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async getPlace({ commit, dispatch }, id) {
    try {
      const response = await axiosInstance.get(`place?id=${id}`)
      dispatch("getPictures", id)
      dispatch("getReviews", id)
      dispatch("getRooms", id)
      commit("setPlace", response.data)
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async getRooms({ commit, dispatch }, id) {
    try {
      const response = await axiosInstance.get(`rooms?id=${id}`)
      dispatch("getPictures", id)
      commit("setRooms", response.data)
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async getReviews({ commit }, id) {
    try {
      const response = await axiosInstance.get('review', { params: { id } })
      commit('setReviews', response.data)
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async getPictures({ commit }, id) {
    try {
      const response = await axiosInstance.get('pictures', { params: { id } })
      commit('setPictures', response.data)
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async getFeatures({ commit }, id) {
    try {
      const response = await axiosInstance.get('features', { params: id})
      commit('setFeatures', response.data)
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async getFeaturesList({ commit }) {
    try {
      const response = await axiosInstance.get('featureslist')
      commit('setFeaturesList', response.data)
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async newReview({ state, dispatch, rootState }, inputs) {
    try {
      await axiosInstance.post('review', {
        text: inputs.text,
        raiting: inputs.raiting,
        userId: rootState.userModule.user.id,
        placeId: state.place.id,
        createdAt: new Date()
      })
      dispatch("getReviews", state.place.id)
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async deleteReview({ state, dispatch }, id) {
    try {
      await axiosInstance.delete('review', { params: { id, placeId: state.place.id } })
      dispatch("getReviews", state.place.id)
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async addNewPlace({ dispatch }, newPlace) {
    try {
      const formData = new FormData()
      formData.append('place', JSON.stringify(newPlace.place))
      const files = []
      Object.values(newPlace.files).forEach(file => {
        files.push(compressAndRenamePicture(file))
      })
      return Promise.all(files).then(async (list) => {
        list.forEach(file => formData.append('images', file))
        const response = await axiosInstance.post('place', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        dispatch("getMyPlaces")
        return response.status
      })
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async addNewRoom({ dispatch }, newRoom) {
    try {
      const formData = new FormData()
      const placeId = newRoom.placeId
      formData.append('room', JSON.stringify(newRoom.room))
      formData.append('placeId', placeId)
      formData.append('features', JSON.stringify(newRoom.features))
      const files = []
      Object.values(newRoom.files).forEach(file => {
        files.push(compressAndRenamePicture(file))
      })
      return Promise.all(files).then(async (list) => {
        list.forEach(file => formData.append('images', file))
        const response = await axiosInstance.post('room', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        dispatch("getRooms", placeId)
        dispatch("getFeatures", { placeId })
        return response.status
      })
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async editPlace({ dispatch }, inputs) {
    try {
      const formData = new FormData()
      formData.append('place', JSON.stringify(inputs[0]))
      const files = []
        if(inputs.length > 1) {
        Object.values(inputs[1]).forEach((file) => {
          files.push(compressAndRenamePicture(file))
        })
      }
      Promise.all(files).then(async(list) => {
        list.forEach(file => formData.append('images', file))
        await axiosInstance.patch('place', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        dispatch("getMyPlaces")
      })
    }
     catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async editRoom({ dispatch }, inputs) {
    try {
      const formData = new FormData()
      formData.append('room', JSON.stringify(inputs[0]))
      formData.append('features', JSON.stringify(inputs[1]))
      formData.append('placeId', JSON.stringify(inputs[2]))
      const files = []
      if (inputs.length > 3) {
        Object.values(inputs[3]).forEach((file) => {
          files.push(compressAndRenamePicture(file))
        })
      }
      Promise.all(files).then(async (list) => {
        list.forEach(file => formData.append('images', file))
        await axiosInstance.patch('room', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        dispatch("getRooms", inputs[2])
        dispatch("getFeatures", {placeId: inputs[2]})
      })
    }
    catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async deletePlace({ dispatch }, id) {
    try {
      await axiosInstance.delete('place', { params: { id } })
      dispatch("getMyPlaces")
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async deleteRoom({ dispatch }, inputs) {
    try {
      await axiosInstance.delete('room', { params: { id: inputs[0] } })
      dispatch("getRooms", inputs[1])
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },

  async addPlacePicture(_context, inputs) {
    const formData = new FormData()
    formData.append('id', inputs[0])
    Object.values(inputs[1]).forEach(file => {
      formData.append('images', file)
    })
    try {
      await axiosInstance.post('pictures', formData, {headers:{'Content-Type': 'multipart/form-data'}})
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },
  
  async deletePicture(_context, fileName) {
    try {
      await axiosInstance.delete('pictures', { params: { fileName } })
    } catch (e) {
      console.log("Ошибка HTTP: " + e)
    }
  },
}