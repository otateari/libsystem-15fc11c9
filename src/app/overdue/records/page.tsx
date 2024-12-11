"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase'
import { FiSearch, FiCalendar, FiMail, FiFilter } from 'react-icons/fi'
import Link from 'next/link'

type OverdueRecord = {
  notification_id: string
  loan_id: string
  sent_date: string
  notification_type: string
  status: string
  loan: {
    book_id: string
    user_id: string
    loan_date: string
    due_date: string
    return_date: string
    user: {
      name: string
      email: string
    }
  }
}

const OverdueRecordsPage = () => {
  const router = useRouter()
  const [records, setRecords] = useState<OverdueRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('overdue_notifications')
        .select(`
          *,
          loan:loans (
            *,
            user:users (
              name,
              email
            )
          )
        `)

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error('Error fetching records:', error)
      // サンプルデータ
      setRecords([
        {
          notification_id: '1',
          loan_id: '1',
          sent_date: '2024-01-15T10:00:00',
          notification_type: 'EMAIL',
          status: '送信済み',
          loan: {
            book_id: '1',
            user_id: '1',
            loan_date: '2024-01-01T10:00:00',
            due_date: '2024-01-14T10:00:00',
            return_date: null,
            user: {
              name: '山田太郎',
              email: 'yamada@example.com'
            }
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.loan.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.loan.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesDate = !dateFilter || record.sent_date.includes(dateFilter)
    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">延滞記録管理</h1>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <input
                type="text"
                placeholder="利用者名/メールで検索"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="relative">
              <select
                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">すべての状態</option>
                <option value="送信済み">送信済み</option>
                <option value="エラー">エラー</option>
                <option value="保留">保留</option>
              </select>
              <FiFilter className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              <FiCalendar className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">送信日時</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">利用者名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メールアドレス</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">通知タイプ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.notification_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.sent_date).toLocaleString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.loan.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.loan.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center gap-1">
                          <FiMail className="text-gray-400" />
                          {record.notification_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${record.status === '送信済み' ? 'bg-green-100 text-green-800' : 
                            record.status === 'エラー' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => router.push(`/overdue/records/${record.notification_id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          詳細
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OverdueRecordsPage