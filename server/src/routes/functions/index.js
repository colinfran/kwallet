/* eslint-disable @typescript-eslint/explicit-function-return-type */
const isApiKeyValid = (key) => {
  const apiList = JSON.parse(process.env.API_LIST)
  return apiList.includes(key)
}

export { isApiKeyValid }
