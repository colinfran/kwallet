/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from "fs"
import JSONdb from "simple-json-db"

let db

const initializeDatabase = () => {
  if (!fs.existsSync("./storage.json")) {
    const data = fs.readFileSync("./data.json", "utf8")
    fs.writeFileSync("./storage.json", data)
  }
  db = new JSONdb("./storage.json", { asyncWrite: true })
}

export { db, initializeDatabase }
