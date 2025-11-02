"use client"

export function AnimatedLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="loader-thunder w-24 h-24 text-accent"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
          </svg>
        </div>

        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <svg
            className="electric-left w-8 h-8 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L5 12L10 12L8 22L18 12L13 12L15 2Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <svg
            className="electric-right w-8 h-8 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L5 12L10 12L8 22L18 12L13 12L15 2Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">Loading</p>
        <div className="flex justify-center gap-1 mt-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  )
}
