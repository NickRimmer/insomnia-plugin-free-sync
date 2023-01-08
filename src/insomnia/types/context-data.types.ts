import { InsomniaWorkspace } from './workspace.types'

export type InsomniaContextData = {
  import: InsomniaContextDataImport
  export: InsomniaContextDataExport
}

export type InsomniaContextDataImport = {
  uri(uri: string, options?: { workspaceId?: string }): Promise<void>
  raw(text: string, options?: { workspaceId?: string }): Promise<void>
}

export type InsomniaContextDataExport = {
  insomnia(options: {
    includePrivate?: boolean
    format?: 'json' | 'yaml',
    workspace: InsomniaWorkspace,
  }): Promise<string>
  har(options: { includePrivate?: boolean }): Promise<string>
}
