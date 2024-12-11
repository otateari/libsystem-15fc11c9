"use client"

import { useState } from 'react'
import { BiBook, BiCalendar, BiUser, BiHistory } from 'react-icons/bi'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface Loan {
  loan_id: string
  user_id: string
  loan_date: string
  due_date: string
  return_date: string | null
}

interface Book {
  book_id: string
  isbn: string
  title: string
  author: string
  publisher: string
  status: string
}

interface BookStatusCardProps {
  book: Book
  loanHistory: Loan[]
}

const BookStatusCard = ({ book, loanHistory }: BookStatusCardProps) => {
  const [showHistory, setShowHistory] = useState(false)

  const currentLoan = loanHistory.find(loan => !loan.return_date)
  const status = currentLoan ? '貸出中' : '在庫あり'
  const statusColor = currentLoan ? 'text-orange-500' : 'text-green-500'

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h2>
          <div className="text-gray-600 space-y-1">
            <p className="flex items-center gap-2">
              <BiBook className="text-primary" />
              ISBN: {book.isbn}
            </p>
            <p>著者: {book.author}</p>
            <p>出版社: {book.publisher}</p>
          </div>
        </div>
        <div className={`text-lg font-semibold ${statusColor} px-4 py-2 rounded-full bg-gray-100`}>
          {status}
        </div>
      </div>

      {currentLoan && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">現在の貸出情報</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <BiCalendar className="text-primary" />
              <div>
                <p className="text-sm text-gray-500">貸出日</p>
                <p>{format(new Date(currentLoan.loan_date), 'yyyy年MM月dd日', { locale: ja })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BiCalendar className="text-primary" />
              <div>
                <p className="text-sm text-gray-500">返却期限</p>
                <p>{format(new Date(currentLoan.due_date), 'yyyy年MM月dd日', { locale: ja })}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          onClick={() => setShowHistory(!showHistory)}
        >
          <BiHistory />
          貸出履歴を{showHistory ? '閉じる' : '表示'}
        </button>

        {showHistory && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">貸出履歴</h3>
            <div className="space-y-4">
              {loanHistory.map((loan) => (
                <div key={loan.loan_id} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">貸出日</p>
                      <p>{format(new Date(loan.loan_date), 'yyyy年MM月dd日', { locale: ja })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">返却期限</p>
                      <p>{format(new Date(loan.due_date), 'yyyy年MM月dd日', { locale: ja })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">返却日</p>
                      <p>{loan.return_date 
                        ? format(new Date(loan.return_date), 'yyyy年MM月dd日', { locale: ja })
                        : '未返却'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookStatusCard