"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaBook, FaUser, FaCalendar, FaCheck } from 'react-icons/fa'
import { supabase } from '@/supabase'
import Link from 'next/link'

const ReturnProcess = () => {
  const router = useRouter()
  const [bookId, setBookId] = useState('')
  const [loanInfo, setLoanInfo] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchLoanInfo = async (id: string) => {
    try {
      const { data: loanData, error: loanError } = await supabase
        .from('loans')
        .select(`
          *,
          books (*),
          users (*)
        `)
        .eq('book_id', id)
        .is('return_date', null)
        .single()

      if (loanError) throw loanError
      if (loanData) setLoanInfo(loanData)
    } catch (err) {
      setError('貸出情報の取得に失敗しました')
    }
  }

  const handleReturn = async () => {
    setLoading(true)
    try {
      const { error: updateError } = await supabase
        .from('loans')
        .update({
          return_date: new Date().toISOString()
        })
        .eq('loan_id', loanInfo.loan_id)

      if (updateError) throw updateError

      const { error: bookError } = await supabase
        .from('books')
        .update({ status: '利用可能' })
        .eq('book_id', bookId)

      if (bookError) throw bookError

      router.push('/return/complete')
    } catch (err) {
      setError('返却処理に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white h-screen fixed shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-bold text-primary">図書館システム</h2>
          </div>
          <nav className="mt-4">
            <Link href="/return/list" className="block px-4 py-2 hover:bg-gray-100">
              返却管理一覧
            </Link>
            <Link href="/return/process" className="block px-4 py-2 bg-primary text-white">
              返却処理
            </Link>
          </nav>
        </aside>

        <main className="flex-1 ml-64 p-8">
          <h1 className="text-2xl font-bold mb-8">返却処理</h1>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">書籍ID</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                  className="border rounded p-2 w-64"
                  placeholder="書籍IDを入力"
                />
                <button
                  onClick={() => fetchLoanInfo(bookId)}
                  className="bg-secondary text-white px-4 py-2 rounded hover:opacity-90"
                >
                  検索
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 text-red-600 p-4 rounded mb-4">
                {error}
              </div>
            )}

            {loanInfo && (
              <div className="border rounded p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">貸出情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FaBook className="mr-2 text-primary" />
                    <span>書籍名: {loanInfo.books.title}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-primary" />
                    <span>利用者: {loanInfo.users.name}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-primary" />
                    <span>貸出日: {new Date(loanInfo.loan_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-primary" />
                    <span>返却期限: {new Date(loanInfo.due_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleReturn}
                  disabled={loading}
                  className="mt-6 bg-primary text-white px-6 py-2 rounded flex items-center justify-center hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      返却処理を実行
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ReturnProcess