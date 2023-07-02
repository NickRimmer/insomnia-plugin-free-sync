import { InsomniaWorkspace } from './workspace.types'

export type InsomniaContextData = {
  import: InsomniaContextDataImport
  syncToWorkspace: InsomniaContextDataSync
  export: InsomniaContextDataExport
}

export type InsomniaContextDataImport = {
  uri(uri: string): Promise<void>
  raw(text: string): Promise<void>
}

export type InsomniaContextDataSync = {
  uri(uri: string, workspaceId: string): Promise<void>
  raw(text: string, workspaceId: string): Promise<void>
}

export type InsomniaContextDataExport = {
  insomnia(options: {
    includePrivate?: boolean
    format?: 'json' | 'yaml',
    workspace: InsomniaWorkspace,
  }): Promise<string>
  har(options: { includePrivate?: boolean }): Promise<string>
}
