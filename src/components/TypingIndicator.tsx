import { motion } from 'framer-motion'

export default function TypingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm text-slate-300">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="h-2 w-2 rounded-full bg-slate-400"
              animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.15,
              }}
            />
          ))}
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Escribiendo
        </span>
      </div>
    </div>
  )
}
