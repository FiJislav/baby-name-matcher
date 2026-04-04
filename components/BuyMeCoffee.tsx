export function BuyMeCoffee() {
  return (
    <div className="text-center mt-8 pb-6">
      <a
        href="https://buymeacoffee.com/fiji"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#FFDD00] hover:bg-[#ffcf00] text-[#1a1a1a] font-bold px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all text-sm"
      >
        <span className="text-lg">☕</span> Buy me a coffee
      </a>
      <p className="text-xs text-gray-400 dark:text-[#4a3870] mt-2">Made with ♥ by a bioscientist who codes</p>
    </div>
  )
}
