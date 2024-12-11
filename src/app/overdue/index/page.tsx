"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaBook, FaBell, FaChartBar, FaExclamationTriangle, FaUserClock } from 'react-icons/fa'
import { supabase } from '@/supabase'

interface Loan {
  loan_id: string
  book_id: string
  user_id: string
  loan_date: string
  due_date: string
  return_date: string | null
}

interface OverdueNotification {
  notification_id: string
  loan_id: string
  sent_date: string
  notification_type: string
  status: string
}

export default function OverdueManagement() {
  const router = useRouter()
  const [overdueLoans, setOverdueLoans] = useState<Loan[]>([])
  const [notifications, setNotifications] = useState<OverdueNotification[]>([])

  useEffect(() => {
    const fetchOverdueData = async () => {
      try {
        const { data: loansData, error: loansError } = await supabase
          .from('loans')
          .select('*')
          .is('return_date', null)
          .lt('due_date', new Date().toISOString())

        if (loansError) throw loansError
        setOverdueLoans(loansData || [])

        const { data: notificationsData, error: notificationsError } = await supabase
          .from('overdue_notifications')
          .select('*')
          .order('sent_date', { ascending: false })
          .limit(5)

        if (notificationsError) throw notificationsError
        setNotifications(notificationsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchOverdueData()
  }, [])

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">延滞管理システム</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 統計情報カード */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FaChartBar className="text-2xl text-primary mr-3" />
              <h2 className="text-xl font-semibold">延滞統計</h2>
            </div>
            <div className="space-y-3">
              <p className="text-lg">現在の延滞件数: <span className="font-bold text-red-500">{overdueLoans.length}</span></p>
              <p className="text-lg">未送信通知: <span className="font-bold text-yellow-500">
                {notifications.filter(n => n.status === 'pending').length}
              </span></p>
            </div>
          </div>

          {/* クイックアクセスメニュー */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FaBook className="text-2xl text-primary mr-3" />
              <h2 className="text-xl font-semibold">クイックアクセス</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/overdue/search" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <FaExclamationTriangle className="mr-2 text-blue-600" />
                <span>延滞書籍検索</span>
              </Link>
              <Link href="/overdue/notifications" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <FaBell className="mr-2 text-blue-600" />
                <span>通知管理</span>
              </Link>
            </div>
          </div>

          {/* 最近の通知 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FaUserClock className="text-2xl text-primary mr-3" />
              <h2 className="text-xl font-semibold">最近の通知</h2>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.notification_id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {new Date(notification.sent_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    ステータス: <span className={`font-semibold ${
                      notification.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {notification.status === 'completed' ? '送信済み' : '未送信'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 延滞書籍一覧 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">延滞書籍一覧</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    貸出ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    貸出日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    返却期限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    延滞日数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueLoans.map((loan) => (
                  <tr key={loan.loan_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.loan_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(loan.loan_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(loan.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-semibold">
                      {Math.floor((new Date().getTime() - new Date(loan.due_date).getTime()) / (1000 * 60 * 60 * 24))}日
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}