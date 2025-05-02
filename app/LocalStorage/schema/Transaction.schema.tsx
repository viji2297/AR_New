import { tableSchema } from '@nozbe/watermelondb';

export const transactions = tableSchema({
  name: 'transactions',
  columns: [
    { name: 'image_url', type: 'string' },
    { name: 'swipe_flag', type: 'string' },
    { name: 'swipe_time', type: 'string' },
    { name: 'user_id', type: 'string' },
    { name: 'wfh_flag', type: 'string' },
    { name: 'uri', type: 'string' },
    { name: 'sync_flag', type: 'string' },
    { name: 'app_version', type: 'string' },
  ],
});

