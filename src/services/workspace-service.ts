import { InsomniaContextData } from '../insomnia/types/context-data.types'
import { ConfigurationService } from './configuration-service'
import { InsomniaWorkspace } from '../insomnia/types/workspace.types'
import { readFile, writeFile } from 'fs/promises'
import { validatePath } from './file-service'

export class WorkspaceService {
  private readonly _data: InsomniaContextData
  private readonly _configurationService: ConfigurationService
  private readonly _workspace: InsomniaWorkspace

  constructor(data: InsomniaContextData, configurationService: ConfigurationService, workspace: InsomniaWorkspace) {
    this._data = data
    this._configurationService = configurationService
    this._workspace = workspace
  }

  async exportAsync(): Promise<boolean> {
    // get path to save
    const path = await this._configurationService.getWorkspaceFilePathAsync()
    if (!validatePath(path)) return false

    // get collections in JSON string
    const dataJson = await this.getDataJsonAsync()
    if (!dataJson) return false

    await writeFile(path!, dataJson, {encoding: 'utf8'})
    return true
  }

  async importAsync(): Promise<boolean> {
    // get path to save
    const path = await this._configurationService.getWorkspaceFilePathAsync()
    if (!validatePath(path)) return false

    const dataJson = await readFile(path!, {encoding: 'utf8'})
    if (!dataJson) return false

    await this._data.import.raw(dataJson)
    return true
  }

  private async getDataJsonAsync(): Promise<string | null> {
    const dataJson = await this._data.export.insomnia({
      includePrivate: false,
      format: 'json',
      workspace: this._workspace,
    })
    if (!dataJson) return null

    const modelSettings = this._configurationService.getModelsAsync()
    const data = JSON.parse(dataJson)

    // reduce not necessary data
    data.resources.forEach((resource: any) => {
      // modified value updates even without updates of resource
      if (resource.modified && resource.created)
        resource.modified = resource.created

      // remove secure cookies //TODO make it configurable as well
      if (resource._type === 'cookie_jar')
        resource.cookies = resource.cookies.filter((cookie: any) => !cookie.secure)
    })

    return JSON.stringify(data)
  }
}