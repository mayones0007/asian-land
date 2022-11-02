import { UserModel } from "./user.model"
import { PlaceModel } from "./place.model"
import { PictureModel } from "./picture.model"
import { ReviewModel } from "./review.model"
import { FavoriteModel } from "./favorite.model"
import { RoomModel } from "./room.model"
import { FeatureModel } from "./feature.model"

export const models = {
  user: new UserModel,
  place: new PlaceModel,
  picture: new PictureModel,
  review: new ReviewModel,
  favorite: new FavoriteModel,
  room: new RoomModel,
  feature: new FeatureModel
}