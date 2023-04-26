import React from "react"
import { render, screen } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { Providers, ProvidersWithOneWallet } from "../helper"
import Navigation from "../../navigation"

describe("<Navigation />", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it("renders correctly", () => {
    const tree = render(<Navigation colorScheme="light" />, {
      wrapper: Providers,
    }).toJSON()
    expect(tree).toMatchSnapshot()
    // const tree2 = render(<Navigation colorScheme="light" />, {
    //   wrapper: ProvidersWithOneWallet,
    // }).toJSON()
    // expect(tree2).toMatchSnapshot()
  })

  it("no wallets - user sent to kwallet root screen", () => {
    render(<Navigation colorScheme="light" />, { wrapper: Providers })
    const kwallet = screen.getByText("kwallet")
    expect(kwallet).toBeDefined()
  })
  // it("one wallet - user sent wallet tab", () => {
  //   render(<Navigation colorScheme="light" />, {
  //     wrapper: ProvidersWithOneWallet,
  //   })
  //   const leftBtn = screen.getByTestId("test-left")
  //   const rightBtn = screen.getByTestId("test-right")
  //   expect(leftBtn).toHaveTextContent("Send")
  //   expect(rightBtn).toHaveTextContent("Receive")
  // })
})
