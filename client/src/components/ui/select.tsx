import { Select as SelectPrimitive } from '@base-ui/react/select'
// import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { AngleDown, Check } from 'flowbite-react-icons/outline'

import { cn } from '@/lib/utils'

interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (value: string) => void
  className?: string
  invalid?: boolean
}

export function Select({
  options,
  value,
  defaultValue,
  placeholder = 'Select an option',
  disabled,
  onChange,
  className,
  invalid,
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      items={options}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      onValueChange={(newValue) => {
        if (newValue !== null) {
          onChange?.(newValue)
        }
      }}
    >
      <SelectPrimitive.Trigger
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex w-full items-center justify-between gap-1.5',
          'border-input rounded-lg border bg-transparent',
          'py-2 pr-2 pl-2.5 text-sm whitespace-nowrap',
          'transition-colors outline-none select-none',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-placeholder:text-muted-foreground',
          'aria-invalid:border-red-500 aria-invalid:focus-visible:border-red-500 aria-invalid:focus-visible:ring-red-500/30',

          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} className="flex flex-1 text-left" />

        <SelectPrimitive.Icon render={<AngleDown className="text-muted-foreground size-4" />} />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner side="bottom" sideOffset={4} align="start" className="z-50">
          <SelectPrimitive.Popup
            className={cn(
              // 'relative z-50',
              'max-h-(--available-height)',
              'w-(--anchor-width) min-w-36',
              'overflow-x-hidden overflow-y-auto',
              'bg-popover text-popover-foreground rounded-lg',
              'ring-foreground/10 shadow-md ring-1',
              'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
              'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            )}
          >
            <SelectPrimitive.List className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex w-full cursor-default items-center',
                    'rounded-md py-1 pr-8 pl-1.5',
                    'text-sm outline-none select-none',
                    'data-highlighted:bg-gray-50',
                    'data-selected:bg-gray-100 data-selected:text-gray-500',
                    'data-disabled:pointer-events-none data-disabled:opacity-50',
                  )}
                >
                  <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
                    {option.label}
                  </SelectPrimitive.ItemText>

                  <SelectPrimitive.ItemIndicator
                    render={
                      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
                    }
                  >
                    <Check className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
