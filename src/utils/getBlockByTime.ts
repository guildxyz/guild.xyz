import { etherscanApiUrls } from "connectors"
import fetcher from "./fetcher"

export const getBlockByTime = ([_, chain, timestamp]) =>
  fetcher(
    `${etherscanApiUrls[chain]}/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before`
  ).then((json) => {
    if (json.status !== "1")
      throw new Error("Rate limited, will try again in 5 seconds")
    if (json.message.includes("NOTOK")) throw new Error(json.result)

    return json
  })
