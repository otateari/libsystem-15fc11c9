"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiSave, FiTrash2 } from 'react-icons/fi'
import { supabase } from '@/supabase'
import Link from 'next/link'
import { FiHome, FiBook, FiUsers, FiCalendar, FiSettings } from 'react-icons/fi'

type Book = {
  book_id: string
  isbn: string
  title: string
  author: string
  publisher: string
  status: string
}

export default function EditBook({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [book, setBook] = useState<Book>({
    book_id: '',
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    status: ''
  })

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('book_id', params.id)
        .single()

      if (error) {
        console.error('Error fetching book:', error)
        return
      }

      if (data) {
        setBook(data)
      }
    }

    fetchBook()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBook({ ...book, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('books')
      .update({
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        status: book.status
      })
      .eq('book_id', params.id)

    if (error) {
      console.error('Error updating book:', error)
      return
    }

    router.push('/books')
  }

  const handleDelete = async () => {
    if (confirm('本当にこの書籍を削除しますか？')) {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('book_id', params.id)

      if (error) {
        console.error('Error deleting book:', error)
        return
      }

      router.push('/books')
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">図書館システム</h2>
        </div>
        <nav className="mt-4">
          <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
            <FiHome className="mr-3" />
            ダッシュボード
          </Link>
          <Link href="/books" className="flex items-center px-4 py-3 bg-gray-100 text-blue-600">
            <FiBook className="mr-3" />
            書籍管理
          </Link>
          <Link href="/users" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
            <FiUsers className="mr-3" />
            利用者管理
          </Link>
          <Link href="/loans" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
            <FiCalendar className="mr-3" />
            貸出管理
          </Link>
          <Link href="/settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
            <FiSettings className="mr-3" />
            設定
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">書籍情報編集</h1>

          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isbn">
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={book.isbn}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                タイトル
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={book.title}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                著者
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={book.author}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisher">
                出版社
              </label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={book.publisher}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                ステータス
              </label>
              <select
                id="status"
                name="status"
                value={book.status}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="available">利用可能</option>
                <option value="borrowed">貸出中</option>
                <option value="maintenance">メンテナンス中</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              >
                <FiSave className="mr-2" />
                更新
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              >
                <FiTrash2 className="mr-2" />
                削除
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}