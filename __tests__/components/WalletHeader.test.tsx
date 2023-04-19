import { NativeBaseProvider } from "native-base"
import React from "react"
import renderer from "react-test-renderer"
import WalletHeader from "../../components/WalletHeader"

const mockedDispatch = jest.fn()

// Mocks like this need to be configured at the top level
// of the test file, they can't be setup inside your tests.
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: mockedDispatch,
    }),
  }
})

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

const RenderComponent = (): JSX.Element => {
  return (
    <NativeBaseProvider>
      <WalletHeader />
    </NativeBaseProvider>
  )
}

describe("<WalletHeader />", () => {
  beforeEach(() => {
    // Alternatively, set "clearMocks" in your Jest config to "true"
    mockedDispatch.mockClear()
  })
  it("renders correctly", () => {
    const tree = renderer.create(<RenderComponent />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
