import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { PLACEHOLDER_IMAGE } from '../data/initialArtworks'
import { ARTWORK_TYPES } from '../types/artwork'
import type { Artwork } from '../types/artwork'
import { artworkSchema, type ArtworkFormValues } from '@/schemas/addArtwork.schema'

interface ArtworkFormProps {
  onSubmit: (artwork: Omit<Artwork, 'id'>) => void
  onCancel: () => void
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`flex flex-col gap-1 text-sm font-medium`}>
        {label}
        {children}
      </label>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export function ArtworkForm({ onSubmit, onCancel }: ArtworkFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: '',
      artist: '',
      type: '',
      price: '',
      isAvailable: true,
    },
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  const submit = (data: ArtworkFormValues) => {
    onSubmit({
      ...data,
      type: data.type as Artwork['type'],
      price: Number(data.price),
      imageUrl: PLACEHOLDER_IMAGE,
    })
  }

  return (
    <div className="fixed inset-0 z-20 bg-black/50" onClick={onCancel}>
      <form
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-form-title"
        onSubmit={handleSubmit(submit)}
        onClick={(e) => e.stopPropagation()}
        className="ml-auto flex h-full w-full max-w-md flex-col gap-4 overflow-y-auto bg-white p-6 shadow-xl"
      >
        <h2 id="artwork-form-title" className="text-xl font-bold">
          Add New Artwork
        </h2>
        <div className="flex flex-col gap-1">
          <img
            src={PLACEHOLDER_IMAGE}
            alt="Default artwork preview"
            className="aspect-4/3 w-full rounded-lg object-cover"
          />
          <p className="text-xs text-gray-400">A default image will be used for this artwork</p>
        </div>

        <Field label="Title" error={errors.title?.message}>
          <Input
            {...register('title')}
            aria-invalid={!!errors.title}
            placeholder="Artwork title"
            autoFocus
          />
        </Field>

        <Field label="Artist" error={errors.artist?.message}>
          <Input {...register('artist')} aria-invalid={!!errors.artist} placeholder="Artist name" />
        </Field>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Type</span>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                placeholder="Select type"
                invalid={!!errors.type}
                options={ARTWORK_TYPES.map((t) => ({ label: t, value: t }))}
              />
            )}
          />
          {errors.type && (
            <p role="alert" className="text-xs text-red-600">
              {errors.type.message}
            </p>
          )}
        </div>

        <Field label="Price ($)" error={errors.price?.message}>
          <Input
            {...register('price')}
            aria-invalid={!!errors.price}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('isAvailable')} className="size-4 accent-black" />
          Available for sale (uncheck for exhibition only)
        </label>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button">
            Cancel
          </Button>
          <Button type="submit">Add artwork</Button>
        </div>
      </form>
    </div>
  )
}
