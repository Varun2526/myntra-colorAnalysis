import { CheckIcon } from '../icons'

function StatusBadge({ status }) {
  if (status === 'done') {
    return (
      <span className="flex h-6 w-6 animate-pop items-center justify-center rounded-full bg-primary text-white">
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
      </span>
    )
  }
  return <span className="h-6 w-6 rounded-full border-2 border-gray-200" />
}

/** One analysis stage row: pending circle → spinner → popped-in check. */
function StageItem({ label, status, index }) {
  return (
    <li
      className="flex animate-rise items-center gap-4"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <StatusBadge status={status} />
      <span
        className={`text-[15px] transition-colors duration-300 ${
          status === 'pending'
            ? 'text-ink-light/60'
            : status === 'active'
              ? 'font-bold text-ink'
              : 'text-ink'
        }`}
      >
        {label}
      </span>
    </li>
  )
}

export default StageItem
