import { knexService } from '../db/index'

export interface Room extends NewRoom{
  id: number,
}

export interface NewRoom {
  name: string,
  description: string,
  area: number,
  sleeps: number,
  placeId: number,
}

interface DbQuery {
  [key: string]: any
}

export class RoomModel {
  async getRooms(dbQuery: DbQuery): Promise<Room[]> {
    return await knexService('rooms').where(dbQuery)
      .then((rooms) => {
        return rooms
      })
  }
  async addRoom(room: NewRoom, role: string): Promise<number> {
    if (role !== 'admin') {
      await knexService('places').where({ id: room.placeId }).update({ isAccepted: null }).catch((err) => console.log(err))
    }
    return await knexService('rooms').insert(room)
      .then((id) => {
        return id[0]
      })
  }
  async editRoom(room: Room, role: string): Promise<void> {
    const roomBody = (({ id, ...o }) => o)(room)
    const id = room.id
    await knexService('rooms').where({ id }).update(roomBody).catch((err) => console.log(err))
    if (role !== 'admin') {
      await knexService('places').where({id: room.placeId}).update({isAccepted: null}).catch((err) => console.log(err))
    }
  }
  async deleteRoom(id: string): Promise<void> {
    const promises = []
    promises.push(knexService('rooms').where({ id }).del())
    promises.push(knexService('pictures').where({ roomId: id }).del())
    promises.push(knexService('features').where({ roomId: id }).del())
    Promise.all(promises)
  }
}