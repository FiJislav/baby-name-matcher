export function BuyMeCoffee() {
  return (
    <div className="text-center mt-6 pb-2">
      <p className="text-xs text-gray-400 dark:text-[#7c6d9a] mb-3">
        If this saved you a naming argument...
      </p>
      <a
        href="https://www.buymeacoffee.com/fiji"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:scale-105 active:scale-95 transition-transform"
      >
        {/* Official BMAC image button — universally recognised */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          style={{ height: '40px', width: '145px' }}
        />
      </a>
    </div>
  )
}
