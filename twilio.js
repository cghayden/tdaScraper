const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilio = require('twilio')
const twilioClient = twilio(accountSid, authToken)

module.exports = { twilioClient }
