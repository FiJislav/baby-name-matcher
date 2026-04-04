export function BuyMeCoffee() {
  return (
    <div className="text-center mt-6 pb-2">
      <p className="text-xs text-gray-400 dark:text-[#7c6d9a] mb-3">
        If this saved you a naming argument...
      </p>
      <a
        href="https://ko-fi.com/I2I11X893Z"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:scale-105 active:scale-95 transition-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://storage.ko-fi.com/cdn/kofi2.png?v=3"
          alt="Support me on Ko-fi"
          style={{ height: '40px' }}
        />
      </a>
    </div>
  )
}
