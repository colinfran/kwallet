/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, createContext, useEffect } from "react"
import * as Sentry from "sentry-expo"
import { useColorScheme } from "react-native"
import { apiKey, apiUrl } from "../constants/index"
import { DarkTheme, DefaultTheme } from "@react-navigation/native"
import createSecureStore from "@neverdull-agency/expo-unlimited-secure-store"
const secureStore = createSecureStore()

type DataPoint = {
  timestamp: number
  value: number
}

type Prices = DataPoint[]

type Interval = {
  percent_change: number
  prices: Prices
}

// exposed context for doing awesome things directly in React
export const DataContext = createContext({
  textColor: "#000",
  backgroundColor: "#fff",
  appColor: "#7fdccc",
  modalBackgroundColor: "#f5f5f5",

  setappColor: (hex: string) => {},

  wallets: [],
  setWallets: (newWallet: object) => {},

  setWalletData: (newWallet: object) => {},

  isLoaded: false,
  setIsLoaded: (loaded: boolean) => {},

  walletBalance: undefined,
  setWalletBalance: (walletBalance: object) => {},

  selectedWalletIndex: 0,
  setSelectedWalletIndex: (index: number) => {},

  graphData: undefined,
  setGraphData: (data) => {},
  getGraphData: async () => {
    return {}
  },

  showAlert: undefined,
  setShowAlert: (data) => {},

  selectedGraphIndex: 0,
  setSelectedGraphIndex: (idx) => {},

  selectedCurrency: "USD",
  setSelectedCurrency: (currency) => {},
})

export const DataProvider = ({ children }): JSX.Element => {
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"
  const backgroundColor =
    useColorScheme() === "dark"
      ? DarkTheme.colors.background
      : DefaultTheme.colors.background

  const modalBackgroundColor =
    useColorScheme() === "dark" ? "#262626" : "#f5f5f5"

  const [wallets, setWallets] = useState([])
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(0)
  const [appColor, setappColor] = useState("#7fdccc")

  const [isLoaded, setIsLoaded] = useState(false)
  const [graphData, setGraphData] = useState()
  const [walletBalance, setWalletBalance] = useState()

  const [showAlert, setShowAlert] = useState()

  const [selectedGraphIndex, setSelectedGraphIndex] = useState(0)

  const [selectedCurrency, setSelectedCurrency] = useState("USD")

  useEffect(() => {
    if (graphData?.appStatus) {
      setShowAlert(graphData.appStatus)
    }
  }, [graphData])

  const setWalletData = async (value) => {
    try {
      await secureStore.setItem("wallets", JSON.stringify(value))
      setWallets(value)
    } catch (error) {
      Sentry.Native.captureException(error)
    }
  }

  const getWalletData = async () => {
    try {
      const walletData = await secureStore.getItem("wallets")
      if (walletData !== null) {
        setWallets(JSON.parse(walletData))
      }
    } catch (error) {
      Sentry.Native.captureException(error)
    }
  }

  const getGraphData = async (): Promise<any> => {
    console.log("Fetching graph data")
    const selectedWallet = wallets[selectedWalletIndex]
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          selectedCurrency: selectedCurrency.toLowerCase(),
          password: selectedWallet.walletData.userPassword,
          encryptedMnemonic: selectedWallet.walletData.encryptedMnemonic,
        }),
      }
      const url = `${apiUrl}/v1/graph-data`
      const response = await fetch(url, options)
      const json = await response.json()
      if (json && !json.error) {
        return json
      }
    } catch (error) {
      Sentry.Native.captureException(error)
      return { error: true, errorDescription: error }
    }
  }

  useEffect(() => {
    getWalletData()
  }, [])

  return (
    <DataContext.Provider
      value={{
        textColor,
        backgroundColor,
        modalBackgroundColor,

        wallets,
        setWallets,

        setWalletData,

        selectedWalletIndex,
        setSelectedWalletIndex,

        appColor,
        setappColor,

        isLoaded,
        setIsLoaded,

        graphData,
        setGraphData,
        getGraphData,

        walletBalance,
        setWalletBalance,

        showAlert,
        setShowAlert,

        selectedGraphIndex,
        setSelectedGraphIndex,

        selectedCurrency,
        setSelectedCurrency,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
