import InsomniaDataContext from './data-context'
import InsomniaDataModels from './data-models.enum'

class InsomniaData {
  private readonly _db = {} as Record<InsomniaDataModels, InsomniaDataContext>

  private getDb(dataModels: InsomniaDataModels) {
    let db = this._db[dataModels]
    if (!db) {
      db = new InsomniaDataContext(dataModels)
      this._db[dataModels] = db
    }

    return db
  }
}

export default InsomniaData