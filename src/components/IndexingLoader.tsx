import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

type IndexingLoaderProps = {
  progress?: number
}

export default function IndexingLoader({ progress }: IndexingLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-electric-400/30 bg-electric-400/10 px-4 py-4 text-sm text-slate-100"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-electric-300">
        Escaneando PDF
        {typeof progress === 'number' && <span>{progress}%</span>}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-electric-400/40 bg-electric-400/10">
          <Loader2 className="h-5 w-5 animate-spin text-electric-300" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            Analizando conocimientos del documento...
          </span>
          <span className="text-xs text-slate-300">
            Esto puede tardar unos segundos.
          </span>
        </div>
      </div>
      {typeof progress === 'number' && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-electric-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}
