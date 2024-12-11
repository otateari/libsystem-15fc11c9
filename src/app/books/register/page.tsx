"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiBook, FiSearch, FiSave, FiX } from 'react-icons/fi'
import { supabase } from '@/supabase'

export default function RegisterBook() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    status: '利用可能'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleISBNSearch = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/books-isbn-fetch?isbn=${formData.isbn}`)
      const data = await response.json()
      
      if (data) {
        setFormData({
          ...formData,
          title: data.title || '',
          author: data.author || '',
          publisher: data.publisher || ''
        })
      }
    } catch (error) {
      setError('ISBN検索中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('books')
        .insert([formData])

      if (error) throw error

      router.push('/books')
    } catch (error) {
      setError('書籍の登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <FiBook className="text-2xl text-primary mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">書籍新規登録</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                    className="flex-1 rounded-md border border-gray-300 p-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleISBNSearch}
                    className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                  >
                    <FiSearch />
                    <span>ISBN検索</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  著者
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  出版社
                </label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FiX />
                <span>キャンセル</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 disabled:opacity-50"
              >
                <FiSave />
                <span>{loading ? '登録中...' : '登録する'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}