import { WorkspaceServiceBase } from './workspace-service-base'
import { WorkspaceRaw } from '../insomnia/types/workspace-raw.types'
import path from 'path'
import { exists, validatePath } from './file-service'
import { mkdir, readFile, rm, writeFile } from 'fs/promises'
import { promises } from 'fs'

export class WorkspaceServiceMultipleFiles extends WorkspaceServiceBase {
  private readonly multipleFileSubfolderRelativePath = '../insomniaData' //TODO store to the same folder with base file

  protected async loadDataAsync(): Promise<WorkspaceRaw | null> {
    const configuration = await this._dataService.getConfigurationAsync()
    if (!validatePath(configuration.filePath)) return null

    const metaDataJson = await readFile(path.join(configuration.filePath!), {encoding: 'utf8'})
    if (!metaDataJson) return null

    const workspace = JSON.parse(metaDataJson)
    workspace.resources = []

    const multipleFileSubFolder = path.join(configuration.filePath!, this.multipleFileSubfolderRelativePath)
    const subdirectories = await promises.readdir(multipleFileSubFolder)

    for await (const subdirectory of subdirectories) {
      const currentResourceTypeSubdirectory = path.join(multipleFileSubFolder, subdirectory)
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
    if (!validatePath(configuration.filePath)) return false

    const multipleFileSubFolder = path.join(configuration.filePath!, this.multipleFileSubfolderRelativePath)

    //TODO backup old
    if (await exists(multipleFileSubFolder)) await rm(multipleFileSubFolder, {recursive: true, force: true})
    await mkdir(multipleFileSubFolder)

    for await(const resource of data.resources) {
      const resourceFolderPath = path.join(multipleFileSubFolder, resource._type)
      const resourceFilePath = path.join(resourceFolderPath, `${resource._id}.json`)

      if (!(await exists(resourceFolderPath))) await mkdir(resourceFolderPath)
      await writeFile(resourceFilePath, WorkspaceServiceBase.stringifyExportData(resource), {encoding: 'utf8'})
    }

    data.resources = []
    await writeFile(configuration.filePath!, WorkspaceServiceBase.stringifyExportData(data), {encoding: 'utf8'})
    return true
  }

}