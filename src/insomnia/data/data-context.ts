import NeDB from 'nedb'
import fsPath from 'path'
import InsomniaDataModels from './data-models.enum'

class InsomniaDataContext extends NeDB {
  constructor(modelType: InsomniaDataModels | string) {
    const appPath = (window as any).app.getPath('userData') as string
    const dbPath = fsPath.join(appPath, `insomnia.${modelType}.db`)

    const config: NeDB.DataStoreOptions = {
      autoload: true,
      filename: dbPath,
      corruptAlertThreshold: 0.9,
    }

    super(config)
  }

  findAsync(query: any): Promise<any[]> {
    return new Promise<any>((resolve, reject) => {
      this.find(query, (error: any, data: any) => {
        if (error) {
          reject(error)
          return
        }

        resolve(data)
      })
    })
  }

  async findRecordAsync(id: string): Promise<any | null> {
    const results = await this.findAsync({_id: id})
    if (results.length <= 0) return null
    return results[0]
  }

  updateAsync(query: any, updates: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.update(query, {$set: updates}, {}, (error: any) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }

  updateRecordAsync(id: string, updates: any): Promise<void> {
    return this.updateAsync({_id: id}, updates)
  }

  insertAsync(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.insert(data, (error) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }
}

export default InsomniaDataContext