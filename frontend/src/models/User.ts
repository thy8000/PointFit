import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'

export class UserModel extends Model {
  static table = 'users'

  @text('name') name!: string
  @text('email') email!: string
  @field('created_at') createdAt!: number
  @field('updated_at') updatedAt!: number
}