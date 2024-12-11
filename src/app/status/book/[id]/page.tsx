"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiBook, FiClock, FiUser, FiCalendar } from 'react-icons/fi'
import { IoReturnUpBack } from 'react-icons/io5'
import { BiMenuAltLeft } from 'react-icons/bi'
import { supabase } from '@/supabase'

interface Book {
  book_id: string
  isbn: string
  title: string
  author: string
  publisher: string
  status: string
}

interface Loan {
  loan_id: string
  user_id: string
  loan_date: string
  due_date: string
  return_date: string | null
  user: {
    name: string
  }
}

export default function BookStatus() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loans, setLoans] = useState<Loan[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('book_id', params.id)
          .single()

        if (bookError) throw bookError

        const { data: loanData, error: loanError } = await supabase
          .from('loans')
          .select('*, user:users(name)')
          .eq('book_id', params.id)
          .order('loan_date', { ascending: false })

        if (loanError) throw loanError

        setBook(bookData)
        setLoans(loanData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchBookData()
  }, [params.id])

  return (
    <div className="min-h-screen h-full bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2C4F7C] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="p-6">
          <h2 className="text-white text-xl font-bold mb-8">図書館管理システム</h2>
          <nav className="space-y-4">
            <Link href="/status/book" className="text-white block hover:bg-[#8FA5BC] p-2 rounded">
              書籍貸出状況
            </Link>
            <Link href="/status/user" className="text-white block hover:bg-[#8FA5BC] p-2 rounded">
              利用者別貸出状況
            </Link>
            <Link href="/status/stats" className="text-white block hover:bg-[#8FA5BC] p-2 rounded">
              貸出統計情報
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-0">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <BiMenuAltLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#2C4F7C]">書籍別貸出状況</h1>
            <div className="w-8"></div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {book && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#2C4F7C] mb-4">{book.title}</h2>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-600">
                      <FiBook className="mr-2" />
                      ISBN: {book.isbn}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FiUser className="mr-2" />
                      著者: {book.author}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FiClock className="mr-2" />
                      出版社: {book.publisher}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <div className={`px-4 py-2 rounded-full text-white ${
                    book.status === '貸出中' ? 'bg-[#F44336]' : 'bg-[#4CAF50]'
                  }`}>
                    {book.status}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-[#2C4F7C] mb-6">貸出履歴</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">利用者</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">貸出日</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">返却期限</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">返却日</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loans.map((loan) => (
                    <tr key={loan.loan_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loan.user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(loan.loan_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(loan.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {loan.return_date ? new Date(loan.return_date).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}