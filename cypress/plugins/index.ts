/* eslint-disable import/no-extraneous-dependencies */
import synpressPlugins from "@synthetixio/synpress/plugins"

const pluginsConfig = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  synpressPlugins(on, config)
}

export default pluginsConfig
