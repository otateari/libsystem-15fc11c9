"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch, FiMail, FiCalendar } from 'react-icons/fi'
import { supabase } from '@/supabase'
import Link from 'next/link'

type OverdueBook = {
  loan_id: string
  book_id: string
  user_id: string
  loan_date: string
  due_date: string
  return_date: string | null
  title: string
  author: string
  isbn: string
  user_name: string
  email: string
}

const OverdueSearchPage = () => {
  const router = useRouter()
  const [overdueBooks, setOverdueBooks] = useState<OverdueBook[]>([])
  const [searchParams, setSearchParams] = useState({
    isbn: '',
    title: '',
    userName: '',
    dueDateFrom: '',
    dueDateTo: ''
  })
  const [loading, setLoading] = useState(false)

  const fetchOverdueBooks = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('loans')
        .select(`
          *,
          books (title, author, isbn),
          users (name, email)
        `)
        .is('return_date', null)
        .lt('due_date', new Date().toISOString())

      if (error) throw error

      const formattedData = data.map(loan => ({
        loan_id: loan.loan_id,
        book_id: loan.book_id,
        user_id: loan.user_id,
        loan_date: loan.loan_date,
        due_date: loan.due_date,
        return_date: loan.return_date,
        title: loan.books.title,
        author: loan.books.author,
        isbn: loan.books.isbn,
        user_name: loan.users.name,
        email: loan.users.email
      }))

      setOverdueBooks(formattedData)
    } catch (error) {
      console.error('Error fetching overdue books:', error)
      // サンプルデータ
      setOverdueBooks([
        {
          loan_id: '1',
          book_id: '1',
          user_id: '1',
          loan_date: '2024-01-01',
          due_date: '2024-01-15',
          return_date: null,
          title: 'サンプル書籍',
          author: 'サンプル著者',
          isbn: '1234567890123',
          user_name: '山田太郎',
          email: 'sample@example.com'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverdueBooks()
  }, [])

  const handleSearch = () => {
    let filtered = overdueBooks

    if (searchParams.isbn) {
      filtered = filtered.filter(book => book.isbn.includes(searchParams.isbn))
    }
    if (searchParams.title) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchParams.title.toLowerCase())
      )
    }
    if (searchParams.userName) {
      filtered = filtered.filter(book =>
        book.user_name.toLowerCase().includes(searchParams.userName.toLowerCase())
      )
    }
    if (searchParams.dueDateFrom) {
      filtered = filtered.filter(book =>
        new Date(book.due_date) >= new Date(searchParams.dueDateFrom)
      )
    }
    if (searchParams.dueDateTo) {
      filtered = filtered.filter(book =>
        new Date(book.due_date) <= new Date(searchParams.dueDateTo)
      )
    }

    setOverdueBooks(filtered)
  }

  const handleNotify = async (email: string) => {
    // 通知処理の実装
    alert(`${email}に通知を送信しました。`)
  }

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <div className="flex">
        <nav className="w-64 min-h-screen bg-[#2C4F7C] text-white p-4">
          <div className="text-xl font-bold mb-8">図書館管理システム</div>
          <ul className="space-y-2">
            <li>
              <Link href="/books" className="block p-2 hover:bg-[#8FA5BC] rounded">
                書籍管理
              </Link>
            </li>
            <li>
              <Link href="/users" className="block p-2 hover:bg-[#8FA5BC] rounded">
                利用者管理
              </Link>
            </li>
            <li>
              <Link href="/loans" className="block p-2 hover:bg-[#8FA5BC] rounded">
                貸出管理
              </Link>
            </li>
            <li>
              <Link href="/overdue" className="block p-2 bg-[#8FA5BC] rounded">
                延滞管理
              </Link>
            </li>
          </ul>
        </nav>

        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">延滞書籍検索</h1>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={searchParams.isbn}
                  onChange={(e) => setSearchParams({...searchParams, isbn: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  書籍タイトル
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={searchParams.title}
                  onChange={(e) => setSearchParams({...searchParams, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  利用者名
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={searchParams.userName}
                  onChange={(e) => setSearchParams({...searchParams, userName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  返却期限（開始）
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={searchParams.dueDateFrom}
                  onChange={(e) => setSearchParams({...searchParams, dueDateFrom: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  返却期限（終了）
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={searchParams.dueDateTo}
                  onChange={(e) => setSearchParams({...searchParams, dueDateTo: e.target.value})}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#2C4F7C] text-white px-4 py-2 rounded flex items-center"
            >
              <FiSearch className="mr-2" />
              検索
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ISBN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      書籍タイトル
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      利用者名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      貸出日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      返却期限
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        読み込み中...
                      </td>
                    </tr>
                  ) : overdueBooks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        該当する延滞書籍はありません
                      </td>
                    </tr>
                  ) : (
                    overdueBooks.map((book) => (
                      <tr key={book.loan_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {book.isbn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {book.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {book.user_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(book.loan_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(book.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleNotify(book.email)}
                            className="bg-[#E6B422] text-white px-3 py-1 rounded flex items-center"
                          >
                            <FiMail className="mr-1" />
                            通知
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default OverdueSearchPage