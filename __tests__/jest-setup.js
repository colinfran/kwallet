/* eslint-disable @typescript-eslint/no-var-requires */
require("react-native-reanimated/lib/reanimated2/jestUtils").setUpTests()

jest.mock("expo-localization", () => {
  return {
    getLocales: () => [
      {
        languageCode: "en",
        measurementSystem: "US",
      },
    ],
  }
})
