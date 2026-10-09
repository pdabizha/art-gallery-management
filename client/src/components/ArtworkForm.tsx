import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { artworkSchema, type ArtworkFormValues } from '@/schemas/addArtwork.schema'
import { useUploadArtworkImage } from '@/api/artwork.queries'
import { ARTWORK_TYPES, type Artwork } from '@/api/artwork.types'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

interface ArtworkFormProps {
  artwork?: Artwork
  onSubmit: (artwork: Omit<Artwork, 'id'>) => void
  onCancel: () => void
  isSubmitting?: boolean
  errorMessage?: string
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

export function ArtworkForm({
  artwork,
  onSubmit,
  onCancel,
  isSubmitting = false,
  errorMessage,
}: ArtworkFormProps) {
  const isEditing = Boolean(artwork)
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: artwork?.title ?? '',
      artist: artwork?.artist ?? '',
      type: artwork?.type ?? '',
      price: artwork ? String(Number(artwork.price)) : '',
      availability: artwork?.availability ?? true,
      imageUrl: artwork?.imageUrl ?? '',
    },
  })
  const uploadImage = useUploadArtworkImage()
  const isLoading = uploadImage.isPending || isSubmitting
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const imageUrl = watch('imageUrl')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // чтобы можно было выбрать тот же файл повторно
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError('Image must be smaller than 5 MB')
      return
    }

    setUploadError(null)
    uploadImage.mutate(file, {
      onSuccess: ({ imageUrl }) =>
        setValue('imageUrl', imageUrl, { shouldDirty: true, shouldValidate: true }),
      onError: () => setUploadError('Could not upload the image. Please try again.'),
    })
  }

  const handleRemoveImage = () => {
    setValue('imageUrl', '', { shouldDirty: true })
    setUploadError(null)
  }

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
          {isEditing ? 'Edit Artwork' : 'Add New Artwork'}
        </h2>
        <div className="flex flex-col gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {imageUrl ? (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Artwork preview"
                  className={`aspect-4/3 w-full rounded-lg object-cover ${
                    uploadImage.isPending ? 'opacity-50' : ''
                  }`}
                />
                {uploadImage.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    Uploading...
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  className="w-fit"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadImage.isPending}
                >
                  Change photo
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-fit"
                  onClick={handleRemoveImage}
                  disabled={uploadImage.isPending}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadImage.isPending}
              aria-invalid={!!errors.imageUrl || undefined}
              className="flex aspect-4/3 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 transition-colors outline-none hover:border-gray-500 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-red-500 aria-invalid:text-red-600"
            >
              <span className="text-base font-medium">
                {uploadImage.isPending ? 'Uploading...' : 'Upload photo'}
              </span>
              <span className="text-xs">Click to choose an image (up to 5 MB)</span>
            </button>
          )}

          {(uploadError || errors.imageUrl) && (
            <p role="alert" className="text-xs text-red-600">
              {uploadError ?? errors.imageUrl?.message}
            </p>
          )}
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
            inputMode="numeric"
            min="1"
            step="100"
            placeholder="100"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('availability')} className="size-4 accent-black" />
          Available for sale (uncheck for exhibition only)
        </label>

        {errorMessage && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isEditing
              ? isSubmitting
                ? 'Saving...'
                : 'Save changes'
              : isSubmitting
                ? 'Adding...'
                : 'Add artwork'}
          </Button>
        </div>
      </form>
    </div>
  )
}
