import twitterRewards from 'platforms/Twitter'
import emailRewards from 'platforms/Email'
import telegramRewards from 'platforms/Telegram'
import tokenRewards from 'platforms/Token'
import { Rewards } from './types'

const rewards = {
  ...twitterRewards,
  ...emailRewards,
  ...telegramRewards,
  ...tokenRewards
} as const satisfies Rewards

export default rewards
