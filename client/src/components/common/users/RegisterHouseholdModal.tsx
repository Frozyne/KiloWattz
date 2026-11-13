import React, { useState } from 'react'
import { X, Loader2, MapPin, Hash, Zap, Activity } from 'lucide-react'
import { useCreateHouseholdMutation } from '@/hooks/useHouseholdQueries'

interface RegisterHouseholdModalProps {
  targetUserId: string
  onClose: () => void
}

export const RegisterHouseholdModal: React.FC<RegisterHouseholdModalProps> = ({ targetUserId, onClose }) => {
  const createHouseholdMutation = useCreateHouseholdMutation()
  
  const [formData, setFormData] = useState({
    plotNumber: '',
    street: '',
    phaseConnection: 'Phase 1',
    meterSerialNumber: '',
  })

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!formData.plotNumber || !formData.street) return

    await createHouseholdMutation.mutateAsync({
      plotNumber: formData.plotNumber,
      street: formData.street,
      phaseConnection: formData.phaseConnection as "Phase 1" | "Phase 2" | "Phase 3",
      meterSerialNumber: formData.meterSerialNumber,
      userID: targetUserId, // Bind the new household to this specific user
    })
    
    onClose()
  }

  const isSubmitting = createHouseholdMutation.isPending

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-secondary border border-emerald-800/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-emerald-800/50 pb-4">
          <h2 className="text-lg font-bold text-accent">Register New Property</h2>
          <button onClick={onClose} className="p-1 text-emerald-400 hover:bg-emerald-900/40 rounded-lg transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Plot Number */}
            <div className="space-y-1.5">
              <label htmlFor='plot' className="text-xs font-medium text-emerald-200">Plot Number</label>
              <div className="relative">
                <Hash className="size-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  name='plot'
                  required
                  type="text"
                  value={formData.plotNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, plotNumber: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 text-sm bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-100 focus:border-emerald-400 outline-none transition-colors"
                  placeholder="e.g. 42B"
                />
              </div>
            </div>

            {/* Meter number */}
            <div className="space-y-1.5">
              <label htmlFor='meter' className="text-xs font-medium text-emerald-200">Meter Serial Number</label>
              <div className="relative">
                <Activity className="size-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  name='meter'
                  required
                  type="text"
                  value={formData.meterSerialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, meterSerialNumber: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 text-sm bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-100 focus:border-emerald-400 outline-none transition-colors"
                  placeholder='e.g. MTR-00000000'
                />
              </div>
            </div>
          </div>

          {/* Street Name */}
          <div className="space-y-1.5">
            <label htmlFor='street' className="text-xs font-medium text-emerald-200">Street Name</label>
            <div className="relative">
              <MapPin className="size-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name='street'
                required
                type="text"
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                className="w-full h-10 pl-9 pr-3 text-sm bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-100 focus:border-emerald-400 outline-none transition-colors"
                placeholder="e.g. Palm Grove Avenue"
              />
            </div>
          </div>

          {/* Phase Connection Port */}
          <div className="space-y-1.5">
            <label htmlFor='phase' className="text-xs font-medium text-emerald-200">Grid Phase Port</label>
            <div className="relative">
              <Zap className="size-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                name='phase'
                value={formData.phaseConnection}
                onChange={(e) => setFormData(prev => ({ ...prev, phaseConnection: e.target.value }))}
                className="w-full h-10 pl-9 pr-3 text-sm bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-100 focus:border-emerald-400 outline-none appearance-none transition-colors"
              >
                <option value="Phase 1">Phase 1</option>
                <option value="Phase 2">Phase 2</option>
                <option value="Phase 3">Phase 3</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-900/40 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.plotNumber || !formData.street}
              className="px-4 py-2 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? <Loader2 className="size-3 animate-spin" /> : 'Register Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}