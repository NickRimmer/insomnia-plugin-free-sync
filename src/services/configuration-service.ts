import { InsomniaContextStore } from '../insomnia/types/context-store.types'

const STORE_KEY_FILE_PATH = 'insomnia-plugin-free-sync-configuration-file-path'
const STORE_KEY_AUTO_SAVE = 'insomnia-plugin-free-sync-configuration-auto-save'

export class ConfigurationService {
  private _store: InsomniaContextStore

  constructor(store: InsomniaContextStore) {
    this._store = store
  }

  getCollectionFilePathAsync(): Promise<string | null> {
    return this._store.getItem(STORE_KEY_FILE_PATH)
  }

  setCollectionFilePathAsync(path: string): Promise<void> {
    return this._store.setItem(STORE_KEY_FILE_PATH, path)
  }

  async getAutoSaveOptionAsync(): Promise<boolean> {
    const value = await this._store.getItem(STORE_KEY_AUTO_SAVE)
    return value === String(true)
  }

  setAutoSaveOptionAsync(value: boolean): Promise<void> {
    return this._store.setItem(STORE_KEY_AUTO_SAVE, String(value))
  }
}