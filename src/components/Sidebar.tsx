"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BsBook, BsPersonFill, BsClockHistory, BsExclamationTriangle } from 'react-icons/bs'
import { FaExchangeAlt, FaChartBar } from 'react-icons/fa'
import { IoMdStats } from 'react-icons/io'
import { RiDashboardLine } from 'react-icons/ri'
import { TbBooks } from 'react-icons/tb'

type Props = {
  activeMenu: string
  userRole: string
}

const Sidebar = ({ activeMenu, userRole }: Props) => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { 
      id: 'dashboard',
      name: 'ダッシュボード',
      path: '/dashboard',
      icon: <RiDashboardLine className="w-5 h-5" />
    },
    { 
      id: 'lending',
      name: '書籍貸出',
      path: '/lending',
      icon: <BsBook className="w-5 h-5" />
    },
    { 
      id: 'return',
      name: '返却管理',
      path: '/return',
      icon: <FaExchangeAlt className="w-5 h-5" />
    },
    { 
      id: 'books',
      name: '書籍管理',
      path: '/books',
      icon: <TbBooks className="w-5 h-5" />
    },
    { 
      id: 'users',
      name: '利用者管理',
      path: '/users',
      icon: <BsPersonFill className="w-5 h-5" />
    },
    { 
      id: 'status',
      name: '貸出状況',
      path: '/status',
      icon: <IoMdStats className="w-5 h-5" />
    }
  ]

  if (userRole === 'admin') {
    menuItems.push(
      { 
        id: 'overdue',
        name: '延滞管理',
        path: '/overdue',
        icon: <BsExclamationTriangle className="w-5 h-5" />
      },
      { 
        id: 'statistics',
        name: '統計情報',
        path: '/status/statistics',
        icon: <FaChartBar className="w-5 h-5" />
      }
    )
  }

  return (
    <div className={`h-full min-h-screen bg-[#2C4F7C] text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 border-b border-gray-600">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center"
        >
          <img src="https://placehold.co/40x40" alt="Logo" className="rounded-full" />
          {!isCollapsed && <span className="ml-3 font-bold">図書館システム</span>}
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path)
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center px-4 py-3 transition-colors duration-200
                ${isActive ? 'bg-[#8FA5BC] text-white' : 'text-gray-300 hover:bg-[#8FA5BC] hover:text-white'}`}
            >
              <div className="flex items-center">
                {item.icon}
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </div>
            </Link>
          )
        })}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-600">
        <div className="flex items-center">
          <BsClockHistory className="w-5 h-5" />
          {!isCollapsed && (
            <div className="ml-3">
              <div className="text-sm">最終ログイン</div>
              <div className="text-xs text-gray-300">2024/01/01 12:00</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar