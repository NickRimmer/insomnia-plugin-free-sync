import React from 'react'
import { FC } from 'react'
import './button.styles.scss'
import { ButtonProps } from './button.types'

export const Button: FC<ButtonProps> = ({children, icon, onClick}) => {
  return (
    <button className="plugin-free-sync btn btn--outlined btn--super-duper-compact" onClick={onClick}>
      {icon && (<i className={`btn-icon--left fa ${icon}`}/>)}
      <span>{children}</span>
    </button>
  )
}
