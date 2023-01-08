import React, { ReactNode } from "react";
import { FC } from "react";
import styles from './button.styles.less'

export interface ButtonProps {
  children: ReactNode
  icon?: string
}

export const Button: FC<ButtonProps> = ({ children, icon }) => {
  return (
    <button className="btn btn--outlined btn--super-duper-compact">
      {icon && (<i className={`fa ${icon}`} />)}
      <span>{children}</span>
    </button>
  )
}