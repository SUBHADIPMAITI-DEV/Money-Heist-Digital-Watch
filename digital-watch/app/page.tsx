import { DigitalWatch } from "@/components/digital-watch"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-4">
      {/* Money Heist background */}
      <div className="absolute inset-0 z-0">
        {/* Stylized Money Heist background */}
        <div className="absolute inset-0 bg-black">
          {/* Red mask silhouettes */}
          <div className="absolute left-1/4 top-1/4 h-32 w-24 -rotate-12 rounded-t-xl bg-red-600 opacity-10"></div>
          <div className="absolute right-1/3 bottom-1/4 h-32 w-24 rotate-12 rounded-t-xl bg-red-600 opacity-10"></div>
          <div className="absolute right-1/4 top-1/3 h-32 w-24 rotate-6 rounded-t-xl bg-red-600 opacity-10"></div>

          {/* Euro symbols */}
          <div className="absolute left-1/5 bottom-1/4 text-6xl font-bold text-red-600 opacity-5">€</div>
          <div className="absolute right-1/5 top-1/3 text-8xl font-bold text-red-600 opacity-5">€</div>

          {/* Red diagonal stripes */}
          <div className="absolute -left-20 top-0 h-full w-40 rotate-12 bg-red-600 opacity-5"></div>
          <div className="absolute -right-20 bottom-0 h-full w-40 -rotate-12 bg-red-600 opacity-5"></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
      </div>

      {/* Money Heist themed watch */}
      <div className="relative z-10 w-full max-w-md">
        <DigitalWatch />
      </div>

      {/* Success message about audio file */}
      <div className="mt-8 max-w-md rounded-md bg-black/80 p-4 text-center text-sm text-gray-400">
        <p className="mb-2 font-bold text-green-500">Audio Added Successfully!</p>
        <p className="mb-2">
          The "Bella Ciao" song has been added to your alarm. Use the "Test" button to check if your browser allows
          audio playback.
        </p>
        <p>
          <strong>Tip:</strong> If you don't hear sound when testing, click anywhere on the page first to enable audio
          playback.
        </p>
      </div>
    </main>
  )
}
