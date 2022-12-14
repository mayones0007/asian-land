import { controllers }  from './controllers/index';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { corsMiddleware } from './middleware/cors';
import fileupload from 'express-fileupload';
import { authMiddleware } from './middleware/auth';
import { roleMiddleware } from './middleware/role';
const app = express()
const port = 3000

declare module 'express-serve-static-core' {
  interface Request {
    user: {
      userId?: number;
      role: string,
    }
  }
  interface Response {
    myField?: string
  }
}

app.use(bodyParser.json(), express.static('public'), fileupload())

app.options('*', corsMiddleware, (req, res) => {
  res.status(204).send()
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

app.get('/places', corsMiddleware, roleMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.place.getPlaces(req)
  res.status(response.status).send(response.body)
})

app.get('/myplaces', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.place.getMyPlaces(req)
  res.status(response.status).send(response.body)
})

app.get('/rooms', corsMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.room.getRooms(req)
  res.status(response.status).send(response.body)
})

app.patch('/room', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.room.editRoom(req)
  res.status(response.status).send(response.body)
})

app.post('/room', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.room.addRoom(req)
  res.status(response.status).send(response.body)
})

app.get('/features', corsMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.feature.getFeatures(req)
  res.status(response.status).send(response.body)
})

app.get('/featureslist', corsMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.feature.getFeaturesList()
  res.status(response.status).send(response.body)
})

app.get('/place', corsMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.place.getPlace(req)
  res.status(response.status).send(response.body)
})

app.post('/place', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.place.addPlace(req)
  res.status(response.status).send(response.body)
})

app.patch('/place', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.place.editPlace(req)
  res.status(response.status).send(response.body)
})

app.get('/review', corsMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.review.getReviews(req)
  res.status(response.status).send(response.body)
})

app.delete('/review', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.review.deleteReview(req)
  res.status(response.status).send(response.body)
})

app.post('/review', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.review.createReview(req)
  res.status(response.status).send(response.body)
})

app.get('/pictures', corsMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.picture.getPictures(req)
  res.status(response.status).send(response.body)
})

app.get('/favorite', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.favorite.getFavorites(req)
  res.status(response.status).send(response.body)
})

app.get('/user', corsMiddleware, authMiddleware, async(req: Request, res: Response) => {
  const response = await controllers.user.getUser(req)
  res.status(response.status).send(response.body)
})

app.patch('/user', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.user.editUser(req)
  res.status(response.status).send(response.body)
})

app.post('/refresh', corsMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.user.getRefreshToken(req)
  res.status(response.status).send(response.body)
})

app.post('/login', corsMiddleware, async(req: Request, res: Response) => {
  const response = await controllers.user.login(req)
  res.status(response.status).send(response.body)
})

app.post('/registration', corsMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.user.registration(req)
  res.status(response.status).send(response.body)
})

app.post('/favorite', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.favorite.addFavorite(req)
  res.status(response.status).send(response.body)
})

app.delete('/favorite', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.favorite.deleteFavorite(req)
  res.status(response.status).send(response.body)
})

app.post('/pictures', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.picture.savePictures(req)
  res.status(response.status).send(response.body)
})

app.delete('/pictures', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.picture.deletePictures(req)
  res.status(response.status).send(response.body)
})

app.delete('/place', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.place.deletePlace(req)
  res.status(response.status).send(response.body)
})

app.delete('/room', corsMiddleware, authMiddleware, async (req: Request, res: Response) => {
  const response = await controllers.room.deleteRoom(req)
  res.status(response.status).send(response.body)
})
