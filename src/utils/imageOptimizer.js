/**
 * Optimize and compress an uploaded image file on the client side.
 * Converts heavy mobile photos (5MB - 20MB) down to a lightweight,
 * high-resolution avatar data URL (20KB - 40KB).
 * This prevents localStorage QuotaExceededError and ensures instant loading on mobile.
 */
export const optimizeAvatarImage = (file, maxWidth = 360, maxHeight = 360, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file selected'))
    }

    // If already tiny or SVG, load as data URL directly
    if (file.type === 'image/svg+xml' || (file.size && file.size < 25000)) {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (readerEvent) => {
      const img = new Image()
      img.onload = () => {
        try {
          let { width, height } = img

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height)
              height = maxHeight
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = Math.max(width, 1)
          canvas.height = Math.max(height, 1)
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            resolve(readerEvent.target.result)
            return
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)

          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          resolve(dataUrl)
        } catch {
          resolve(readerEvent.target.result)
        }
      }

      img.onerror = () => {
        resolve(readerEvent.target.result)
      }

      img.src = readerEvent.target.result
    }

    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}
