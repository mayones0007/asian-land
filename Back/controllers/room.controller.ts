import { Request } from "express"
import { models } from "../models/index"
import { Room } from "../models/room.model"
import { Feature } from "../models/feature.model"
import { AppResponse } from "./response.model"
import { fileService } from "../services/file.service"

export class RoomController {
  async getRooms(req: Request): Promise<AppResponse<Room[]>> {
    const placeId = req.query.id
    const rooms = await models.room.getRooms({ placeId })
    return {
      status: 200,
      body: rooms,
    }
  }
  async addRoom(req: Request): Promise<AppResponse> {
    if (req.files) {
      const room = JSON.parse(req.body.room)
      const features = JSON.parse(req.body.features)
      const files = req.files.images
      const placeId = JSON.parse(req.body.placeId)
      room.placeId = placeId
      const roomId = await models.room.addRoom(room)
      features.forEach((feature: Feature) => feature.roomId = roomId)
      await models.feature.editFeatures(features)
      await models.picture.savePictures(placeId, roomId, files)
      fileService.saveFiles('img', files)
      return {
        status: 200,
        body: { message: 'Room added' },
      }
    } else {
      return {
        status: 400,
        body: { message: 'File transfer error' },
      }
    }
  }
  async editRoom(req: Request): Promise<AppResponse> {
    const room = JSON.parse(req.body.room)
    const features = JSON.parse(req.body.features)
    const roomId = room.id
    const placeId = JSON.parse(req.body.placeId)
    room.placeId = placeId
    await models.room.editRoom(room)
    await models.feature.editFeatures(features)
    if (req.files) {
      const files = req.files.images
      fileService.saveFiles('img', files)
      models.picture.savePictures(placeId, roomId, files)
    }
    return {
      status: 200,
      body: { message: 'The room has been updated' },
    }
  }
  async deleteRoom(req: Request): Promise<AppResponse> {
    const id = req.query.id as string
    const pictures = await(await models.picture.getPictures({ roomId: id })).map(picture => picture.fileName)
    fileService.deleteFiles('img', pictures)
    await models.room.deleteRoom(id)
    return {
      status: 200,
      body: { message: 'Room delated' },
    }
  }
}