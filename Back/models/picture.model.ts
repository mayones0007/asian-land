import { knexService } from '../db/index'
import { UploadedFile } from "express-fileupload"

interface DbQuery {
  [key: string]: any
}

export interface Picture {
  id: number,
  placeId: number,
  fileName: string,
  roomId: number | null,
}

export class PictureModel {
  async getPictures(dbQuery: DbQuery): Promise<Picture[]> {
    return await knexService('pictures').where(dbQuery)
      .then((pictures) => {
        return pictures
      })
  }
  async savePictures(placeId: number, roomId: number | null, files: UploadedFile | UploadedFile[]): Promise<void> {
    if (files instanceof Array) {
      files.forEach(file => {
        knexService('pictures').insert({ placeId, roomId, fileName: file.name }).catch((err) => console.log(err))
      })
    } else {
      knexService('pictures').insert({ placeId, roomId, fileName: files.name }).catch((err) => console.log(err))
    }
  }
  async deletePictures(fileName: DbQuery): Promise<void> {
    await knexService('pictures').where(fileName).del()
  }
}