import { knexService } from '../db/index'

export interface Feature {
  id: number,
  name: string,
  placeId: number,
  roomId: number,
}
export interface FeaturesList {
  name: string,
}

interface DbQuery {
  [key: string]: any
}

export class FeatureModel {
  async getFeatures(dbQuery: DbQuery): Promise<Feature[]> {
    return await knexService('features').where(dbQuery).select('roomId', 'name', 'placeId')
      .then((features) => {
        return features
      })
  }
  async getFeaturesList(): Promise<FeaturesList[]> {
    return await knexService('features').distinct().pluck('name')
      .then((features) => {
        return features
      })
  }
  async editFeatures(features: Feature[]): Promise<void> {
    const roomId = features[0].roomId
    await knexService('features').where({ roomId }).del()
    await knexService('features').insert(features).catch((err) => console.log(err))
  }
}