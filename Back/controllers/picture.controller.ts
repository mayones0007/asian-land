import { Request } from "express"
import { models } from "../models/index"
import { AppResponse } from "./response.model"
import { fileService } from "../services/file.service"
import { Picture } from "../models/picture.model"

export class PictureController {
  async getPictures(req: Request): Promise<AppResponse<Picture[]>> {
    const placeId = req.query.id
    const pictures = await models.picture.getPictures({ placeId })
    return {
      status: 200,
      body: pictures
    }
  }
  async savePictures(req: Request): Promise<AppResponse> {
    if (req.files) {
      const placeId = req.body.id
      const roomId = req.body.roomId
      const files = req.files.images
      fileService.saveFiles('img', files)
      models.picture.savePictures(placeId, roomId, files)
      return {
        status: 200,
        body: { message: 'Картинки добавлены' },
      }
    } else {
      return {
        status: 400,
        body: { message: 'Ошибка при передаче файлов' },
      }
    }
  }
  async deletePictures(req: Request): Promise<AppResponse> {
    if (req.query.fileName) {
    const fileName = req.query.fileName as string
    models.picture.deletePictures({ fileName })
    fileService.deleteFiles('img', fileName)
    return {
      status: 200,
      body: { message: 'Картинка удалена' },
    }
    } else {
      return {
        status: 400,
        body: { message: 'Ошибка при удалении файлов' },
      }
    }
  }
}