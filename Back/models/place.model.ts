import { knexService } from '../db/index'

export interface NewPlace {
  name: string,
  category: string,
  region: string,
  city: string,
  difficulty: string,
  availability: string,
  time: number,
  description: string,
  coords: string,
  isAccepted: number | null,
  createdAt: Date,
}

export interface Place extends NewPlace{
  id: number,
}

interface DbQuery {
  [key: string]: any
}

export class PlaceModel {
  async getPlace(dbQuery: DbQuery): Promise<Place> {
    return await knexService('places').where(dbQuery).first()
      .then((place) => {
        return place
      })
  }
  async getPlaces(role: string): Promise<Place[]> {
    return await knexService('places').leftJoin('pictures', 'places.id', 'pictures.placeId')
    .where('roomId', null)
    .select('places.*', 'pictures.fileName as picture')
    .groupBy('places.id')
    .modify(function(query) {
      if(role === 'user'){
        query.where('isAccepted', 1) 
      }
     })
    .then((places) => {
      return places
    })
  }

  async getMyPlaces(dbQuery: DbQuery, role: string): Promise<Place[]> {
    return await knexService('places').leftJoin('pictures', 'places.id', 'pictures.placeId')
      .select('places.*', 'pictures.fileName as picture')
      .groupBy('places.id')
      .modify(function (query) {
        if (role !== 'admin') {
          query.where(dbQuery)
        }
      })
      .then((places) => {
        return places
      })
  }
  
  async addPlace(place: NewPlace): Promise<number> {
    return await knexService('places').insert(place)
      .then((id) => {
        return id[0]
      })
  }
  async editPlace(place: Place, role: string): Promise<void> {
    const placeBody = (({ id, ...o }) => o)(place)
    if (role !== 'admin') {
      placeBody.isAccepted = null
    }
    const id = place.id
    await knexService('places').where({ id }).update(placeBody).catch((err) => console.log(err))
  }
  async deletePlace(id: string): Promise<void> {
    const promises = []
    promises.push(knexService('places').where({ id }).del())
    promises.push(knexService('favorites').where({placeId: id}).del())
    promises.push(knexService('pictures').where({ placeId: id }).del())
    promises.push(knexService('reviews').where({ placeId: id }).del())
    promises.push(knexService('routes').where({ placeId: id }).del())
    promises.push(knexService('features').where({ placeId: id }).del())
    promises.push(knexService('rooms').where({ placeId: id }).del())
    Promise.all(promises)
  }
}