"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiLogOut, FiUser, FiBell } from 'react-icons/fi'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface HeaderProps {
  user?: {
    name: string
    role: string
  }
  onLogout?: () => void
}

export default function Header({ user, onLogout }: HeaderProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [notifications, setNotifications] = useState(0)

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="図書館システム"
                width={150}
                height={40}
                className="cursor-pointer"
                onClick={() => router.push('/dashboard')}
              />
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiBell
                  className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => router.push('/notifications')}
                />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-2">
                    {notifications}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <FiUser className="h-5 w-5 text-gray-500" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FiLogOut className="mr-2" />
                  ログアウト
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}