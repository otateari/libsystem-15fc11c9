"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiEdit, FiPlus, FiSearch } from 'react-icons/fi'
import { supabase } from '@/supabase'
import { BiBook, BiHome, BiUser, BiHistory, BiTime } from 'react-icons/bi'

type Book = {
  book_id: string
  isbn: string
  title: string
  author: string
  publisher: string
  status: string
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
      
      if (error) throw error
      
      setBooks(data || [])
    } catch (error) {
      console.error('Error fetching books:', error)
      // サンプルデータ
      setBooks([
        {
          book_id: '1',
          isbn: '9784123456789',
          title: '現代文学選集',
          author: '山田太郎',
          publisher: '文学出版社',
          status: '利用可能'
        },
        {
          book_id: '2',
          isbn: '9784987654321',
          title: 'プログラミング入門',
          author: '鈴木次郎',
          publisher: '技術書出版',
          status: '貸出中'
        }
      ])
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  )

  return (
    <div className="min-h-screen h-full flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">図書館システム</h2>
        </div>
        <nav className="mt-6">
          <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <BiHome className="mr-3" size={20} />
            <span>ダッシュボード</span>
          </Link>
          <Link href="/books" className="flex items-center px-6 py-3 bg-blue-50 text-blue-700">
            <BiBook className="mr-3" size={20} />
            <span>書籍管理</span>
          </Link>
          <Link href="/users" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <BiUser className="mr-3" size={20} />
            <span>利用者管理</span>
          </Link>
          <Link href="/loans" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <BiHistory className="mr-3" size={20} />
            <span>貸出管理</span>
          </Link>
          <Link href="/overdue" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <BiTime className="mr-3" size={20} />
            <span>延滞管理</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">書籍一覧</h1>
            <Link href="/books/new" 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <FiPlus className="mr-2" />
              新規登録
            </Link>
          </div>

          {/* Search Form */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="タイトル、著者、ISBNで検索"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Books Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">著者</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出版社</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.book_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.isbn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.publisher}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        book.status === '利用可能' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/books/${book.book_id}/edit`}
                        className="text-blue-600 hover:text-blue-900">
                        <FiEdit className="inline-block" /> 編集
                      </Link>
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