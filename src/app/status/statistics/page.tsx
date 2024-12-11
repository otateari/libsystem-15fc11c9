"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BiDownload } from 'react-icons/bi'
import { FiCalendar } from 'react-icons/fi'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { supabase } from '@/supabase'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const StatisticsPage = () => {
  const router = useRouter()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statistics, setStatistics] = useState({
    labels: [],
    loanCounts: [],
    returnCounts: [],
    overdueCounts: [],
  })

  const fetchStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .gte('loan_date', startDate)
        .lte('loan_date', endDate)

      if (error) throw error

      // サンプルデータ（実際はデータを適切に加工）
      const sampleData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        loanCounts: [65, 59, 80, 81, 56, 55],
        returnCounts: [45, 50, 75, 78, 52, 50],
        overdueCounts: [10, 5, 8, 12, 15, 7],
      }
      setStatistics(sampleData)
    } catch (error) {
      console.error('統計情報の取得に失敗しました:', error)
    }
  }

  const chartData = {
    labels: statistics.labels,
    datasets: [
      {
        label: '貸出数',
        data: statistics.loanCounts,
        backgroundColor: 'rgba(44, 79, 124, 0.5)',
        borderColor: 'rgba(44, 79, 124, 1)',
        borderWidth: 1,
      },
      {
        label: '返却数',
        data: statistics.returnCounts,
        backgroundColor: 'rgba(143, 165, 188, 0.5)',
        borderColor: 'rgba(143, 165, 188, 1)',
        borderWidth: 1,
      },
      {
        label: '延滞数',
        data: statistics.overdueCounts,
        backgroundColor: 'rgba(230, 180, 34, 0.5)',
        borderColor: 'rgba(230, 180, 34, 1)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '貸出統計情報',
      },
    },
  }

  const handleExportCSV = () => {
    const csvContent = `期間,${statistics.labels.join(',')}
貸出数,${statistics.loanCounts.join(',')}
返却数,${statistics.returnCounts.join(',')}
延滞数,${statistics.overdueCounts.join(',')}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = '貸出統計情報.csv'
    link.click()
  }

  useEffect(() => {
    if (startDate && endDate) {
      fetchStatistics()
    }
  }, [startDate, endDate])

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">統計情報出力</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <FiCalendar className="mr-2 text-gray-500" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
            <span className="text-gray-500">〜</span>
            <div className="flex items-center">
              <FiCalendar className="mr-2 text-gray-500" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mb-8">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-colors"
          >
            <BiDownload className="mr-2" />
            CSV出力
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">統計サマリー</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">総貸出数</h3>
              <p className="text-2xl font-bold text-primary">
                {statistics.loanCounts.reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">総返却数</h3>
              <p className="text-2xl font-bold text-secondary">
                {statistics.returnCounts.reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">総延滞数</h3>
              <p className="text-2xl font-bold text-accent">
                {statistics.overdueCounts.reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPage