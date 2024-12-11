"use client"

import { useState } from 'react'
import { FaBookOpen, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa'
import { MdTrendingUp } from 'react-icons/md'

interface StatisticsPanelProps {
  statistics?: {
    overdueCount: number
    overdueRate: number
    recentOverdue: number
    monthlyTrend: number
  }
}

const StatisticsPanel = ({ statistics = {
  overdueCount: 15,
  overdueRate: 8.5,
  recentOverdue: 3,
  monthlyTrend: 12
} }: StatisticsPanelProps) => {
  const [activeTab, setActiveTab] = useState('overview')

  const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: JSX.Element, color: string }) => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`${color} bg-opacity-20 p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">延滞統計</h2>
        <p className="text-gray-600">図書館の延滞状況の概要</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="現在の延滞数"
          value={statistics.overdueCount}
          icon={<FaBookOpen size={24} />}
          color="text-red-600"
        />
        <StatCard
          title="延滞率"
          value={`${statistics.overdueRate}%`}
          icon={<FaExclamationTriangle size={24} />}
          color="text-orange-500"
        />
        <StatCard
          title="今週の新規延滞"
          value={statistics.recentOverdue}
          icon={<FaCalendarAlt size={24} />}
          color="text-blue-600"
        />
        <StatCard
          title="先月比"
          value={`${statistics.monthlyTrend}%`}
          icon={<MdTrendingUp size={24} />}
          color="text-green-600"
        />
      </div>

      <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            概要
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'details'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('details')}
          >
            詳細
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">
            {activeTab === 'overview' ? (
              '現在の延滞状況の概要を表示しています。全体の延滞率は前月と比較して改善傾向にあります。'
            ) : (
              '延滞の詳細な分析とトレンドを確認できます。特定の書籍カテゴリーや利用者層での傾向を把握することができます。'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPanel