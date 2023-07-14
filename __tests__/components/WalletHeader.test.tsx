import React from "react"
import WalletHeader from "../../components/WalletHeader"
import { Providers } from "../helper"
import { render, screen } from "@testing-library/react-native"

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

describe("<WalletHeader />", () => {
  beforeEach(() => {
    mockedDispatch.mockClear()
  })
  it("renders correctly", () => {
    const tree = render(<WalletHeader />, { wrapper: Providers }).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("buttons", () => {
    render(<WalletHeader />, { wrapper: Providers })
    const leftBtn = screen.getByTestId("test-left")
    const rightBtn = screen.getByTestId("test-right")
    expect(leftBtn).toHaveTextContent("Send")
    expect(rightBtn).toHaveTextContent("Receive")
  })

  it("wallet amount", () => {
    render(<WalletHeader />, { wrapper: Providers })
    const amount = screen.getByTestId("test-walletAmount")
    const amountUsd = screen.getByTestId("test-walletAmountUSD")
    expect(amount).toHaveTextContent("0 KAS")
    expect(amountUsd).toHaveTextContent("$0.00")
  })
})
