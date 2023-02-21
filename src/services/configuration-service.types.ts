﻿export type PluginConfiguration = {
  filePath: string,
  autoSave: boolean,
  enabledModels: PluginModelsConfiguration
  SaveAndLoadAsMultipleFiles: boolean
}

export type PluginModelsConfiguration = {
  apiSpec: boolean,
  environmentBase: boolean,
  environmentCustom: boolean,
  request: boolean,
  unitTest: boolean,
  cookiesNotSecure: boolean,
  cookiesSecure: boolean,
}

export const PluginConfigurationDefault: PluginConfiguration = {
  filePath: '',
  autoSave: false,
  SaveAndLoadAsMultipleFiles: false,
  enabledModels: {
    apiSpec: true,
    environmentBase: true,
    environmentCustom: true,
    request: true,
    unitTest: true,
    cookiesNotSecure: true,
    cookiesSecure: false,
  },
} 