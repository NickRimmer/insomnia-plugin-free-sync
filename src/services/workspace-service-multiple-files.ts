import { WorkspaceServiceBase } from './workspace-service-base'
import { WorkspaceRaw } from '../insomnia/types/workspace-raw.types'
import path from 'path'
import { exists, isValidPath } from './file-service'
import { mkdir, readFile, rm, writeFile } from 'fs/promises'
import { promises } from 'fs'

export class WorkspaceServiceMultipleFiles extends WorkspaceServiceBase {
  private static readonly metaFileName: string = 'meta.json'
  private static readonly metaFolderName: string = 'insomnia'

  protected async loadDataAsync(): Promise<WorkspaceRaw | null> {
    const configuration = await this._dataService.getConfigurationAsync()
    const filePath = path.join(configuration.filePath!, WorkspaceServiceMultipleFiles.metaFolderName)
    if (!isValidPath(filePath, false)) return null


    const metaDataJson = await readFile(path.join(filePath, WorkspaceServiceMultipleFiles.metaFileName), {encoding: 'utf8'})
    if (!metaDataJson) return null

    const workspace = JSON.parse(metaDataJson)
    workspace.resources = []

    const subdirectories = await promises.readdir(filePath)

    for await (const subdirectory of subdirectories.filter(x => isValidPath(x, false))) {
      const currentResourceTypeSubdirectory = path.join(filePath, subdirectory)
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
    const filePath = path.join(configuration.filePath!, WorkspaceServiceMultipleFiles.metaFolderName)
    if (!isValidPath(filePath, false)) return false

    //TODO backup old
    if (await exists(filePath)) await rm(filePath, {recursive: true, force: true})
    await mkdir(filePath)

    for await(const resource of data.resources) {
      const resourceFolderPath = path.join(filePath, resource._type)
      const resourceFilePath = path.join(resourceFolderPath, `${resource._id}.json`)

      if (!(await exists(resourceFolderPath))) await mkdir(resourceFolderPath)
      await writeFile(resourceFilePath, WorkspaceServiceBase.stringifyExportData(resource), {encoding: 'utf8'})
    }

    data.resources = []
    await writeFile(
      path.join(filePath, WorkspaceServiceMultipleFiles.metaFileName),
      WorkspaceServiceBase.stringifyExportData(data), {encoding: 'utf8'},
    )
    return true
  }

}