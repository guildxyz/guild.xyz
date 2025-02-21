import { Requirement } from "types"

export type CovalentContractCallCountChain = Extract<
  Requirement,
  { type: "COVALENT_CONTRACT_CALL_COUNT" | "COVALENT_CONTRACT_CALL_COUNT_RELATIVE" }
>["chain"]
