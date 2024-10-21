export const WEB3INBOX_APPS = ["GUILD", "WEB3INBOX", "SHEFI"] as const
export const APP_DETAILS: Record<
  (typeof WEB3INBOX_APPS)[number],
  {
    name: string
    image: string
  }
> = {
  GUILD: {
    name: "Guild.xyz",
    image: "/requirementLogos/guild.png",
  },
  WEB3INBOX: {
    name: "Web3Inbox",
    image: "/requirementLogos/web3inbox.png",
  },
  SHEFI: {
    name: "SheFi Summit",
    image: "/requirementLogos/shefi.jpg",
  },
}
