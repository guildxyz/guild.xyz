import {
  OpenseaAssetData,
  openseaChains,
} from "pages/api/opensea-asset-data/[chain]/[address]/[[...tokenId]]"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"

const useOpenseaAssetData = (
  requirement: Requirement
): SWRResponse<OpenseaAssetData> =>
  useSWRImmutable<OpenseaAssetData>(
    requirement?.address && openseaChains[requirement.chain]
      ? `/api/opensea-asset-data/${requirement.chain}/${requirement.address}/${
          requirement.data.id ?? ""
        }`
      : null
  )

export default useOpenseaAssetData
