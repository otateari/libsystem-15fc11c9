"use client"

import { useState } from 'react'
import { FiMail, FiLock } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase'

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void
  error?: string
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError('')

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        onSubmit({ email, password })
        router.push('/dashboard')
      }
    } catch (err: any) {
      setFormError('ログインに失敗しました。メールアドレスまたはパスワードを確認してください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-[#2C4F7C] mb-8">
        図書館管理システム
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C4F7C] focus:border-transparent"
              placeholder="example@library.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            パスワード
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C4F7C] focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {(error || formError) && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error || formError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[#2C4F7C] hover:bg-[#1a3c64] text-white font-medium rounded-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          システムに関する問題は管理者にお問い合わせください
        </p>
      </div>
    </div>
  )
}

export default LoginForm