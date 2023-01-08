import { InsomniaWorkspace } from './workspace.type'
import { InsomniaRequestGroup } from './request-group.type'
import { InsomniaRequest, InsomniaRequestParameter } from './request.type'
import { InsomniaBaseModel } from './basemodel.type'
import { InsomniaDialogOptions } from './dialog-options.types'
import { InsomniaAppInfo } from './app-info'

interface InsomniaTemplateTagArgumentOption {
  displayName: string
  value: string
  description?: string
  placeholder?: string
}

interface InsomniaTemplateTagArgument {
  displayName: string
  description?: string
  defaultValue: string | number | boolean
  type: 'string' | 'number' | 'enum' | 'model'

  // Only type === 'string'
  placeholder?: string

  // Only type === 'model'
  modelType: string

  // Only type === 'enum'
  options: InsomniaTemplateTagArgumentOption[]
}


interface WorkspaceAction {
  label: string
  action(
    context: InsomniaAppContext,
    model: InsomniaWorkspaceActionModel,
  ): Promise<void>
}

export interface InsomniaWorkspaceActionModel {
  workspace: InsomniaWorkspace
  requestGroup: InsomniaRequestGroup
  requests: InsomniaRequest[]
}

interface InsomniaThemeBlockBackground {
  default?: string
  success?: string
  notice?: string
  warning?: string
  danger?: string
  surprise?: string
  info?: string
}

interface InsomniaThemeBlockForeground {
  default?: string
  success?: string
  notice?: string
  warning?: string
  danger?: string
  surprise?: string
  info?: string
}

interface InsomniaThemeBlockHighlight {
  default: string
  xxs?: string
  xs?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
}

interface InsomniaThemeBlock {
  background?: InsomniaThemeBlockBackground
  foreground?: InsomniaThemeBlockForeground
  highlight?: InsomniaThemeBlockHighlight
}

interface InsomniaThemeInnerStyles {
  dialog?: InsomniaThemeBlock
  dialogFooter?: InsomniaThemeBlock
  dialogHeader?: InsomniaThemeBlock
  dropdown?: InsomniaThemeBlock
  editor?: InsomniaThemeBlock
  link?: InsomniaThemeBlock
  overlay?: InsomniaThemeBlock
  pane?: InsomniaThemeBlock
  paneHeader?: InsomniaThemeBlock
  sidebar?: InsomniaThemeBlock
  sidebarHeader?: InsomniaThemeBlock
  sidebarList?: InsomniaThemeBlock
  tooltip?: InsomniaThemeBlock
  transparentOverlay?: InsomniaThemeBlock
}

type ThemeInner = {
  background?: InsomniaThemeBlockBackground
  foreground?: InsomniaThemeBlockForeground
  highlight?: InsomniaThemeBlockHighlight
  rawCss?: string
  styles?: InsomniaThemeInnerStyles
}

interface InsomniaRequestContext {
  getId(): string
  getName(): string
  getUrl(): string
  setUrl(url: string): void
  getMethod(): string
  getHeader(name: string): string | null
  hasHeader(name: string): boolean
  removeHeader(name: string): void
  setHeader(name: string, value: string): void
  addHeader(name: string, value: string): void
  getParameter(name: string): string | null
  getParameters(): InsomniaRequestParameter[]
  setParameter(name: string, value: string): void
  hasParameter(name: string): boolean
  addParameter(name: string, value: string): void
  removeParameter(name: string): void
  setBodyText(text: string): void
  getBodyText(): string
  setCookie(name: string, value: string): void
  getEnvironmentVariable(name: string): any
  getEnvironment(): Object
  setAuthenticationParameter(string: any): void
  getAuthentication(): Object
  setCookie(name: string, value: string): void
  settingSendCookies(enabled: boolean): void
  settingStoreCookies(enabled: boolean): void
  settingEncodeUrl(enabled: boolean): void
  settingDisableRenderRequestBody(enabled: boolean): void
}

interface InsomniaContextStoreFunctions {
  hasItem(key: string): Promise<boolean>
  setItem(key: string, value: string): Promise<void>
  getItem(key: string): Promise<string | null>
  removeItem(key: string): Promise<void>
  clear(): Promise<void>
  all(): Promise<Array<{ key: string; value: string }>>
}

interface InsomniaPromptOptions {
  label?: string
  defaultValue?: string
  submitName?: string
  cancelable?: boolean
}

export interface InsomniaAppContext {
  alert(title: string, message?: string): Promise<void>
  prompt(title: string, options?: InsomniaPromptOptions): Promise<string>
  getPath(name: 'desktop'): string
  getInfo: () => InsomniaAppInfo
  showSaveDialog(options?: { defaultPath?: string }): Promise<string | null>
  dialog: (title: string, body: HTMLElement, options?: InsomniaDialogOptions) => Promise<string | null>
}

interface InsomniaContextDataImport {
  uri(uri: string, options?: { workspaceId?: string }): Promise<void>
  raw(text: string, options?: { workspaceId?: string }): Promise<void>
}

interface InsomniaContextDataExport {
  insomnia(options: {
    includePrivate?: boolean
    format?: 'json' | 'yaml'
  }): Promise<string>
  har(options: { includePrivate?: boolean }): Promise<string>
}

// interface InsomniaContextNetworkFunctions {
//   sendRequest(request: InsomniaRequest): Promise<Response>
// }

interface InsomniaContextData {
  import: InsomniaContextDataImport
  export: InsomniaContextDataExport
}

export interface InsomniaContext {
  store: InsomniaContextStoreFunctions
  app: InsomniaAppContext
  data: InsomniaContextData
  network: object
}

export interface InsomniaContextDataExportResult {
  resources: InsomniaBaseModel[]
  __export_date: Date
  __export_format: number
  __export_source: string
  _type: string
}