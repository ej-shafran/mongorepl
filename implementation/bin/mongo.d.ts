import { Db, ObjectId, Int32 } from "mongodb";

declare global {
  var db: Db;
  var ObjectId: ObjectId;
  var Int32: Int32;
}
