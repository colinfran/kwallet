import React from "react"
import renderer from "react-test-renderer"
import { NativeBaseProviderTest } from "./helper"
import { render, screen, fireEvent } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import App from "../App"

const RenderApp = (): JSX.Element => {
  return (
    <NativeBaseProviderTest>
      <App />
    </NativeBaseProviderTest>
  )
}

describe("<App />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<RenderApp />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("text", () => {
    render(<RenderApp />)
    const kwallet = screen.getByText("kwallet")
    // const kwallet = screen.getByTestId("test-kwallet")
    expect(kwallet).toBeDefined()
  })
})
