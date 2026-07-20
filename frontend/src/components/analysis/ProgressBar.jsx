/**
 * Slim progress bar that eases toward the current stage boundary.
 * `value` is 0–1; the width transition does the smoothing.
 */
function ProgressBar({ value }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-[#ff7a9c] transition-[width] duration-1000 ease-out"
        style={{ width: `${value * 100}%` }}
      />
    </div>
  )
}

export default ProgressBar
