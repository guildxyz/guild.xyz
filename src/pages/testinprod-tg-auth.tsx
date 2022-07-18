import Script from "next/script"

const Page = (): JSX.Element => (
  <Script
    strategy="lazyOnload"
    src="https://telegram.org/js/telegram-widget.js?19"
    data-telegram-login="Guildxyz_bot"
    data-auth-url="https://guild-xyz.vercel.app/testinprod-tg-auth"
    data-request-access="write"
  />
)

export default Page
