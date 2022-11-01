import { Request } from "express"
import { models } from "../models/index"
import { Feature, FeaturesList } from "../models/feature.model"
import { AppResponse } from "./response.model"

export class FeatureController {
  async getFeatures(req: Request): Promise<AppResponse<Feature[]>> {
    const id = req.query
    const features = await models.feature.getFeatures(id)
    return {
      status: 200,
      body: features,
    }
  }
  async getFeaturesList(): Promise<AppResponse<FeaturesList[]>> {
    const features = await models.feature.getFeaturesList()
    return {
      status: 200,
      body: features,
    }
  }
}