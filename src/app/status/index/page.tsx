"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { FiBook, FiUsers, FiPieChart } from 'react-icons/fi'

const LendingStatus = () => {
  const router = useRouter()

  const menuItems = [
    {
      title: '書籍別貸出状況',
      description: '書籍ごとの貸出状況を確認できます',
      icon: <FiBook className="w-8 h-8" />,
      link: '/status/book'
    },
    {
      title: '利用者別貸出状況',
      description: '利用者ごとの貸出状況を確認できます',
      icon: <FiUsers className="w-8 h-8" />,
      link: '/status/user'
    },
    {
      title: '貸出統計情報',
      description: '貸出に関する統計情報を確認できます',
      icon: <FiPieChart className="w-8 h-8" />,
      link: '/status/stats'
    }
  ]

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">貸出状況管理</h1>
          <p className="text-lg text-gray-600 mb-12">
            貸出状況に関する各種情報を確認できます
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className="focus:outline-none"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`bg-white rounded-lg shadow-md p-8 transition-all duration-300 ${
                  hoveredIndex === index
                    ? 'transform -translate-y-2 shadow-lg border-2 border-primary'
                    : ''
                }`}
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary bg-opacity-10 rounded-full mb-6">
                  <div className="text-primary">{item.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <img
            src="https://placehold.co/600x200/2C4F7C/FFFFFF/png?text=貸出状況管理"
            alt="貸出状況管理イメージ"
            className="mx-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  )
}

export default LendingStatus