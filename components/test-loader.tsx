"use client"

export function TestLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/40 backdrop-blur-sm z-20">
      <div className="flex flex-col items-center gap-2">
        <svg
          className="loader-thunder w-8 h-8 text-accent"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
        </svg>
        <p className="text-xs font-medium text-foreground">Testing...</p>
      </div>
    </div>
  )
}
