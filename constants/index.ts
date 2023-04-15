import { API_KEY, DEV_ENV, NETWORK_IP, SENTRY_DSN } from "@env"

console.log(DEV_ENV)
let apiUrl = "https://kwallet.app"
if (DEV_ENV === "development") {
  apiUrl = `http://${NETWORK_IP}:3000`
}

const apiKey = API_KEY
const sentryDsn = SENTRY_DSN

export { apiKey, apiUrl, sentryDsn }
