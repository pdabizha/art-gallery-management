import * as React from 'react'
import { Input as InputPrimitive } from '@base-ui/react/input'
import { cn } from 'cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none',
        'focus-visible:border-neutral-400 focus-visible:ring-3 focus-visible:ring-neutral-400/50',
        'aria-invalid:border-red-500 aria-invalid:focus-visible:border-red-500 aria-invalid:focus-visible:ring-red-500/30',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
