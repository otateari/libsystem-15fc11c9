"use client"

import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaBook, FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { supabase } from '@/supabase'

type User = {
  user_id: string
  name: string
  email: string
  phone: string
  address: string
}

type Loan = {
  loan_id: string
  book_id: string
  loan_date: string
  due_date: string
  return_date: string | null
  book: {
    title: string
    author: string
  }
}

const UserConfirmPage: FC = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // この例ではURLのクエリパラメータからuser_idを取得することを想定
        const userId = 'sample-user-id'

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (userError) throw userError

        const { data: loanData, error: loanError } = await supabase
          .from('loans')
          .select(`
            *,
            book:books (
              title,
              author
            )
          `)
          .eq('user_id', userId)
          .is('return_date', null)

        if (loanError) throw loanError

        setUser(userData)
        setLoans(loanData)
      } catch (error) {
        console.error('データの取得に失敗しました:', error)
        // サンプルデータの設定
        setUser({
          user_id: 'sample-id',
          name: '山田太郎',
          email: 'yamada@example.com',
          phone: '090-1234-5678',
          address: '東京都千代田区...'
        })
        setLoans([
          {
            loan_id: '1',
            book_id: 'book-1',
            loan_date: '2024-01-01',
            due_date: '2024-01-15',
            return_date: null,
            book: {
              title: '風と共に去りぬ',
              author: 'マーガレット・ミッチェル'
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleConfirm = () => {
    router.push('/lending/book-status')
  }

  if (loading) {
    return (
      <div className="min-h-screen h-full bg-gray-50 p-8">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-full bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">利用者情報確認</h1>

        {/* 利用者情報カード */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">利用者情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <FaUser className="text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">氏名</p>
                <p className="text-gray-800">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">メールアドレス</p>
                <p className="text-gray-800">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">電話番号</p>
                <p className="text-gray-800">{user?.phone}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">住所</p>
                <p className="text-gray-800">{user?.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 貸出中書籍一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">貸出中の書籍</h2>
          {loans.length > 0 ? (
            <div className="space-y-4">
              {loans.map((loan) => (
                <div key={loan.loan_id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start">
                    <FaBook className="text-primary mt-1 mr-3" />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{loan.book.title}</p>
                      <p className="text-sm text-gray-600">{loan.book.author}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <FaCalendarAlt className="mr-2" />
                        <span>貸出日: {new Date(loan.loan_date).toLocaleDateString()}</span>
                        <span className="mx-2">|</span>
                        <span>返却期限: {new Date(loan.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">現在貸出中の書籍はありません。</p>
          )}
        </div>

        {/* 確認ボタン */}
        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            確認して次へ進む
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserConfirmPage