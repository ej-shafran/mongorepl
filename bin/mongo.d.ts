import { Db, ObjectId } from "mongodb";

declare global {
  var db: Db;
  var ObjectId: ObjectId;
}
