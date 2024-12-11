"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiUser, FiBook, FiClock, FiMail, FiPhone } from 'react-icons/fi'
import { BiHistory } from 'react-icons/bi'
import { FaBookReader } from 'react-icons/fa'
import { supabase } from '@/supabase'

const UserStatusPage = () => {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentLoans, setCurrentLoans] = useState<any[]>([])
  const [loanHistory, setLoanHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', params.id)
          .single()

        if (userError) throw userError

        const { data: loansData, error: loansError } = await supabase
          .from('loans')
          .select(`
            *,
            books (*)
          `)
          .eq('user_id', params.id)
          .order('loan_date', { ascending: false })

        if (loansError) throw loansError

        setUser(userData)
        setCurrentLoans(loansData.filter(loan => !loan.return_date))
        setLoanHistory(loansData.filter(loan => loan.return_date))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen h-full bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiUser className="mr-2" />
            利用者情報
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <FiUser className="text-gray-500 mr-2" />
              <span className="font-semibold mr-2">氏名:</span>
              <span>{user?.name}</span>
            </div>
            <div className="flex items-center">
              <FiMail className="text-gray-500 mr-2" />
              <span className="font-semibold mr-2">メール:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center">
              <FiPhone className="text-gray-500 mr-2" />
              <span className="font-semibold mr-2">電話番号:</span>
              <span>{user?.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaBookReader className="mr-2" />
            現在の貸出状況
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">書籍タイトル</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">貸出日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">返却予定日</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLoans.map((loan) => (
                  <tr key={loan.loan_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{loan.books.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(loan.loan_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(loan.due_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <BiHistory className="mr-2" />
            貸出履歴
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">書籍タイトル</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">貸出日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">返却日</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loanHistory.map((loan) => (
                  <tr key={loan.loan_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{loan.books.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(loan.loan_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(loan.return_date).toLocaleDateString()}
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

export default UserStatusPage