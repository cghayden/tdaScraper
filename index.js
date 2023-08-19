import 'dotenv/config'
import { scrapeTDA } from './scraper.js'
import cron from 'node-cron'

cron.schedule('*/10 * * * *', () => {
  console.log(`running scraper at ${Date.now()}`)
  scrapeTDA()
})
