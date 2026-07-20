import { ArrowRightIcon } from '../icons'

/** Closing call-to-action banner (UI only). */
function ExploreCTA({ seasonTitle, onExplore }) {
  return (
    <section
      aria-label="Explore on Myntra"
      className="overflow-hidden rounded-md bg-gradient-to-r from-primary to-[#ff8f3f] px-7 py-9 text-white shadow-md sm:px-10"
    >
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Shop your {seasonTitle} palette
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/85">
            Thousands of styles on Myntra match your colors — filter by your
            palette and build a wardrobe that makes you glow.
          </p>
        </div>
        <button
          type="button"
          onClick={onExplore}
          className="flex shrink-0 items-center gap-2.5 rounded-sm bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
        >
          Explore on Myntra
          <ArrowRightIcon className="h-4.5 w-4.5" />
        </button>
      </div>
    </section>
  )
}

export default ExploreCTA
