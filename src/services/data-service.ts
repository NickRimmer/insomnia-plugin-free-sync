import { PluginConfiguration, PluginConfigurationDefault } from './data-service.types'
import { InsomniaContextStore } from '../insomnia/types/context-store.types'

export class DataService {
  private readonly _workspaceId: string
  private _store: InsomniaContextStore

  constructor(workspaceId: string, store: InsomniaContextStore) {
    this._workspaceId = workspaceId
    this._store = store
  }

  private get _configurationStoreKey(): string {
    return `plugin_free_sync_${this._workspaceId}_configuration`
  }

  public async getConfigurationAsync(): Promise<PluginConfiguration> {
    const value = await this._store.getItem(this._configurationStoreKey)
    if (!value) return PluginConfigurationDefault

    const result = JSON.parse(value) as PluginConfiguration

    // old version configurations fix
    result.saveAsSingleFile = result.saveAsSingleFile || result.saveAsSingleFile === undefined

    return result
  }

  public async setConfigurationAsync(configuration: PluginConfiguration): Promise<void> {
    return this._store.setItem(this._configurationStoreKey, JSON.stringify(configuration))
  }
}