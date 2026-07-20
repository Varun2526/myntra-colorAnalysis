import { useCallback, useEffect, useRef, useState } from 'react'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

/**
 * Owns the selected-image state for the upload screen.
 * The `file` it exposes is what will later be sent to the backend.
 */
function useImageUpload() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const previewUrlRef = useRef(null)

  const releasePreviewUrl = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
  }, [])

  // Revoke the object URL on unmount.
  useEffect(() => releasePreviewUrl, [releasePreviewUrl])

  const selectFile = useCallback(
    (candidate) => {
      if (!candidate) return
      if (!ACCEPTED_TYPES.includes(candidate.type)) {
        setError('Only JPEG and PNG images are supported.')
        return
      }
      releasePreviewUrl()
      previewUrlRef.current = URL.createObjectURL(candidate)
      setError(null)
      setFile(candidate)
      setPreviewUrl(previewUrlRef.current)
    },
    [releasePreviewUrl]
  )

  const removeImage = useCallback(() => {
    releasePreviewUrl()
    setFile(null)
    setPreviewUrl(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [releasePreviewUrl])

  const openFileDialog = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const onInputChange = useCallback(
    (event) => selectFile(event.target.files?.[0]),
    [selectFile]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((event) => {
    event.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      setIsDragging(false)
      selectFile(event.dataTransfer.files?.[0])
    },
    [selectFile]
  )

  return {
    file,
    previewUrl,
    error,
    isDragging,
    inputRef,
    openFileDialog,
    onInputChange,
    onDragOver,
    onDragLeave,
    onDrop,
    removeImage,
  }
}

export default useImageUpload
