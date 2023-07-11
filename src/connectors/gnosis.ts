import { initializeConnector, Web3ReactHooks } from "@web3-react/core"
import { GnosisSafe } from "@web3-react/gnosis-safe"

const initializeGnosisConnector = (): [GnosisSafe, Web3ReactHooks] => {
  /**
   * In edge runtime, the initializeConnector won't work, so as a workaround we're
   * using a try-catch here and returning an array with undefined values. This won't
   * cause a problem, because this function will run and return proper values when
   * we're not on an edge runtime
   */
  try {
    const [gnosis, hooks] = initializeConnector<GnosisSafe>(
      (actions) =>
        new GnosisSafe({
          actions,
        })
    )

    return [gnosis, hooks]
  } catch (_) {
    return [undefined, undefined]
  }
}

export default initializeGnosisConnector
