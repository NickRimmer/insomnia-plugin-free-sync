import { InsomniaContextData } from '../insomnia/types/context-data.types'
import { ConfigurationService } from './configuration-service'
import { InsomniaWorkspace } from '../insomnia/types/workspace.types'
import { writeFile } from 'fs/promises'

export const validatePath = (path: string | null | undefined): boolean =>
  path !== null &&
  path !== undefined &&
  path.length > 0 &&
  new RegExp(
    '^(?:[a-z]:)?[\\/\\\\]{0,2}(?:[.\\/\\\\ ](?![.\\/\\\\\\n])|[^<>:"|?*.\\/\\\\ \\n])+$', 'gmi')
    .exec(path) !== null

export class FileService {
  private _data: InsomniaContextData
  private _configurationService: ConfigurationService
  private _workspace: InsomniaWorkspace

  constructor(data: InsomniaContextData, configurationService: ConfigurationService, workspace: InsomniaWorkspace) {
    this._data = data
    this._configurationService = configurationService
    this._workspace = workspace
  }

  async writeCollectionFileAsync(): Promise<boolean> {
    // get path to save
    const path = await this._configurationService.getCollectionFilePathAsync()
    if (!validatePath(path)) return false

    // get collections in JSON string
    const dataJson = await this.getDataJsonAsync()
    if (!dataJson) return false

    await writeFile(path!, dataJson)
    return true
  }

  private async getDataJsonAsync(): Promise<string | null> {
    const dataJson = await this._data.export.insomnia({
      includePrivate: false,
      format: 'json',
      workspace: this._workspace,
    })

    if (!dataJson) return null

    // reduce not necessary data
    const data = JSON.parse(dataJson)

    data.resources.forEach((resource: any) => {
      // modified value updates even without updates of resource
      if (resource.modified && resource.created)
        resource.modified = resource.created

      // remove secure cookies
      if (resource._type === 'cookie_jar')
        resource.cookies = resource.cookies.filter((cookie: any) => !cookie.secure)
    })

    return JSON.stringify(data)
  }
}