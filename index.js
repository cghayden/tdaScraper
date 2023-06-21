import 'dotenv/config'
import cron from 'node-cron'
import { scrapeTDA } from './scraper.js'

cron.schedule('*/10 * * * *', () => {
  console.log(`running tda scraper at ${Date.now()}`)
  scrapeTDA()
})
