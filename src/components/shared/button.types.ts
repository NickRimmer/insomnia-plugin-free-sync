import { MouseEventHandler, ReactNode } from 'react'

export type ButtonProps = {
  children: ReactNode
  icon?: string,
  onClick?: MouseEventHandler | undefined
}
