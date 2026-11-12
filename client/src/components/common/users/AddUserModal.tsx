import React, { useState } from 'react'
import { X, Loader2, Mail, User, Shield } from 'lucide-react'
import { useCreateUserMutation } from '@/hooks/useUserQureies'

interface AddUserModalProps {
  onClose: () => void
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'User',
    password: ''
  })
  const { mutateAsync: create } = useCreateUserMutation()

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await create({
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role as "User" | "Admin" | null,
        password: formData.password
    })
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-secondary border border-emerald-800/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-emerald-800/50 pb-4">
          <h2 className="text-xl font-bold text-accent">Register New User</h2>
          <button onClick={onClose} className="p-1.5 text-emerald-400 hover:bg-emerald-900/40 rounded-lg transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor='name' className="text-xs font-medium text-emerald-200">Full Name</label>
            <div className="relative">
              <User className="size-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name='name'
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full h-10 pl-9 pr-3 text-sm bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-100 focus:border-emerald-400 outline-none transition-colors"
                placeholder="e.g. Komolafe Praise"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor='email' className="text-xs font-medium text-emerald-200">Email Address</label>
            <div className="relative">
              <Mail className="size-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name='email'
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full h-10 pl-9 pr-3 text-sm bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-100 focus:border-emerald-400 outline-none transition-colors"
                placeholder="user@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor='password' className="text-xs font-medium text-emerald-200">Password</label>
            <div className="relative">
              <Mail className="size-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name='password'
                required
                type="email"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full h-10 pl-9 pr-3 text-sm bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-100 focus:border-emerald-400 outline-none transition-colors"
                placeholder="Password123#"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor='role' className="text-xs font-medium text-emerald-200">System Role</label>
            <div className="relative">
              <Shield className="size-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                name='role'
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full h-10 pl-9 pr-3 text-sm bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-100 focus:border-emerald-400 outline-none appearance-none transition-colors"
              >
                <option value="User">Resident</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
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
              disabled={isSubmitting}
              className="px-4 py-2 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}