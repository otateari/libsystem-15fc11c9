"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FiMail, FiCheck, FiAlertTriangle } from 'react-icons/fi'
import { supabase } from '@/supabase'

const NotificationConfirm = () => {
  const router = useRouter()
  const [overdueUsers, setOverdueUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const notificationTemplate = `
    図書館からの延滞通知

    お借りいただいた書籍の返却期限が過ぎております。
    速やかにご返却いただきますようお願いいたします。

    ※このメールは自動送信されています。
  `

  useEffect(() => {
    const fetchOverdueLoans = async () => {
      try {
        const { data: loans, error } = await supabase
          .from('loans')
          .select(`
            *,
            users (*),
            books (*)
          `)
          .lt('due_date', new Date().toISOString())
          .is('return_date', null)

        if (error) throw error
        setOverdueUsers(loans)
      } catch (error) {
        console.error('Error fetching overdue loans:', error)
        setOverdueUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchOverdueLoans()
  }, [])

  const handleSendNotifications = async () => {
    setSending(true)
    try {
      for (const loan of overdueUsers) {
        await supabase
          .from('overdue_notifications')
          .insert({
            loan_id: loan.loan_id,
            sent_date: new Date().toISOString(),
            notification_type: 'EMAIL',
            status: 'SENT'
          })
      }
      router.push('/overdue/notification/complete')
    } catch (error) {
      console.error('Error sending notifications:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="flex flex-col max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">延滞通知確認</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">通知内容プレビュー</h2>
          <div className="bg-gray-50 p-4 rounded border">
            <pre className="whitespace-pre-wrap font-sans text-gray-600">
              {notificationTemplate}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            送信対象者一覧 ({overdueUsers.length}名)
          </h2>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      利用者名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      書籍タイトル
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
                  {overdueUsers.map((loan) => {
                    const daysOverdue = Math.floor(
                      (new Date() - new Date(loan.due_date)) / (1000 * 60 * 60 * 24)
                    )
                    return (
                      <tr key={loan.loan_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{loan.users.name}</div>
                          <div className="text-sm text-gray-500">{loan.users.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{loan.books.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(loan.due_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {daysOverdue}日
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/overdue/notification"
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            戻る
          </Link>
          <button
            onClick={handleSendNotifications}
            disabled={sending || overdueUsers.length === 0}
            className={`px-6 py-2 rounded-md text-sm font-medium text-white 
              ${
                sending || overdueUsers.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
          >
            {sending ? (
              <span className="flex items-center">
                <FiMail className="mr-2" />
                送信中...
              </span>
            ) : (
              <span className="flex items-center">
                <FiMail className="mr-2" />
                通知を送信
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationConfirm