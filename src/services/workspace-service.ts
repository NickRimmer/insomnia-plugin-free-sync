import { InsomniaContextData } from '../insomnia/types/context-data.types'
import { ConfigurationService } from './configuration-service'
import { InsomniaWorkspace } from '../insomnia/types/workspace.types'
import { readFile, writeFile } from 'fs/promises'
import { validatePath } from './file-service'
import { v4 as uuidv4 } from 'uuid'

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
    const configuration = await this._configurationService.getAsync()
    if (!validatePath(configuration.filePath)) return false

    // get collections in JSON string
    const dataJson = await this.getDataJsonAsync()
    if (!dataJson) return false

    await writeFile(configuration.filePath!, dataJson, {encoding: 'utf8'})
    return true
  }

  async importAsync(): Promise<boolean> {
    const configuration = await this._configurationService.getAsync()
    if (!validatePath(configuration.filePath)) return false

    const dataJson = await readFile(configuration.filePath!, {encoding: 'utf8'})
    if (!dataJson) return false

    let data = JSON.parse(dataJson)
    data = await this.filterByModelSettingsAsync(data)

    this.fixIds(data.resources, null, null)
    this.replaceWorkspaceData(data.resources)
    console.info(data.resources)

    await this._data.import.raw(JSON.stringify(data))
    // await this._data.import.raw(dataJson, {workspaceId: this._workspace._id})
    return true
  }

  private async getDataJsonAsync(): Promise<string | null> {
    const dataJson = await this._data.export.insomnia({
      includePrivate: false,
      format: 'json',
      workspace: this._workspace,
    })
    if (!dataJson) return null

    let data = JSON.parse(dataJson)
    data = this.reduceChangesNoise(data)
    // data = await this.filterByModelSettingsAsync(data)
    return JSON.stringify(data)
  }

  private fixIds(data: any, oldParentId: string | null, newParentId: string | null): void {
    const resources = oldParentId == null
      ? data.filter((x: any) => x._type.toLowerCase() === 'workspace')
      : data.filter((x: any) => x.parentId === oldParentId)

    resources.forEach((x: any) => {
      const oldId = x._id
      const newId = x._type.toLowerCase() === 'workspace'
        ? this._workspace._id
        : `${x._type}_${uuidv4().replace(/-/g, '')}`

      Object.assign(x, {
        _id: newId,
        parentId: newParentId,
      })

      this.fixIds(data, oldId, newId)
    })
  }

  private replaceWorkspaceData(resources: any) {
    const workspaceData = resources.find((x: any) => x._type === 'workspace')
    Object.assign(workspaceData, {
      '_id': this._workspace._id,
      'parentId': this._workspace.parentId,
      'modified': this._workspace.modified,
      'created': this._workspace.created,
      'description': this._workspace.description,
      'name': this._workspace.name,
      'scope': this._workspace.scope,
      '_type': 'workspace',
    })
  }

  private reduceChangesNoise(data: any): any {
    data
      .resources
      .forEach((resource: any) => {
        // modified value updates even without updates of resource
        if (resource.modified && resource.created)
          resource.modified = resource.created
      })

    return data
  }

  private async filterByModelSettingsAsync(data: any): Promise<any> {
    const configuration = await this._configurationService.getAsync()
    const current = JSON.parse(await this._data.export.insomnia({
      format: 'json',
      workspace: this._workspace,
      includePrivate: false,
    }))
    console.warn(current)

    const importingWorkspaceData = data.resources.find((x: any) => x._type === 'workspace')
    data.resources = data
      .resources
      .map((resource: any) => {
        // const currentResource = current.resources.find((x: any) => x._type === resource._type) ?? null

        switch (resource._type) {
          case 'api_spec':
            return configuration.enabledModels.apiSpec ? resource : null

          case 'request':
          case 'request_group':
            return configuration.enabledModels.request ? resource : null

          case 'unit_test':
          case 'unit_test_suite':
            return configuration.enabledModels.unitTest ? resource : null

          case 'cookie_jar': {
            resource.cookies = resource
              .cookies
              .filter((cookie: any) =>
                (!cookie.secure && configuration.enabledModels.cookiesNotSecure) ||
                (cookie.secure && configuration.enabledModels.cookiesSecure),
              )

            return resource.cookies.length > 0
              ? resource
              : null
          }

          case 'environment': {
            const isBaseEnvironment = resource.parentId === importingWorkspaceData._id
            console.log(resource)
            return (
              (configuration.enabledModels.environmentBase && isBaseEnvironment) ||
              (configuration.enabledModels.environmentCustom && !isBaseEnvironment)
            ) ? resource
              : null
          }

          default:
            return resource
        }
      })
      .filter((resource: any) => resource !== null)

    return data
  }
}

/*
if (resource._type === 'cookie_jar')
  resource.cookies = resource.cookies.filter((cookie: any) => !cookie.secure)
*/