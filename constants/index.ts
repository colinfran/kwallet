import { API_KEY, DEV_ENV } from "@env"

console.log(DEV_ENV)
let apiUrl = "https://kwallet.app"
if (DEV_ENV === "development") {
  apiUrl = "http://localhost:3000"
}

const apiKey = API_KEY

export { apiKey, apiUrl }
