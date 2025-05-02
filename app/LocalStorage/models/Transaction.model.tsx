import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class transactions extends Model {
  static table = 'transactions';

  @field('image_url') imageUrl!: string;
  @field('swipe_flag') swipeFlag!: string;
  @field('swipe_time') swipeTime!: string;
  @field('user_id') userId!: string;
  @field('wfh_flag') wfhFlag!: string;
  @field('uri') uri!: string;
  @field('sync_flag') syncFlag!: string;
  @field('app_version') appVersion!: string;
}
