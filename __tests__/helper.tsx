import React from "react"
import { extendTheme, NativeBaseProvider } from "native-base"
import { LinearGradient } from "expo-linear-gradient"
import { DataContext } from "../providers/DataProvider"

const theme = extendTheme({
  colors: {
    primary: {
      50: "#EAF9F7",
      100: "#D4F3EE",
      200: "#BFEEE6",
      300: "#AAE8DD",
      400: "#94E2D5",
      500: "#7FDCCC",
      600: "#66B0A3",
      700: "#4C847A",
      800: "#335852",
      900: "#192C29",
    },
  },
  config: {
    initialColorMode: "dark",
  },
})

export const setSelectedMock = jest.fn()

const data = {
  prices: [
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
}

export const Providers = ({ children }): JSX.Element => {
  return (
    <DataContext.Provider
      value={
        {
          appColor: "#123456",
          backgroundColor: "#654321",
          modalBackgroundColor: "#123123",
          selectedGraphIndex: 0,
          setSelectedGraphIndex: setSelectedMock,
          textColor: "#000",
          selectedCurrency: "USD",
          getGraphData: async () => {
            return {}
          },
          getWalletData: async () => {
            return []
          },
          wallets: [],
          graphData: {
            day: data,
            week: data,
            month: data,
            year: data,
            all: data,
          },
        } as any
      }
    >
      <NativeBaseProvider
        config={{ dependencies: { "linear-gradient": LinearGradient } }}
        initialWindowMetrics={{
          frame: { x: 0, y: 0, width: 0, height: 0 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
        theme={theme}
      >
        {children}
      </NativeBaseProvider>
    </DataContext.Provider>
  )
}

export const ProvidersWithOneWallet = ({ children }): JSX.Element => {
  return (
    <DataContext.Provider
      value={
        {
          appColor: "#123456",
          backgroundColor: "#654321",
          modalBackgroundColor: "#123123",
          selectedGraphIndex: 0,
          setSelectedGraphIndex: setSelectedMock,
          textColor: "#000",
          selectedCurrency: "USD",
          getGraphData: async () => {
            return {}
          },
          getWalletData: async () => {
            return []
          },
          wallets: [
            {
              walletName: "Wallet1",
            },
          ],
          graphData: {
            day: data,
            week: data,
            month: data,
            year: data,
            all: data,
          },
        } as any
      }
    >
      <NativeBaseProvider
        config={{ dependencies: { "linear-gradient": LinearGradient } }}
        initialWindowMetrics={{
          frame: { x: 0, y: 0, width: 0, height: 0 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
        theme={theme}
      >
        {children}
      </NativeBaseProvider>
    </DataContext.Provider>
  )
}
