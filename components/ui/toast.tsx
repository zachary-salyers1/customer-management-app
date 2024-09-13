import React from 'react'

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type ToastActionElement = React.ReactElement<{
  altText: string;
}>

export const Toast: React.FC<ToastProps> = ({ title, description, action }) => {
  return (
    <div className="toast">
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}

export const ToastAction: React.FC<{ altText: string; children: React.ReactNode }> = ({ 
  altText, 
  children 
}) => {
  return (
    <button className="toast-action" aria-label={altText}>
      {children}
    </button>
  )
}