"use client"

import { IconType } from 'react-icons'
import { FiBookOpen, FiUser, FiBarChart, FiPrinter } from 'react-icons/fi'

const iconMap: { [key: string]: IconType } = {
  book: FiBookOpen,
  user: FiUser,
  chart: FiBarChart,
  print: FiPrinter
}

interface MenuCardProps {
  title: string
  icon: string
  onClick: () => void
}

const MenuCard = ({ title, icon, onClick }: MenuCardProps) => {
  const Icon = iconMap[icon] || FiBookOpen

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-primary/10 rounded-full p-4">
          <Icon className="text-primary w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 text-center">{title}</h3>
        <div className="w-full h-1 bg-primary/10 rounded-full">
          <div className="w-2/5 h-full bg-primary rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default MenuCard