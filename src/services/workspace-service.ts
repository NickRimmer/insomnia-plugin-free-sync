import { InsomniaContextData } from '../insomnia/types/context-data.types'
import { DataService } from './data-service'
import { InsomniaWorkspace } from '../insomnia/types/workspace.types'
import { readFile, writeFile, mkdir, rm } from 'fs/promises'
import { exists, validatePath } from './file-service'
import { WorkspaceRaw } from '../insomnia/types/workspace-raw'
import { promises } from 'fs'
import path from 'path'
import { WorkspaceResource } from '../insomnia/types/workspace-resource'

export class WorkspaceService {
  private readonly _dataService: InsomniaContextData
  private readonly _configurationService: DataService
  private readonly _workspace: InsomniaWorkspace
  private readonly multipleFileSubfolderRelativePath = '../insomniaData';

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

    if(configuration.SaveAndLoadAsMultipleFiles)
    {
      let exportData = await this.getExportDataAsync()
      if(!exportData) return false
      const multipleFileSubFolder = path.join(configuration.filePath!, this.multipleFileSubfolderRelativePath)
      if (await exists(multipleFileSubFolder)){
        await rm(multipleFileSubFolder, { recursive: true, force: true });
      }
      await mkdir(multipleFileSubFolder);
      for await(const resource of exportData.resources){
        const SubFolderOfCurrentResourceType = path.join(multipleFileSubFolder, resource._type)
        if(!(await exists(SubFolderOfCurrentResourceType ))) await mkdir(SubFolderOfCurrentResourceType)
        await writeFile(path.join(SubFolderOfCurrentResourceType , `${resource._id}.json`), this.stringifyExportData(resource), {encoding: 'utf8'})
      }
      //set contents of the import file to be mostly empty as some data is needed for import but its mostly ids. The real data that changes frequently is stored across multiple files
      exportData.resources = exportData.resources.filter((x: WorkspaceResource) => (x._id.startsWith('wrk') || (x._id.startsWith('spc') || (x._id.startsWith('env') && x.name === "Base Environment"))))
      exportData.resources.forEach((resource: WorkspaceResource) => {
        if(resource?.contents) resource.contents = "";
        if(resource?.data) resource.data = {};
        if(resource?.dataPropertyOrder) resource.dataPropertyOrder = {};
      })
      await writeFile(configuration.filePath!, this.stringifyExportData(exportData), {encoding: 'utf8'}) 
    }
    else
    {
      const dataJson = await this.getExportDataJsonAsync()
      if (!dataJson) return false
      await writeFile(configuration.filePath!, dataJson, {encoding: 'utf8'})
    }
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

    if(configuration.SaveAndLoadAsMultipleFiles)
    {
      const metaDataJson = await readFile(path.join(configuration.filePath!), {encoding: 'utf8'})
      if(!metaDataJson) return null
      let workspace = JSON.parse(metaDataJson);
      //clear resources since we use their separated files for loading the actual data. The duplicate ids are stored there just for the initial import so we don't recreate base environments and api specifications
      workspace.resources = new Array();
      const multipleFileSubFolder = path.join(configuration.filePath!, this.multipleFileSubfolderRelativePath)
      const subdirectories = await promises.readdir(multipleFileSubFolder)
      for await (const subdirectory of subdirectories){
        const currentResourceTypeSubdirectory = path.join(multipleFileSubFolder, subdirectory)
        let files = await promises.readdir(currentResourceTypeSubdirectory)
        for await(const file of files){
          workspace.resources.push(JSON.parse(await readFile(path.join(currentResourceTypeSubdirectory, file), {encoding: 'utf8'})))
        }
      }
      return workspace
    }
    else
    {
      const dataJson = await readFile(configuration.filePath!, {encoding: 'utf8'})
      if (!dataJson) return null
      return JSON.parse(dataJson) as WorkspaceRaw
    }
  }

  private async getExportDataAsync(): Promise<any> {
    const dataJson = await this._dataService.export.insomnia({
      includePrivate: false,
      format: 'json',
      workspace: this._workspace,
    })
    if (!dataJson) return null
    let data = JSON.parse(dataJson)
    data = this.reduceChangesNoise(data)
    data = await this.filterByModelSettingsAsync(data)
    return data
  }

  private async getExportDataJsonAsync(): Promise<string | null> {
    const data = await this.getExportDataAsync();
    return this.stringifyExportData(data)
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

  private stringifyExportData(data: object): string {
    return JSON.stringify(data, null, 2)
  }
}