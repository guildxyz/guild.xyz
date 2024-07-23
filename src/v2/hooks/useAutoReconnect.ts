import { useCallback, useEffect } from "react"
import { useConfig, useConnectors } from "wagmi"

const waitForRetry = () =>
  new Promise((resolve) => setTimeout(() => resolve(true), 200))

const useAutoReconnect = () => {
  const connectors = useConnectors()
  const config = useConfig()

  const handleReconnect = useCallback(async () => {
    if (!config || !connectors) return

    let connected = false

    const safeConnector = connectors.find((connector) => connector.id === "safe")
    const canConnectToSafe = await safeConnector
      .getProvider()
      .then((provider) => !!provider)
      .catch(() => false)

    const recentConnectorId = await config.storage.getItem("recentConnectorId")
    if (!recentConnectorId && !canConnectToSafe) return

    const connectorToReconnect = canConnectToSafe
      ? safeConnector
      : connectors.find((connector) => connector.id === recentConnectorId)

    if (!connectorToReconnect) return

    config.setState((prevState) => ({ ...prevState, status: "reconnecting" }))

    const provider = await connectorToReconnect.getProvider()
    if (!provider) return

    let isAuthorized = false
    let retryCount = 0

    while (!isAuthorized && retryCount < 3) {
      // isAuthorized is false most of the time, so we retry 3 times
      await waitForRetry()
      retryCount++
      isAuthorized = await connectorToReconnect.isAuthorized()
    }

    if (!isAuthorized) return

    const data = await connectorToReconnect
      .connect({
        isReconnecting: true,
      })
      .catch(() => null)

    if (!data) return

    connectorToReconnect.emitter.off("connect", config._internal.events.connect)
    connectorToReconnect.emitter.on("change", config._internal.events.change)
    connectorToReconnect.emitter.on("disconnect", config._internal.events.disconnect)

    config.setState((prevState) => ({
      ...prevState,
      current: connectorToReconnect.uid,
      connections: new Map(prevState.connections ?? []).set(
        connectorToReconnect.uid,
        {
          accounts: data.accounts,
          chainId: data.chainId,
          connector: connectorToReconnect,
        }
      ),
    }))

    connected = true

    if (
      config.state.status === "reconnecting" ||
      config.state.status === "connecting"
    ) {
      // If connecting didn't succeed, set to disconnected
      if (!connected)
        config.setState((x) => ({
          ...x,
          connections: new Map(),
          current: undefined,
          status: "disconnected",
        }))
      else config.setState((x) => ({ ...x, status: "connected" }))
    }
  }, [config, connectors])

  useEffect(() => {
    if (typeof window === "undefined") return
    handleReconnect()
  }, [handleReconnect])
}

export default useAutoReconnect
