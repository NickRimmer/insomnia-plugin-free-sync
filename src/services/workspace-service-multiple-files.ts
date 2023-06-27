import { WorkspaceServiceBase } from './workspace-service-base'
import { WorkspaceRaw } from '../insomnia/types/workspace-raw.types'
import path from 'path'
import { exists, isValidPath } from './file-service'
import { mkdir, readFile, rm, writeFile } from 'fs/promises'
import { promises } from 'fs'

export class WorkspaceServiceMultipleFiles extends WorkspaceServiceBase {
  private static readonly metaFileName: string = 'meta.json'

  protected async loadDataAsync(): Promise<WorkspaceRaw | null> {
    const configuration = await this._dataService.getConfigurationAsync()
    if (!isValidPath(configuration.filePath, false)) return null

    const metaDataJson = await readFile(path.join(configuration.filePath!, WorkspaceServiceMultipleFiles.metaFileName), {encoding: 'utf8'})
    if (!metaDataJson) return null

    const workspace = JSON.parse(metaDataJson)
    workspace.resources = []

    const subdirectories = await promises.readdir(configuration.filePath)

    for await (const subdirectory of subdirectories.filter(x => isValidPath(x, false))) {
      const currentResourceTypeSubdirectory = path.join(configuration.filePath, subdirectory)
      const files = await promises.readdir(currentResourceTypeSubdirectory)

      for (const file of files) {
        const resourcePath = path.join(currentResourceTypeSubdirectory, file)
        const resourceJson = await readFile(resourcePath, {encoding: 'utf8'})
        const resourceObj = JSON.parse(resourceJson)

        workspace.resources.push(resourceObj)
      }
    }

    return workspace
  }

  protected async saveDataAsync(data: WorkspaceRaw): Promise<boolean> {
    const configuration = await this._dataService.getConfigurationAsync()
    if (!isValidPath(configuration.filePath, false)) return false

    //TODO backup old
    if (await exists(configuration.filePath)) await rm(configuration.filePath, {recursive: true, force: true})
    await mkdir(configuration.filePath)

    for await(const resource of data.resources) {
      const resourceFolderPath = path.join(configuration.filePath, resource._type)
      const resourceFilePath = path.join(resourceFolderPath, `${resource._id}.json`)

      if (!(await exists(resourceFolderPath))) await mkdir(resourceFolderPath)
      await writeFile(resourceFilePath, WorkspaceServiceBase.stringifyExportData(resource), {encoding: 'utf8'})
    }

    data.resources = data.resources.filter(x => 
      x._id.startsWith('wrk') || 
      x._id.startsWith('spc') || 
      (x._id.startsWith('env') && x.name === "Base Environment")
    )
    
    data.resources.forEach(resource => {
      if(resource?.contents) resource.contents = "";
      if(resource?.data) resource.data = {};
      if(resource?.dataPropertyOrder) resource.dataPropertyOrder = {};
    })
    
    await writeFile(
      path.join(configuration.filePath!, WorkspaceServiceMultipleFiles.metaFileName),
      WorkspaceServiceBase.stringifyExportData(data), {encoding: 'utf8'},
    )
    return true
  }

}