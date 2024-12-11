"use client"

import { useEffect, useState } from 'react'
import { BsPersonFill } from 'react-icons/bs'
import { FaBook, FaHistory } from 'react-icons/fa'
import { BiPhone } from 'react-icons/bi'
import { MdEmail, MdLocationOn } from 'react-icons/md'

type UserInfoCardProps = {
  user: {
    user_id: string
    name: string
    email: string
    phone: string
    address: string
  }
  loanHistory: Array<{
    loan_id: string
    book_id: string
    loan_date: string
    due_date: string
    return_date?: string
    book: {
      title: string
      author: string
    }
  }>
}

const UserInfoCard = ({ user, loanHistory }: UserInfoCardProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile')

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-[#2C4F7C] rounded-full flex items-center justify-center">
          <BsPersonFill className="text-white text-3xl" />
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-[#2C4F7C]">{user.name}</h2>
          <p className="text-gray-600">ID: {user.user_id}</p>
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === 'profile'
              ? 'border-b-2 border-[#2C4F7C] text-[#2C4F7C] font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          利用者情報
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'history'
              ? 'border-b-2 border-[#2C4F7C] text-[#2C4F7C] font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('history')}
        >
          貸出履歴
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="space-y-4">
          <div className="flex items-center">
            <MdEmail className="text-[#8FA5BC] text-xl mr-3" />
            <p>{user.email}</p>
          </div>
          <div className="flex items-center">
            <BiPhone className="text-[#8FA5BC] text-xl mr-3" />
            <p>{user.phone}</p>
          </div>
          <div className="flex items-center">
            <MdLocationOn className="text-[#8FA5BC] text-xl mr-3" />
            <p>{user.address}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {loanHistory.map((loan) => (
            <div
              key={loan.loan_id}
              className="border rounded-lg p-4 flex items-start"
            >
              <FaBook className="text-[#8FA5BC] text-xl mr-3 mt-1" />
              <div>
                <h3 className="font-semibold">{loan.book.title}</h3>
                <p className="text-gray-600 text-sm">{loan.book.author}</p>
                <div className="mt-2 text-sm">
                  <p>貸出日: {new Date(loan.loan_date).toLocaleDateString()}</p>
                  <p>返却期限: {new Date(loan.due_date).toLocaleDateString()}</p>
                  {loan.return_date && (
                    <p>
                      返却日: {new Date(loan.return_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserInfoCard