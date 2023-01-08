import { InsomniaBaseModel } from './basemodel.type'

interface InsomniaBaseWorkspace {
  name: string
  description: string
}

export type InsomniaWorkspace = InsomniaBaseModel & InsomniaBaseWorkspace