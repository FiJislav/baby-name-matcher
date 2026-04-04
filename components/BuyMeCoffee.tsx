export function BuyMeCoffee() {
  return (
    <div className="text-center mt-6 pb-2">
      <p className="text-xs text-gray-400 dark:text-[#7c6d9a] mb-3">
        If this saved you a naming argument...
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <a
          href="https://buymeacoffee.com/fiji"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:scale-105 active:scale-95 transition-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style={{ height: '40px', width: '145px' }}
          />
        </a>

        <a
          href="https://buy.stripe.com/bJe14m1I1azTexSdKG2VG00"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#e8f0fb] hover:bg-[#d4e4f9] text-[#1a56db] font-bold px-4 py-2.5 rounded-xl text-sm hover:scale-105 active:scale-95 transition-all shadow-sm"
          style={{ height: '40px' }}
        >
          🏦 iDEAL / Card
        </a>
      </div>
    </div>
  )
}
