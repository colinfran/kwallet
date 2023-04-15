export const currenciesList = [
  {
    description: "United States Dollar",
    code: "USD",
  },
  {
    description: "Euro",
    code: "EUR",
  },
  {
    description: "Japanese Yen",
    code: "JPY",
  },
  {
    description: "British Pound Sterling",
    code: "GBP",
  },
  {
    description: "Chinese Yuan",
    code: "CNY",
  },
  {
    description: "Australian Dollar",
    code: "AUD",
  },
  {
    description: "Canadian Dollar",
    code: "CAD",
  },
  {
    description: "Swiss Franc",
    code: "CHF",
  },
]

export const getCurrencySymbol = (currency): string => {
  let symbol = "$"
  switch (currency) {
    case "EUR":
      symbol = "€"
      break
    case "JPY":
      symbol = "¥"
      break
    case "GBP":
      symbol = "£"
      break
    case "CNY":
      symbol = "¥"
      break
    case "AUD":
      symbol = "$"
      break
    case "CAD":
      symbol = "$"
      break
    case "CHF":
      symbol = "CHF "
      break
    default:
      symbol = "$"
      break
  }
  return symbol
}
