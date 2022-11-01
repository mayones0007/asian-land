import { knexService } from '../db/index'

interface User extends NewUser{
  id: number,
  updatedAt: Date,
}

interface NewUser {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  avatar: string,
  role: string,
  createdAt: Date,
}

interface editUser {
  email?: string,
  password?: string,
  avatar?: string,
  updatedAt: Date,
}

interface DbQuery {
  [key: string]: any
}

export class UserModel {
  async getUser(dbQuery: DbQuery): Promise<User> {
    return await knexService('users').where(dbQuery).first()
    .then((user) => {
      return user
    })
  }

  async addUser(user: NewUser): Promise<User> {
    return await knexService('users').insert(user)
      .then((ids) => {
        return this.getUser({id: ids[0]})
      })
  }

  async editUser(id: DbQuery, user: editUser): Promise<void> {
    await knexService('users').where(id).update(user).catch((err) => console.log(err))
  }
}