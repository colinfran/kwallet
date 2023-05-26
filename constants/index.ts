import { API_KEY, DEV_ENV, NETWORK_IP, SENTRY_DSN } from "@env"

let apiUrl = "https://api.kwallet.app"
if (DEV_ENV === "development") {
  apiUrl = `http://${NETWORK_IP}:3000`
}

const devEnv = DEV_ENV
const apiKey = API_KEY
const sentryDsn = SENTRY_DSN

export { apiKey, apiUrl, sentryDsn, devEnv }
