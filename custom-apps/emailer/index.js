const fs = require("fs")
const moment = require("moment")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
const PublicGoogleSheetsParser = require('public-google-sheets-parser')
dotenv.config()

let transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSCODE,
  },
})

const html = fs.readFileSync("./template.html", "utf8").toString()

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const run = async () => {
  console.log("Starting email script")
  const spreadsheetId = process.env.LIST_ID
  console.log("Getting email list")
  const parser = new PublicGoogleSheetsParser(spreadsheetId)
  const dataArray = await parser.parse()
  console.log("Looping through email list")
  for (var i = 0; i < dataArray.length; i++){
    let result = html.replace("{{{REPLACE_WITH_DAY}}}", moment().format("dddd"))
    const mailOptions = {
      from: "colin@kwallet.app",
      to: dataArray[i].Email,
      subject: "Kwallet reddit post #3",
      html: result,
    }
    console.log(`Sending email to ${dataArray[i].Email}`)
    try {
      await transporter.sendMail(mailOptions)
      console.log("Waiting 30 seconds.")
      if (i < dataArray.length - 1) await sleep(30000)
    } catch(err) {
      console.log(err)
    }
  }
  console.log("Done sending emails to email list.")
}

run()
/*
    to run:
    node ./index.js
*/
 