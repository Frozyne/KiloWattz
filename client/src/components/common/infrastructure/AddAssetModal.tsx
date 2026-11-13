import React, { useState } from 'react'
import { X, Loader2, Cpu, Wrench } from 'lucide-react'
import { useAddAssetMutation } from '@/hooks/useInfrastructureQueries'

interface AddAssetModalProps {
  onClose: () => void
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({ onClose }) => {
  const addAssetMutation = useAddAssetMutation()
  const [modelNumber, setModelNumber] = useState('')

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!modelNumber.trim()) return

    await addAssetMutation.mutateAsync({
      modelNumber: modelNumber.trim(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-secondary border border-emerald-800/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 text-accent">
        
        <div className="flex items-center justify-between border-b border-emerald-800/50 pb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Cpu className="size-5 text-emerald-400" /> Register Hardware Asset
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 text-emerald-400 hover:bg-emerald-900/40 rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-emerald-200">
              Model Number / SKU
            </label>
            <div className="relative">
              <Wrench className="size-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                required
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="e.g. BAT-LFP-X, ARR-X-BLK"
                className="w-full h-10 pl-9 pr-3 text-sm bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-100 focus:border-emerald-400 outline-none transition-colors font-mono"
              />
            </div>
            <p className="text-[11px] text-emerald-300/70">
              The system will automatically recognize the device specification, assign a unique serial number, and initialize default diagnostic telemetry.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-900/40 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addAssetMutation.isPending || !modelNumber.trim()}
              className="px-4 py-2 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 shadow-sm"
            >
              {addAssetMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Register Asset'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}