"use client"

import { useState, useEffect } from 'react'
import { FiBook, FiUser, FiHash, FiHome, FiCheckCircle } from 'react-icons/fi'
import { supabase } from '@/supabase'

type BookFormProps = {
  book?: {
    book_id?: string
    isbn?: string
    title?: string
    author?: string
    publisher?: string
    status?: string
  }
  onSubmit: (bookData: any) => void
}

const BookForm = ({ book, onSubmit }: BookFormProps) => {
  const [formData, setFormData] = useState({
    isbn: book?.isbn || '',
    title: book?.title || '',
    author: book?.author || '',
    publisher: book?.publisher || '',
    status: book?.status || '利用可能'
  })

  const [errors, setErrors] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // エラーをクリア
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      isbn: '',
      title: '',
      author: '',
      publisher: ''
    }

    if (!formData.isbn || !/^\d{13}$/.test(formData.isbn)) {
      newErrors.isbn = 'ISBNは13桁の数字で入力してください'
      isValid = false
    }

    if (!formData.title.trim()) {
      newErrors.title = '書籍名は必須です'
      isValid = false
    }

    if (!formData.author.trim()) {
      newErrors.author = '著者名は必須です'
      isValid = false
    }

    if (!formData.publisher.trim()) {
      newErrors.publisher = '出版社は必須です'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiHash className="mr-2" />
            ISBN
          </label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={13}
          />
          {errors.isbn && <p className="mt-1 text-sm text-red-500">{errors.isbn}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiBook className="mr-2" />
            書籍名
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={200}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiUser className="mr-2" />
            著者
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100}
          />
          {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiHome className="mr-2" />
            出版社
          </label>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100}
          />
          {errors.publisher && <p className="mt-1 text-sm text-red-500">{errors.publisher}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiCheckCircle className="mr-2" />
            状態
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="利用可能">利用可能</option>
            <option value="貸出中">貸出中</option>
            <option value="整備中">整備中</option>
            <option value="廃棄">廃棄</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {book ? '更新' : '登録'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default BookForm