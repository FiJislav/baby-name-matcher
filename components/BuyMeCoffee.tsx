export function BuyMeCoffee() {
  return (
    <div className="text-center mt-6 pb-2">
      <p className="text-xs text-gray-400 dark:text-[#7c6d9a] mb-3">
        If this saved you a naming argument...
      </p>
      <a
        href="https://buy.stripe.com/bJe14m1I1azTexSdKG2VG00"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-white font-bold text-sm px-4 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all"
        style={{
          background: 'linear-gradient(135deg, #f5a623, #e07b00)',
          boxShadow: '0 2px 10px rgba(224,123,0,0.4)',
        }}
      >
        <span style={{ fontSize: '20px', lineHeight: 1 }}>🍺</span>
        Buy me a Biertje
      </a>
    </div>
  )
}
