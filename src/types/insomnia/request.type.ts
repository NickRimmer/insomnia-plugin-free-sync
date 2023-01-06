import { InsomniaBaseModel } from './basemodel.type'

export type InsomniaRequestAuthentication = Object

export type InsomniaRequestHeader = {
  name: string
  value: string
  description?: string
  disabled?: boolean
}

export type InsomniaRequestParameter = {
  name: string
  value: string
  disabled?: boolean
  id?: string
  fileName?: string
}

export type InsomniaRequestBodyParameter = {
  name: string
  value: string
  description?: string
  disabled?: boolean
  multiline?: string
  id?: string
  fileName?: string
  type?: string
}

export type InsomniaRequestBody = {
  mimeType?: string | null
  text?: string
  fileName?: string
  params?: Array<InsomniaRequestBodyParameter>
}

type BaseRequest = {
  url: string
  name: string
  description: string
  method: string
  body: InsomniaRequestBody
  parameters: Array<InsomniaRequestParameter>
  headers: Array<InsomniaRequestHeader>
  authentication: InsomniaRequestAuthentication
  metaSortKey: number
  isPrivate: boolean

  // Settings
  settingStoreCookies: boolean
  settingSendCookies: boolean
  settingDisableRenderRequestBody: boolean
  settingEncodeUrl: boolean
  settingRebuildPath: boolean
  settingFollowRedirects: string
}

export type InsomniaRequest = InsomniaBaseModel & BaseRequest