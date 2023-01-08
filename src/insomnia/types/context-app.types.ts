import { InsomniaDialogOptions } from './dialog-options.types'

export type InsomniaContextApp = {
  alert(title: string, message?: string): Promise<void>
  showSaveDialog(options?: { defaultPath?: string }): Promise<string | null>
  dialog: (title: string, body: HTMLElement, options?: InsomniaDialogOptions) => Promise<string | null>
}
