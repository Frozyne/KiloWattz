"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

export function ArrowScroll({ children, step = 240 }: { children: ReactNode; step?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = () => {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 0)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    el.addEventListener("scroll", update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => {
      el.removeEventListener("scroll", update)
      ro.disconnect()
    }
  }, [])

  const scrollBy = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * step, behavior: "smooth" })

  const btn =
    "flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow disabled:opacity-30"

  return (
    <div className="relative">
      {(canLeft || canRight) && (
        <div className="mb-2 flex justify-end gap-2">
          <button type="button" aria-label="Scroll left" className={btn} disabled={!canLeft} onClick={() => scrollBy(-1)}>
            ←
          </button>
          <button type="button" aria-label="Scroll right" className={btn} disabled={!canRight} onClick={() => scrollBy(1)}>
            →
          </button>
        </div>
      )}
      <div ref={ref} className="overflow-x-auto">
        {children}
      </div>
    </div>
  )
}