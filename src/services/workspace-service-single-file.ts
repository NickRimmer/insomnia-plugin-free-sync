import { WorkspaceServiceBase } from './workspace-service-base'
import { WorkspaceRaw } from '../insomnia/types/workspace-raw.types'
import { validatePath } from './file-service'
import { readFile, writeFile } from 'fs/promises'

export class WorkspaceServiceSingleFile extends WorkspaceServiceBase {
  protected async loadDataAsync(): Promise<WorkspaceRaw | null> {
    const configuration = await this._dataService.getConfigurationAsync()
    if (!validatePath(configuration.filePath)) return null

    const dataJson = await readFile(configuration.filePath!, {encoding: 'utf8'})
    if (!dataJson) return null
    return JSON.parse(dataJson) as WorkspaceRaw
  }

  protected async saveDataAsync(data: WorkspaceRaw): Promise<boolean> {
    const configuration = await this._dataService.getConfigurationAsync()
    if (!validatePath(configuration.filePath)) return false

    const dataJson = WorkspaceServiceBase.stringifyExportData(data)
    await writeFile(configuration.filePath!, dataJson, {encoding: 'utf8'})
    return true
  }
}
