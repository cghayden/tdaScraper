const puppeteer = require('puppeteer')
const twilioClient = require('./twilio')

async function scrapeTDA() {
  const browser = await puppeteer.launch({ headless: 'new' })
  try {
    const page = await browser.newPage()
    await page.goto(
      'https://www.tds.ms/CentralizeSP/Student/Login/teachersdrivingacademy'
    )
    await page.click('#username')
    await page.keyboard.type(process.env.TDA_USERNAME)
    await page.click('#password')
    await page.keyboard.type(process.env.TDA_PASSWORD)
    await Promise.all([
      page.click('.form-actions button'),
      page.waitForNavigation(),
    ])
    await page.goto(
      'https://www.tds.ms/CentralizeSP/BtwScheduling/Lessons?SchedulingTypeId=1'
    )

    const availableAppointments = await page.$$('#btnSelectAppt')
    if (availableAppointments.length) {
      // text me
      twilioClient.messages
        .create({
          body: `There are available appointments at TDA`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: '+17817526486',
        })
        .then((message) => console.log('message sent', message))
    } else {
      console.log('no appts')
    }
  } catch (e) {
    console.log('e', e)
  } finally {
    await browser.close()
  }
}

module.exports = { scrapeTDA }
