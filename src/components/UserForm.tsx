"use client"

import { useState, useEffect } from 'react'
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

type UserFormProps = {
  user?: {
    name?: string
    email?: string
    phone?: string
    address?: string
  }
  onSubmit: (userData: {
    name: string
    email: string
    phone: string
    address: string
  }) => void
}

export default function UserForm({ user, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      address: '',
    }

    if (!formData.name.trim()) {
      newErrors.name = '氏名は必須項目です'
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須項目です'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください'
      isValid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号は必須項目です'
      isValid = false
    } else if (!/^[0-9-]{10,}$/.test(formData.phone)) {
      newErrors.phone = '正しい電話番号を入力してください'
      isValid = false
    }

    if (!formData.address.trim()) {
      newErrors.address = '住所は必須項目です'
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiUser className="mr-2" />
            氏名
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="山田 太郎"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiMail className="mr-2" />
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="example@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiPhone className="mr-2" />
            電話番号
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="03-1234-5678"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiMapPin className="mr-2" />
            住所
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="東京都千代田区..."
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setFormData({ name: '', email: '', phone: '', address: '' })}
            className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            クリア
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-[#2C4F7C] rounded-md hover:bg-[#243f63] focus:outline-none focus:ring-2 focus:ring-[#2C4F7C]"
          >
            保存
          </button>
        </div>
      </div>
    </form>
  )
}