import { InsomniaContextStore } from '../insomnia/types/context-store.types'
import { SyncModels } from '../components/configuration-dialog.types'

const STORE_KEY_FILE_PATH = 'insomnia-plugin-free-sync-configuration-file-path'
const STORE_KEY_AUTO_SAVE = 'insomnia-plugin-free-sync-configuration-auto-save'
const STORE_KEY_MODELS = 'insomnia-plugin-free-sync-configuration-models'

export class ConfigurationService {
  private readonly _store: InsomniaContextStore

  constructor(store: InsomniaContextStore) {
    this._store = store
  }

  getWorkspaceFilePathAsync(): Promise<string | null> {
    return this._store.getItem(STORE_KEY_FILE_PATH)
  }

  setWorkspaceFilePathAsync(path: string): Promise<void> {
    return this._store.setItem(STORE_KEY_FILE_PATH, path)
  }

  async getAutoSaveOptionAsync(): Promise<boolean> {
    const value = await this._store.getItem(STORE_KEY_AUTO_SAVE)
    return value === String(true)
  }

  setAutoSaveOptionAsync(value: boolean): Promise<void> {
    return this._store.setItem(STORE_KEY_AUTO_SAVE, String(value))
  }

  async getModelsAsync(): Promise<SyncModels> {
    const jsonStr = await this._store.getItem(STORE_KEY_MODELS)
    const defaultValue = {
      workspace: true,
      request: true,
      environment: true,
      api_spec: true,
      cookie_jar: false,
      unit_test: false,
    } as SyncModels

    if (!jsonStr) return defaultValue
    return {...defaultValue, ...JSON.parse(jsonStr)}
  }

  setModelsAsync(data: SyncModels): Promise<void> {
    const jsonStr = JSON.stringify(data)
    return this._store.setItem(STORE_KEY_MODELS, jsonStr)
  }
}