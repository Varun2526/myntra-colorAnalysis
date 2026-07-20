import { useEffect, useRef, useCallback } from 'react'

/**
 * Draws the uploaded selfie onto a canvas, then overlays
 * a garment-shaped drape in the selected color below the chin —
 * inspired by KoreAI's draping feature.
 *
 * No webcam. No MediaPipe. Pure Canvas 2D.
 */
function PreviewCanvas({ previewUrl, selectedColor, facePosition }) {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const animationRef = useRef(null)

  /**
   * Drape rectangle in canvas pixels. Anchored to the detected chin and
   * scaled by face width (both normalized 0-1, resolution-independent).
   * Falls back to the previous fixed layout when no face data is present.
   */
  const drapeRect = useCallback(
    (cw, ch) => {
      if (facePosition) {
        // Start just below the chin; ~3x face width like koreai's draping.
        const drapeW = Math.min(cw, Math.max(cw * 0.4, facePosition.faceWidth * cw * 3))
        const drapeY = Math.min(ch - 8, (facePosition.chinY + 0.04) * ch)
        return {
          x: (cw - drapeW) / 2,
          y: drapeY,
          w: drapeW,
          h: ch - drapeY,
        }
      }
      const drapeW = cw * 0.6
      const drapeY = ch * 0.68
      return { x: (cw - drapeW) / 2, y: drapeY, w: drapeW, h: ch - drapeY }
    },
    [facePosition]
  )

  /**
   * Draw a garment-shaped path: rounded top corners with a shallow
   * neckline curve, straight sides, and a flat bottom flush with
   * the canvas edge — resembles a scarf or crew-neck shirt.
   */
  const garmentPath = useCallback((ctx, x, y, w, h, r) => {
    const cx = x + w / 2
    // Neckline dip depth (how far below `y` the curve scoops)
    const neckDip = Math.min(h * 0.10, 28)

    ctx.beginPath()
    // Start at top-left corner, after the radius
    ctx.moveTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)

    // Top edge → neckline curve (shallow U dipping below the top)
    ctx.lineTo(cx - w * 0.18, y)
    ctx.quadraticCurveTo(cx, y + neckDip, cx + w * 0.18, y)

    // Continue to top-right corner
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)

    // Right side straight down to bottom (no radius — flush)
    ctx.lineTo(x + w, y + h)

    // Bottom edge straight across (flush with canvas bottom)
    ctx.lineTo(x, y + h)

    // Left side straight up to starting radius
    ctx.lineTo(x, y + r)

    ctx.closePath()
  }, [])

  /** Render the base image + color drape overlay at a given opacity. */
  const render = useCallback(
    (opacity) => {
      const canvas = canvasRef.current
      const img = imageRef.current
      if (!canvas || !img) return

      const ctx = canvas.getContext('2d')
      const cw = canvas.width
      const ch = canvas.height

      // Clear & draw base image (contain fit — no crop, no dark margins)
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, 0, 0, cw, ch)

      // Draw the color drape if a color is selected
      if (selectedColor && opacity > 0) {
        // Anchored to the detected chin and scaled by face width, extending
        // to the very bottom of the canvas.
        const { x: drapeX, y: drapeY, w: drapeW, h: drapeH } = drapeRect(cw, ch)
        const topRadius = 22

        ctx.save()

        // --- Main garment fill at ~75% opacity ---
        ctx.globalAlpha = opacity * 1.0
        garmentPath(ctx, drapeX, drapeY, drapeW, drapeH, topRadius)
        ctx.fillStyle = selectedColor.hex
        ctx.fill()

        // --- Vertical gradient: subtle darkening at top, lighter at bottom ---
        // Gives the fabric a sense of depth / drape fold
        const grad = ctx.createLinearGradient(drapeX, drapeY, drapeX, drapeY + drapeH)
        grad.addColorStop(0, 'rgba(0,0,0,0.18)')
        grad.addColorStop(0.35, 'rgba(0,0,0,0)')
        grad.addColorStop(1, 'rgba(255,255,255,0.08)')
        ctx.globalAlpha = opacity
        garmentPath(ctx, drapeX, drapeY, drapeW, drapeH, topRadius)
        ctx.fillStyle = grad
        ctx.fill()

        ctx.restore()
      }
    },
    [selectedColor, garmentPath, drapeRect]
  )

  /** Load the image once and size the canvas to match. */
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageRef.current = img
      const canvas = canvasRef.current
      if (!canvas) return

      // Use image's natural dimensions, capped for performance
      const maxDim = 800
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight))
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      render(selectedColor ? 1 : 0)
    }
    img.src = previewUrl
  }, [previewUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Animate the drape fading in when color changes. */
  useEffect(() => {
    if (!imageRef.current) return
    if (animationRef.current) cancelAnimationFrame(animationRef.current)

    if (!selectedColor) {
      render(0)
      return
    }

    const duration = 400
    const start = performance.now()

    function step(now) {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      render(eased)
      if (t < 1) {
        animationRef.current = requestAnimationFrame(step)
      }
    }
    animationRef.current = requestAnimationFrame(step)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [selectedColor, render])

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto block max-h-[600px] max-w-full rounded-xl shadow-lg"
    />
  )
}

export default PreviewCanvas
