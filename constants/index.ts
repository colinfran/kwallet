import {
  API_KEY as apiKey,
  DEV_ENV,
  NETWORK_IP,
  SENTRY_DSN as sentryDsn,
} from "@env"

console.log(DEV_ENV)
let apiUrl = "https://kwallet.app"
if (DEV_ENV === "development") {
  apiUrl = `http://${NETWORK_IP}:3000`
}

export { apiKey, apiUrl, sentryDsn }
