import React, { FormHTMLAttributes } from 'react'

type FormProps = FormHTMLAttributes<HTMLFormElement>

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => (
    <form
      ref={ref}
      className={`flex flex-col w-full gap-2 appearance-none placeholder-gray focus:ring-primary sm:text-sm ${className || ''}`}
      {...props}
    >
      {children}
    </form>
  ),
)
Form.displayName = 'Form'
