"use client"

import { useState } from 'react'
import { FaBook, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa'
import { supabase } from '@/supabase'

interface ReturnFormProps {
  onSubmit: (returnData: object) => void
}

export default function ReturnForm({ onSubmit }: ReturnFormProps) {
  const [bookId, setBookId] = useState('')
  const [loanInfo, setLoanInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBookIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBookId(value)
    if (value.length >= 5) {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('loans')
          .select(`
            *,
            books (*),
            users (*)
          `)
          .eq('book_id', value)
          .is('return_date', null)
          .single()

        if (error) throw error
        setLoanInfo(data)
        setError('')
      } catch (err) {
        setError('貸出情報が見つかりません')
        setLoanInfo(null)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (loanInfo) {
      onSubmit({
        loanId: loanInfo.loan_id,
        bookId: loanInfo.book_id,
        returnDate: new Date().toISOString()
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            書籍ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaBook className="text-gray-400" />
            </div>
            <input
              type="text"
              value={bookId}
              onChange={handleBookIdChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="書籍IDを入力"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-500">
            読み込み中...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {loanInfo && (
          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">書籍タイトル</p>
                <p className="font-medium">{loanInfo.books.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">利用者名</p>
                <p className="font-medium">{loanInfo.users.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">貸出日</p>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <p>{new Date(loanInfo.loan_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">返却予定日</p>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <p>{new Date(loanInfo.due_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaCheckCircle className="mr-2" />
              返却処理を実行
            </button>
          </div>
        )}
      </form>
    </div>
  )
}