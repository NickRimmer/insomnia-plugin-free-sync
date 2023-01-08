import { InsomniaDialogOptions } from './dialog-options.types'

export type InsomniaContextApp = {
  showSaveDialog(options?: { defaultPath?: string }): Promise<string | null>
  dialog: (title: string, body: HTMLElement, options?: InsomniaDialogOptions) => Promise<string | null>
}
