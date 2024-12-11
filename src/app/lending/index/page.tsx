"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase'
import { IoMdBook } from 'react-icons/io'
import { FaUser } from 'react-icons/fa'
import { BiSolidError } from 'react-icons/bi'
import { IoCheckmarkCircle } from 'react-icons/io5'

const LendingPage = () => {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [bookId, setBookId] = useState('')
  const [userName, setUserName] = useState('')
  const [bookStatus, setBookStatus] = useState('')
  const [message, setMessage] = useState({ type: '', content: '' })
  const [loading, setLoading] = useState(false)

  const checkUser = async (id: string) => {
    if (!id) return
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('user_id', id)
        .single()

      if (error) throw error
      if (data) {
        setUserName(data.name)
        setMessage({ type: 'success', content: 'ユーザーが見つかりました' })
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'ユーザーが見つかりません' })
      setUserName('')
    }
  }

  const checkBook = async (id: string) => {
    if (!id) return
    try {
      const { data, error } = await supabase
        .from('books')
        .select('status')
        .eq('book_id', id)
        .single()

      if (error) throw error
      if (data) {
        setBookStatus(data.status)
        setMessage({
          type: data.status === '貸出可能' ? 'success' : 'error',
          content: `書籍は${data.status}です`
        })
      }
    } catch (error) {
      setMessage({ type: 'error', content: '書籍が見つかりません' })
      setBookStatus('')
    }
  }

  const handleLending = async () => {
    if (!userId || !bookId) {
      setMessage({ type: 'error', content: '必要な情報を入力してください' })
      return
    }

    setLoading(true)
    try {
      const loanDate = new Date()
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14)

      const { error } = await supabase.from('loans').insert([
        {
          book_id: bookId,
          user_id: userId,
          loan_date: loanDate.toISOString(),
          due_date: dueDate.toISOString()
        }
      ])

      if (error) throw error

      await supabase
        .from('books')
        .update({ status: '貸出中' })
        .eq('book_id', bookId)

      setMessage({ type: 'success', content: '貸出処理が完了しました' })
      setUserId('')
      setBookId('')
      setUserName('')
      setBookStatus('')
    } catch (error) {
      setMessage({ type: 'error', content: '貸出処理に失敗しました' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">書籍貸出</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              利用者ID
            </label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaUser className="text-gray-400" />
                </span>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onBlur={() => checkUser(userId)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="利用者IDを入力"
                />
              </div>
              {userName && (
                <div className="flex items-center text-sm text-gray-600">
                  <IoCheckmarkCircle className="text-green-500 mr-2" />
                  {userName}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              書籍ID
            </label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <IoMdBook className="text-gray-400" />
                </span>
                <input
                  type="text"
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                  onBlur={() => checkBook(bookId)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="書籍IDを入力"
                />
              </div>
              {bookStatus && (
                <div className="flex items-center text-sm text-gray-600">
                  {bookStatus === '貸出可能' ? (
                    <IoCheckmarkCircle className="text-green-500 mr-2" />
                  ) : (
                    <BiSolidError className="text-red-500 mr-2" />
                  )}
                  {bookStatus}
                </div>
              )}
            </div>
          </div>

          {message.content && (
            <div
              className={`p-4 rounded-md mb-6 ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {message.content}
            </div>
          )}

          <button
            onClick={handleLending}
            disabled={loading || !userId || !bookId || bookStatus !== '貸出可能'}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '処理中...' : '貸出実行'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LendingPage