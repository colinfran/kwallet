import { io } from "socket.io-client"
import { DEV_ENV } from "@env"

let URL = "https://kwallet.app"
if (DEV_ENV === "development") {
  URL = "http://localhost:3000"
}

export const socket = io(URL)
