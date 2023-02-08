import { InsomniaContextData } from '../insomnia/types/context-data.types'
import { DataService } from './data-service'
import { InsomniaWorkspace } from '../insomnia/types/workspace.types'
import { readFile, writeFile } from 'fs/promises'
import { validatePath } from './file-service'
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
    const configuration = await this._configurationService.getConfigurationAsync()
    if (!validatePath(configuration.filePath)) return false

    const dataJson = await this.getExportDataJsonAsync()
    if (!dataJson) return false

    await writeFile(configuration.filePath!, dataJson, {encoding: 'utf8'})
    return true
  }

  async importAsync(): Promise<boolean> {
    const data = await this.getImportDataJsonAsync()
    if (!data) return false

    const dataWorkspace = data.resources.find(x => x._type.toLowerCase() === 'workspace')
    if (!dataWorkspace) throw new Error('Workspace not found in imported file content')
    if (dataWorkspace._id !== this._workspace._id) throw new Error('You are trying to load data of different workspace')

    await this._dataService.import.raw(JSON.stringify(data))
    return true
  }

  private async getImportDataJsonAsync(): Promise<WorkspaceRaw | null> {
    const configuration = await this._configurationService.getConfigurationAsync()
    if (!validatePath(configuration.filePath)) return null

    const dataJson = await readFile(configuration.filePath!, {encoding: 'utf8'})
    if (!dataJson) return null

    return JSON.parse(dataJson) as WorkspaceRaw
  }

  private async getExportDataJsonAsync(): Promise<string | null> {
    const dataJson = await this._dataService.export.insomnia({
      includePrivate: false,
      format: 'json',
      workspace: this._workspace,
    })
    if (!dataJson) return null

    let data = JSON.parse(dataJson)
    data = this.reduceChangesNoise(data)
    data = await this.filterByModelSettingsAsync(data)
    return JSON.stringify(data, null, 2)
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
        switch (resource._type.toLowerCase()) {
          case 'workspace':
            return resource

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
            console.warn(`Found unknown resource '${resource._type}' on import`)
            return resource
        }
      })
      .filter((resource: any) => resource !== null)

    return data
  }
}