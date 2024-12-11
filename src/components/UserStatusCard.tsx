"use client"

import { FC } from 'react'
import { BiUser, BiPhone, BiEnvelope, BiMap } from 'react-icons/bi'
import { BsBook, BsCalendarCheck, BsClock } from 'react-icons/bs'

interface Loan {
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

interface User {
  user_id: string
  name: string
  email: string
  phone: string
  address: string
}

interface UserStatusCardProps {
  user: User
  currentLoans: Loan[]
  loanHistory: Loan[]
}

const UserStatusCard: FC<UserStatusCardProps> = ({ user, currentLoans, loanHistory }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">利用者情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <BiUser className="text-2xl text-primary" />
            <div>
              <p className="text-sm text-gray-500">氏名</p>
              <p className="text-gray-800">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BiEnvelope className="text-2xl text-primary" />
            <div>
              <p className="text-sm text-gray-500">メールアドレス</p>
              <p className="text-gray-800">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BiPhone className="text-2xl text-primary" />
            <div>
              <p className="text-sm text-gray-500">電話番号</p>
              <p className="text-gray-800">{user.phone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BiMap className="text-2xl text-primary" />
            <div>
              <p className="text-sm text-gray-500">住所</p>
              <p className="text-gray-800">{user.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">現在の貸出状況</h3>
        <div className="space-y-4">
          {currentLoans.map((loan) => (
            <div key={loan.loan_id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BsBook className="text-xl text-primary" />
                  <div>
                    <p className="font-medium text-gray-800">{loan.book.title}</p>
                    <p className="text-sm text-gray-600">{loan.book.author}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">貸出日: {formatDate(loan.loan_date)}</p>
                  <p className="text-sm text-gray-500">返却期限: {formatDate(loan.due_date)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">貸出履歴</h3>
        <div className="space-y-4">
          {loanHistory.map((loan) => (
            <div key={loan.loan_id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BsCalendarCheck className="text-xl text-primary" />
                  <div>
                    <p className="font-medium text-gray-800">{loan.book.title}</p>
                    <p className="text-sm text-gray-600">{loan.book.author}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">貸出日: {formatDate(loan.loan_date)}</p>
                  <p className="text-sm text-gray-500">返却日: {loan.return_date ? formatDate(loan.return_date) : '未返却'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserStatusCard