import { InsomniaContext } from '../types/context.types'
import ReactDOM from 'react-dom'
import { ReactElement } from 'react'

export type showDialogComponentProps = {
  title: string,
  context: InsomniaContext,
  children: ReactElement<any, any>
}

export const showDialogComponent = ({context, title, children}: showDialogComponentProps): void => {
  const root: HTMLElement = document.createElement('div')
  ReactDOM.render(
    children,
    root,
  )

  context.app.dialog(title, root, {
    skinny: true,
    onHide() {
      ReactDOM.unmountComponentAtNode(root)
    },
  })
}

export const showDialogSelectDirectoryAsync = async (title: string): Promise<string | null> => {
  const {canceled, filePaths} = await (window as any).dialog.showOpenDialog({
    title,
    buttonLabel: 'Select directory',
    properties: ['openDirectory'],
  })

  if (canceled || !filePaths) return null

  return filePaths[0]
}

export const showDialogSelectFileAsync = async (ext: string): Promise<string | null> => {
  const {canceled, filePath} = await (window as any).dialog.showSaveDialog()

  if (canceled || !filePath) return null

  if (filePath.endsWith(`.${ext}`)) return filePath
  return `${filePath}.${ext}`
}