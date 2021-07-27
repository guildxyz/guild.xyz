import { ChainData, Community, Level, Token } from "temporaryData/types"

type BackendCommunity = Omit<Community, "chainData" | "levels"> & {
  chainData: Array<Omit<ChainData, "stakeToken"> & { swapToken: Token }>
  levels: Array<
    Omit<Level, "requirementAmount" | "stakeTimelockMs"> & {
      requirementType: string
      amount: number
      timelockMs: number
    }
  >
}

// Only needed until we don't get the community data in the discussed format from the backend
const preprocessCommunity = (community: BackendCommunity) => {
  // some adjustments to the recieved data structure, should'nt be needed once the discussed changes are made in the DB
  const chainData: ChainData[] = community.chainData.map(
    (_chain: Omit<ChainData, "stakeToken"> & { swapToken: Token }): ChainData => {
      const chain = {
        ..._chain,
        stakeToken: _chain.swapToken,
      }
      delete chain.swapToken
      return chain
    }
  )
  const levels = community.levels.map(
    (
      _level: Omit<Level, "requirementAmount" | "stakeTimelockMs"> & {
        requirementType: string
        amount: number
        timelockMs: number
      }
    ) => {
      const level = {
        ..._level,
        requirementAmount: _level.amount,
        stakeTimelockMs: _level.timelockMs,
      }
      delete level.amount
      delete level.timelockMs
      return level
    }
  )
  return {
    ...community,
    chainData,
    levels,
  }
}

export default preprocessCommunity
