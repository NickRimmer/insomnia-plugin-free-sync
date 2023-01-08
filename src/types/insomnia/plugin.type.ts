export type InsomniaPlugin = {
  name: string
  description: string
  version: string
  directory: string
  config: InsomniaPluginConfig
  module: any
}

export type InsomniaPluginConfig = {
  disabled: boolean
}