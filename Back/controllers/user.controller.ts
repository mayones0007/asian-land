import { Request } from "express"
import { models } from "../models/index"
import { authService } from "../services"
import { GetUserBody, LoginUserBody, Tokens } from "./interfaces/user.interface"
import { AppResponse } from "./response.model"
import { fileService } from '../services/file.service'
import { UploadedFile } from "express-fileupload"

export class UserController {
  async getUser(req: Request): Promise<AppResponse<GetUserBody> | AppResponse> {
    const id = req.user?.userId
    if (!id){
      return {
        status: 400,
        body: { message: 'User not found' }
      }
    }
    const user = await models.user.getUser({ id })
    return {
      status: 200,
      body: {
        user: { name: user.firstName, id: user.id, avatar: user.avatar, role: user.role }
      }
    }
  }

  async registration(req: Request): Promise<AppResponse<LoginUserBody> | AppResponse> {
    const newUser = req.body
    newUser.avatar = "tourist.png"
    newUser.createdAt = new Date()
    newUser.role = 'user'

    const userEmail = await models.user.getUser({ email: newUser.email })
    if (userEmail) {
      return {
        status: 400,
        body: { message: 'User with this email already exists' }
      }
    }

    const user = await models.user.addUser(newUser)

    const { accessToken, refreshToken} = authService.getTokens(user.id, user.role)
    return {
      status: 200,
      body: {
        message: 'Successful login',
        accessToken,
        refreshToken,
        user: { name: user.firstName, id: user.id, avatar: user.avatar, role: user.role }
      }
    }
  }

  async getRefreshToken(req: Request): Promise<AppResponse<Tokens> | AppResponse> {
    const refreshToken = req.body.refreshToken
    const decoded = authService.updateTokens(refreshToken)
    if(decoded) {
      return {
        status: 200,
        body: {
          accessToken: decoded.accessToken,
          refreshToken: decoded.refreshToken,
        }
      }
    }
    return {
      status: 403,
      body: { message: 'Token Error' }
    }
  }

  async login(req: Request): Promise<AppResponse<LoginUserBody> | AppResponse> {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
      return {
        status: 400,
        body: { message: 'Login and/or password are missing' }
      }
    }

    const user = await models.user.getUser({ email })
    if (!user) {
      return {
        status: 400,
        body: { message: 'Invalid email' }
      }
    }

    if (user.password !== password) {
      return {
        status: 400,
        body: { message: 'Invalid password' }
      }
    }

    const { accessToken, refreshToken } = authService.getTokens(user.id, user.role)
    return {
      status: 200,
      body: {
        message: 'Successful login',
        accessToken,
        refreshToken,
        user: { name: user.firstName, id: user.id, avatar: user.avatar, role: user.role}
      }
    }
  }

  async editUser(req: Request): Promise<AppResponse<GetUserBody> | AppResponse> {
    const id = req.user!.userId
    if (!id) {
      return {
        status: 403,
        body: { message: 'Access denied' }
      }
    } 
    const password = req.body.password
    const email = req.body.email
    const newPassword = req.body.newPassword
    const newEmail = req.body.newEmail
    const updatedAt = new Date()
    const user = await models.user.getUser({ id })

    if (email && newEmail) {
      if (user.email !== email) {
        return {
          status: 400,
          body: { message: 'Invalid email' }
        }
      } else {
        const userEmail = await models.user.getUser({ email: newEmail })
        if (userEmail) {
          return {
            status: 400,
            body: { message: 'User with this email already exists' }
          }
        } else {
          models.user.editUser({ id }, { email: newEmail, updatedAt })
          return {
            status: 200,
            body: { message: 'Email is updated' }
          }
        }
      }
    }
    if (password && newPassword){
      if (user.password !== password) {
        return {
          status: 400,
          body: { message: 'Invalid password' }
        }
      } else {
        models.user.editUser({ id }, { password: newPassword, updatedAt })
        return {
          status: 200,
          body: { message: 'Password is updated' }
        }
      }
    }
    if (req.files) {
      const files = req.files.avatar as UploadedFile
      models.user.editUser({ id }, { avatar: files.name, updatedAt })
      fileService.deleteFiles('avatars', user.avatar)
      fileService.saveFiles('avatars', files)
      return {
        status: 200,
        body: { message: 'Avatar is updated' }
      }
    }
    return {
      status: 400,
      body: { message: 'Update error' }
    }
  }
}