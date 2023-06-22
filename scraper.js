import * as puppeteer from 'puppeteer'

import twilioClient from './twilio.js'

export async function scrapeTDA() {
  console.log(`checking for appts... at ${Date.now()}`)
  const browser = await puppeteer.launch({ headless: 'new' })
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
  await page.screenshot({ path: 'availableAppts.png', fullPage: true })

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
      .catch((err) => console.error(err))
  } else {
    console.log('no appts')
  }
  await browser.close()
}
