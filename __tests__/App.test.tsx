import React from "react"
import { render, screen } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import App from "../App"
import { Providers } from "./helper"

describe("<App />", () => {
  it("renders correctly", () => {
    const tree = render(<App />, { wrapper: Providers }).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("text", () => {
    render(<App />, { wrapper: Providers })
    const kwallet = screen.getByText("kwallet")
    expect(kwallet).toBeDefined()
  })
})
