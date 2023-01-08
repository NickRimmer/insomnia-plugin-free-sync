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
