"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase'
import { FiUser, FiMail, FiPhone, FiMapPin, FiCheck, FiX } from 'react-icons/fi'
import Link from 'next/link'
import { AiOutlineMenu } from 'react-icons/ai'

const RegisterUser = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [errors, setErrors] = useState({})
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: null,
    phone: null
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setDuplicateCheck(prev => ({
      ...prev,
      [name]: null
    }))
  }

  const checkDuplicate = async () => {
    try {
      const { data: emailCheck } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .single()

      const { data: phoneCheck } = await supabase
        .from('users')
        .select('phone')
        .eq('phone', formData.phone)
        .single()

      setDuplicateCheck({
        email: !emailCheck,
        phone: !phoneCheck
      })

      return !emailCheck && !phoneCheck
    } catch (error) {
      console.error('重複チェックエラー:', error)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValid = await checkDuplicate()

    if (!isValid) {
      return
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([formData])

      if (error) throw error

      router.push('/users')
    } catch (error) {
      console.error('登録エラー:', error)
    }
  }

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2C4F7C] text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static`}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-8">図書館管理システム</h2>
            <nav>
              <Link href="/books" className="block py-2 px-4 hover:bg-[#8FA5BC] rounded">
                書籍管理
              </Link>
              <Link href="/loans" className="block py-2 px-4 hover:bg-[#8FA5BC] rounded">
                貸出管理
              </Link>
              <Link href="/returns" className="block py-2 px-4 hover:bg-[#8FA5BC] rounded">
                返却管理
              </Link>
              <Link href="/users" className="block py-2 px-4 hover:bg-[#8FA5BC] rounded">
                利用者管理
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center p-4">
              <button
                className="md:hidden text-gray-600"
                onClick={() => setIsOpen(!isOpen)}
              >
                <AiOutlineMenu size={24} />
              </button>
              <h1 className="text-xl font-bold text-[#2C4F7C]">利用者新規登録</h1>
              <div className="w-8"></div>
            </div>
          </header>

          <main className="p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    氏名
                  </label>
                  <div className="relative">
                    <FiUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2C4F7C] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス
                  </label>
                  <div className="relative">
                    <FiMail className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2C4F7C] focus:border-transparent"
                      required
                    />
                    {duplicateCheck.email !== null && (
                      <span className={`absolute right-3 top-3 ${duplicateCheck.email ? 'text-green-500' : 'text-red-500'}`}>
                        {duplicateCheck.email ? <FiCheck /> : <FiX />}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    電話番号
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2C4F7C] focus:border-transparent"
                      required
                    />
                    {duplicateCheck.phone !== null && (
                      <span className={`absolute right-3 top-3 ${duplicateCheck.phone ? 'text-green-500' : 'text-red-500'}`}>
                        {duplicateCheck.phone ? <FiCheck /> : <FiX />}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    住所
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2C4F7C] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Link
                    href="/users"
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    キャンセル
                  </Link>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2C4F7C] text-white rounded-md hover:bg-[#8FA5BC] transition-colors"
                  >
                    登録
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default RegisterUser