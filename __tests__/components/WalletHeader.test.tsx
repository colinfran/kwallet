import React from "react"
import renderer from "react-test-renderer"
import WalletHeader from "../../components/WalletHeader"
import { NativeBaseProviderTest } from "../helper"
import { render, screen } from "@testing-library/react-native"
import { DataContext } from "../../providers/DataProvider"

const mockedDispatch = jest.fn()

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

const RenderHeader = (): JSX.Element => (
  <DataContext.Provider
    value={
      {
        selectedCurrency: "USD",
        graphData: {
          day: [
            {
              x: 1679246714543,
              y: 0.014540020460445197,
            },
            {
              x: 1679247047789,
              y: 0.014571506674731024,
            },
            {
              x: 1679247288167,
              y: 0.014452072671740143,
            },
          ],
        },
      } as any
    }
  >
    <NativeBaseProviderTest>
      <WalletHeader />
    </NativeBaseProviderTest>
  </DataContext.Provider>
)

describe("<WalletHeader />", () => {
  beforeEach(() => {
    mockedDispatch.mockClear()
  })
  it("renders correctly", () => {
    const tree = renderer.create(<RenderHeader />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("buttons", () => {
    render(<RenderHeader />)
    const leftBtn = screen.getByTestId("test-left")
    const rightBtn = screen.getByTestId("test-right")
    expect(leftBtn).toHaveTextContent("Send")
    expect(rightBtn).toHaveTextContent("Receive")
  })

  it("wallet amount", () => {
    render(<RenderHeader />)
    const amount = screen.getByTestId("test-walletAmount")
    const amountUsd = screen.getByTestId("test-walletAmountUSD")
    expect(amount).toHaveTextContent("0 KAS")
    expect(amountUsd).toHaveTextContent("$0.00")
  })
})
