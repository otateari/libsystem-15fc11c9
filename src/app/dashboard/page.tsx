"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/supabase'
import { FaBook, FaUserFriends, FaHistory, FaExclamationTriangle, FaChartBar } from 'react-icons/fa'
import { RiBookletLine } from 'react-icons/ri'
import { IoNotifications } from 'react-icons/io5'

export default function Dashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [notifications, setNotifications] = useState([
    { id: 1, title: '返却期限のお知らせ', content: '3件の返却期限が近づいています', date: '2024-01-20' },
    { id: 2, title: 'システムメンテナンス', content: '明日AM2:00-5:00にメンテナンスを実施します', date: '2024-01-19' }
  ])

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('name, role')
            .eq('id', user.id)
            .single()

          if (data) {
            setUserName(data.name)
            setUserRole(data.role)
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
        setUserName('テストユーザー')
        setUserRole('図書館職員')
      }
    }

    getUserInfo()
  }, [])

  const menuItems = [
    { title: '書籍貸出', icon: <FaBook size={24} />, link: '/book-lending', color: 'bg-blue-500' },
    { title: '書籍返却', icon: <RiBookletLine size={24} />, link: '/book-return', color: 'bg-green-500' },
    { title: '書籍管理', icon: <FaBook size={24} />, link: '/book-management', color: 'bg-purple-500' },
    { title: '利用者管理', icon: <FaUserFriends size={24} />, link: '/user-management', color: 'bg-orange-500' },
    { title: '延滞管理', icon: <FaExclamationTriangle size={24} />, link: '/delay-management', color: 'bg-red-500' },
    { title: '貸出履歴', icon: <FaHistory size={24} />, link: '/lending-history', color: 'bg-indigo-500' }
  ]

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ようこそ、{userName}さん</h1>
              <p className="text-gray-600">{userRole}</p>
            </div>
            <div className="relative">
              <IoNotifications size={28} className="text-gray-600 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <Link href={item.link} key={index}>
              <div className={`${item.color} hover:opacity-90 transition-opacity duration-200 rounded-lg shadow-lg p-6 text-white cursor-pointer`}>
                <div className="flex items-center space-x-4">
                  {item.icon}
                  <span className="text-xl font-semibold">{item.title}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">お知らせ</h2>
            <button className="text-blue-500 hover:text-blue-600">すべて見る</button>
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                    <p className="text-gray-600">{notification.content}</p>
                  </div>
                  <span className="text-sm text-gray-500">{notification.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}