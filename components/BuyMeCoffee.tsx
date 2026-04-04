'use client'

export function BuyMeCoffee() {
  function openWidget() {
    // BMAC widget exposes a global function when loaded
    const w = window as any
    if (w.BMCWidget) {
      w.BMCWidget.openWidget()
    } else {
      // fallback if widget hasn't loaded yet
      window.open('https://buymeacoffee.com/fiji', '_blank')
    }
  }

  return (
    <div className="text-center mt-6 pb-2">
      <p className="text-xs text-gray-400 dark:text-[#7c6d9a] mb-3">
        If this saved you a naming argument...
      </p>
      <button
        onClick={openWidget}
        className="inline-block hover:scale-105 active:scale-95 transition-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          style={{ height: '40px', width: '145px' }}
        />
      </button>
    </div>
  )
}
