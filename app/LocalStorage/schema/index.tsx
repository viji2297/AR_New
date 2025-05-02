import { appSchema } from "@nozbe/watermelondb";
import { transactions } from "./Transaction.schema";

export const mySchema = appSchema({
    version: 1,
    tables: [transactions]
})