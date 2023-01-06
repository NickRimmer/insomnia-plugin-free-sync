import { InsomniaBaseModel } from './basemodel.type'

interface BaseRequestGroup {
  name: string
  description: string
  environment: Object
  environmentPropertyOrder: Object | null
  metaSortKey: number
}

export type InsomniaRequestGroup = InsomniaBaseModel & BaseRequestGroup