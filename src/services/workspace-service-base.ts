import { DataService } from './data-service'
import { InsomniaContextData } from '../insomnia/types/context-data.types'
import { InsomniaWorkspace } from '../insomnia/types/workspace.types'
import { PluginConfiguration } from './configuration-service.types'
import { WorkspaceRaw } from '../insomnia/types/workspace-raw.types'

export abstract class WorkspaceServiceBase {
  protected readonly _dataService: DataService
  private readonly _data: InsomniaContextData
  private readonly _workspace: InsomniaWorkspace

  public constructor(
    dataService: DataService,
    data: InsomniaContextData,
    workspace: InsomniaWorkspace,
  ) {
    this._dataService = dataService ?? (() => {
      throw new Error('Configuration object is required')
    })

    this._data = data ?? (() => {
      throw new Error('Data service is required')
    })

    this._workspace = workspace ?? (() => {
      throw new Error('Workspace data is required')
    })
  }

  protected static stringifyExportData(data: object): string {
    return JSON.stringify(data, null, 2)
  }

  private static async filterByModelSettingsAsync(data: WorkspaceRaw, configuration: PluginConfiguration): Promise<WorkspaceRaw | null> {
    const importingWorkspaceData = data
      .resources
      .find((x: any) => x._type === 'workspace')

    if (!importingWorkspaceData) return null

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

  private static reduceChangesNoise(data: WorkspaceRaw): WorkspaceRaw {
    data
      .resources
      .forEach((resource: any) => {
        // modified value updates even without updates of resource
        if (resource.modified && resource.created)
          resource.modified = resource.created
      })

    return data
  }

  public async exportAsync(): Promise<boolean> {
    const data = await this.getExportDataAsync()
    if (!data) return false

    return this.saveDataAsync(data)
  }

  public async importAsync(): Promise<boolean> {
    const data = await this.loadDataAsync()
    if (!data) return false

    const dataWorkspace = data.resources.find(x => x._type.toLowerCase() === 'workspace')
    if (!dataWorkspace) throw new Error('Workspace not found in imported file content')
    if (dataWorkspace._id !== this._workspace._id) throw new Error('You are trying to load data of different workspace')

    await this._data.import.raw(JSON.stringify(data))
    return true
  }

  protected abstract saveDataAsync(data: WorkspaceRaw): Promise<boolean>;

  protected abstract loadDataAsync(): Promise<WorkspaceRaw | null>;

  protected async getExportDataAsync(): Promise<WorkspaceRaw | null> {
    const dataJson = await this._data.export.insomnia({
      includePrivate: false,
      format: 'json',
      workspace: this._workspace,
    })

    if (!dataJson) return null
    const configuration = await this._dataService.getConfigurationAsync()

    let data = JSON.parse(dataJson) as WorkspaceRaw | null
    if (!data) return null

    data = WorkspaceServiceBase.reduceChangesNoise(data)
    data = await WorkspaceServiceBase.filterByModelSettingsAsync(data, configuration)

    return data
  }
}