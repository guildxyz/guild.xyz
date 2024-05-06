import { Abi, ContractEventName, DecodeEventLogReturnType } from "viem"

export const findEvent = <
  TAbi extends Abi,
  TEventName extends ContractEventName<TAbi>
>(
  events: DecodeEventLogReturnType<TAbi, ContractEventName<TAbi>>[],
  eventName: TEventName
): DecodeEventLogReturnType<TAbi, TEventName> | undefined =>
  events.find((event) => event.eventName === eventName) as DecodeEventLogReturnType<
    TAbi,
    TEventName
  >
