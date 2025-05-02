import { Database } from '@nozbe/watermelondb';
import  DatabaseAdapter  from '@nozbe/watermelondb/adapters/sqlite';
import { mySchema } from '../schema';
import transactions from '../models/Transaction.model';
import migrations from '../Migration';

const adapter = new DatabaseAdapter({
  schema: mySchema,
  dbName: 'ar_localStorage', 
  migrations: migrations, 
  jsi: true, 
});

const database = new Database({
  adapter,
  modelClasses: [transactions],
});

export default database;
