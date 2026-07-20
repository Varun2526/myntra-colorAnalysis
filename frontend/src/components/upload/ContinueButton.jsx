/** Primary call-to-action once an image is selected. */
function ContinueButton({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-sm bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
    >
      Continue
    </button>
  )
}

export default ContinueButton
