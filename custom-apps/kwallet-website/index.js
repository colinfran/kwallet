/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
window.addEventListener("load", function () {
  setTimeout(() => {
    document.body.classList.remove("_QmFDPh")
  }, 500)
})

// form submission
// const url = "http://localhost:3000/v1/email-sign-up"
const url = "https://api.kwallet.app/v1/email-sign-up"
const form = document.querySelector("#form")
const btn = document.querySelector("#submit")
form.addEventListener("submit", (e) => {
  e.preventDefault()
  const formData = new FormData(form)
  const email = formData.get("Email")
  if (email === undefined || email === "") {
    return
  }
  var mailformat =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  if (!email.match(mailformat)) {
    document.querySelector("#o3Uzv2").className = "_8rqOjx"
    return
  }
  btn.disabled = true
  btn.innerHTML = `
    <span class="_0CvEDb">
      <span></span>
      <span></span>
      <span></span>
    </span>
  `
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(function(response) { return response.json(); })
    .then(function(json) {
      console.log(json)
      if (json.message === "User already signed up"){
        console.log("error")
        btn.disabled = true
        btn.innerHTML = "Submit"
        document.querySelector("#UMIFNf").style = "display:none;"
        document.querySelector("#YH7cBX").className = "_l79chJ"
        document.querySelector("#QwgFJH").innerHTML =
        "You have already signed up for early access."
        return
      }
      btn.disabled = true
      btn.disabled = false
      btn.innerHTML = "Submit"
      document.querySelector("#YH7cBX").className = "_y89x4g"
      document.querySelector("#QwgFJH").innerHTML =
        "You have successfully signed up for early access for the kwallet app. When the app is ready for testing, you will receive an email from us."
      document.querySelector("#UMIFNf").style = "display:none;"
    })
    .catch((error) => {
      btn.disabled = false
      btn.innerHTML = "Submit"
      document.querySelector("#UMIFNf").style = "display:none;"
      document.querySelector("#YH7cBX").className = "_l79chJ"
      document.querySelector("#QwgFJH").innerHTML =
        "An error occurred when trying to submit your email. Please refresh the page and try again."
    })
})

var html = document.querySelector("html")
var modal = document.getElementById("L5rthN")
var modalContent = document.getElementsByClassName("_tSeJ3q")[0]
var span = document.getElementsByClassName("_mLhboH")[0]
var isModalOpen = false
const triggerModal = (val) => {
  if (val === "on") {
    modal.style.display = "flex"
    html.style.overflowY = "scroll !important"
    isModalOpen = true
    html.classList.toggle("isOpen1")
    modalContent.classList.toggle("isOpen2")
  } else {
    html.classList.toggle("isOpen1")
    modal.style.display = "none"
    isModalOpen = false
    modalContent.classList.toggle("isOpen2")
  }
}

span.onclick = function () {
  triggerModal("off")
}
window.onclick = function (event) {
  if (event.target == modal) {
    triggerModal("off")
  }
}
// fade toggle
function toggleElementFade(element) {
  element.style.removeProperty("display")
  setTimeout(function () {
    element.classList.toggle("_YPPNuG")
  }, 10)
  setTimeout(function () {
    element.classList.toggle("_YPPNuG")
  }, 3000)
}
// Donation button onclick
var donateBtn = document.getElementById("xkPjsE")
donateBtn.onclick = function (event) {
  triggerModal("on")
}

// open modal on page load if donate
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
if (urlParams.has("donate")) {
  triggerModal("on")
}
// copy to clipboard
const copyToClipboard = async (str) => {
  await navigator.clipboard.writeText(str)
}
var kas = document.getElementById("kaspa")
var btc = document.getElementById("btc")
var eth = document.getElementById("eth")
kas.onclick = function () {
  copyToClipboard(document.getElementById("kasString").innerHTML)
  toggleElementFade(document.getElementById("kasCopied"))
}
btc.onclick = function () {
  copyToClipboard(document.getElementById("btcString").innerHTML)
  toggleElementFade(document.getElementById("btcCopied"))
}
eth.onclick = function () {
  copyToClipboard(document.getElementById("ethString").innerHTML)
  toggleElementFade(document.getElementById("ethCopied"))
}

let mode = 1
const sun = document.querySelector("._J3VvBQ")
const moon = document.querySelector("._nni0Pq")
const button = document.querySelector("._3VPKEe")
var uQtGK7 = document.getElementById("uQtGK7")
var iIxjYp = document.getElementById("iIxjYp")

const body = document.body
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  moon.classList.toggle("_1C7xSX")
  body.classList.toggle("_5rtWib")
  mode = -1
  uQtGK7.classList.toggle("_ZKdRgf")
} else {
  sun.classList.toggle("_1C7xSX")
  body.classList.toggle("_macCYX")
  mode = 1
  iIxjYp.classList.toggle("_ZKdRgf")
}
button.addEventListener("click", () => {
  mode = -mode
  if (mode === 1) {
    body.className = "_macCYX"
  } else {
    body.className = "_5rtWib"
  }
  sun.classList.toggle("_1C7xSX")
  moon.classList.toggle("_1C7xSX")
  iIxjYp.classList.toggle("_ZKdRgf")
  uQtGK7.classList.toggle("_ZKdRgf")
})
