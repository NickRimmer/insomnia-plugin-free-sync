import InsomniaDataContext from './data-context'
import InsomniaDataModels from './data-models.enum'

type WorkspaceProps = {
  pluginsData: Record<string, any>
}

class InsomniaData {
  private readonly _db = {} as Record<InsomniaDataModels, InsomniaDataContext>
  private readonly _pluginName: string

  constructor(pluginName: string) {
    this._pluginName = pluginName
  }

  async getWorkspaceConfigAsync(workspaceId: string): Promise<any | null> {
    const workspace = await this.getDb(InsomniaDataModels.workspace).findRecordAsync(workspaceId) as WorkspaceProps
    if (!workspace.pluginsData) return null
    return workspace.pluginsData[this._pluginName] ?? null
  }

  updateWorkspaceConfigAsync(workspaceId: string, updates: any): Promise<void> {
    const workspaceUpdate: WorkspaceProps = {
      pluginsData: {
        [this._pluginName]: updates,
      },
    }
    return this.getDb(InsomniaDataModels.workspace).updateRecordAsync(workspaceId, workspaceUpdate)
  }

  private getDb(dataModels: InsomniaDataModels) {
    let db = this._db[dataModels]
    if (!db) {
      db = new InsomniaDataContext(dataModels)
      this._db[dataModels] = db
    }

    return db
  }
}

export default InsomniaData