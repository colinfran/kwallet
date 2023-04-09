import { API_KEY, DEV_ENV, NETWORK_IP } from "@env"

console.log(DEV_ENV)
let apiUrl = "https://kwallet.app"
if (DEV_ENV === "development") {
  apiUrl = `http://${NETWORK_IP}:3000`
}

const apiKey = API_KEY

export { apiKey, apiUrl }
