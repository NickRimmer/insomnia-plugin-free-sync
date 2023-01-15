import { InsomniaContextData } from '../insomnia/types/context-data.types'
import { DataService } from './data-service'
import { InsomniaWorkspace } from '../insomnia/types/workspace.types'
import { readFile, writeFile } from 'fs/promises'
import { validatePath } from './file-service'
import { v4 as uuidv4 } from 'uuid'
import { WorkspaceResource } from '../insomnia/types/workspace-resource'
import { WorkspaceRaw } from '../insomnia/types/workspace-raw'

export class WorkspaceService {
  private readonly _dataService: InsomniaContextData
  private readonly _configurationService: DataService
  private readonly _workspace: InsomniaWorkspace

  constructor(
    dataService: InsomniaContextData,
    configurationService: DataService,
    workspace: InsomniaWorkspace) {
    this._dataService = dataService
    this._configurationService = configurationService
    this._workspace = workspace
  }

  async exportAsync(): Promise<boolean> {
    // get path to save
    const configuration = await this._configurationService.getConfigurationAsync()
    if (!validatePath(configuration.filePath)) return false

    // get collections in JSON string
    const dataJson = await this.getDataJsonAsync()
    if (!dataJson) return false

    await writeFile(configuration.filePath!, dataJson, {encoding: 'utf8'})
    return true
  }

  async importAsync(): Promise<boolean> {
    const configuration = await this._configurationService.getConfigurationAsync()
    if (!validatePath(configuration.filePath)) return false

    const dataJson = await readFile(configuration.filePath!, {encoding: 'utf8'})
    if (!dataJson) return false

    let data = JSON.parse(dataJson) as WorkspaceRaw
    data = await this.filterByModelSettingsAsync(data)
    // await this._dataService.import.raw(JSON.stringify(data))
    await this.importWithFixesAsync(data)

    return true
  }

  private async importWithFixesAsync(data: WorkspaceRaw): Promise<void> {
    await this.fixIdsAsync(data.resources)
    this.useCurrentWorkspaceData(data.resources)

    await this._dataService.import.raw(JSON.stringify(data))
  }

  private async getDataJsonAsync(): Promise<string | null> {
    const dataJson = await this._dataService.export.insomnia({
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

  private async fixIdsAsync(resources: WorkspaceResource[]): Promise<void> {
    for (const resource of resources) {
      const oldId = resource._id
      const newId = await this.getNewIdAsync(resource)

      resource._id = newId
      resources.filter(x => x.parentId === oldId).forEach(x => x.parentId = newId)
    }
  }

  private async getNewIdAsync(resource: WorkspaceResource): Promise<string> {
    // save current workspace id
    if (resource._type.toLowerCase() === 'workspace') return this._workspace._id

    return `${resource._type}_${uuidv4().replace(/-/g, '')}`
  }

  private useCurrentWorkspaceData(resources: any) {
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
    const configuration = await this._configurationService.getConfigurationAsync()
    const importingWorkspaceData = data.resources.find((x: any) => x._type === 'workspace')

    data.resources = data
      .resources
      .map((resource: any) => {
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