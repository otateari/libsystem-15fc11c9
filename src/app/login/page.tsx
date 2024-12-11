"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IoLibrary } from "react-icons/io5"
import { supabase } from "@/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        router.push("/menu")
      }
    } catch (error: any) {
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。")
    }
  }

  return (
    <div className="min-h-screen h-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <IoLibrary className="mx-auto h-12 w-12 text-[#2C4F7C]" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            図書館管理システム
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            システムにアクセスするにはログインしてください
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#2C4F7C] focus:border-[#2C4F7C] focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#2C4F7C] focus:border-[#2C4F7C] focus:z-10 sm:text-sm"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2C4F7C] hover:bg-[#1a3456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C4F7C]"
            >
              ログイン
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}