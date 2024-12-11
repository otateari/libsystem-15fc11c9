"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
)

type StatisticsChartProps = {
  data: any[]
  type: 'line' | 'bar' | 'pie'
}

export const StatisticsChart: React.FC<StatisticsChartProps> = ({ data, type }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  })

  const createChartData = () => {
    const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    
    const chartConfig = {
      labels: monthLabels,
      datasets: [
        {
          label: '貸出数',
          data: data.map(item => item.count) || Array(12).fill(Math.floor(Math.random() * 50)),
          borderColor: '#2C4F7C',
          backgroundColor: type === 'pie' ? [
            '#2C4F7C',
            '#8FA5BC',
            '#E6B422',
            '#4CAF50',
            '#FF9800',
            '#F44336',
            '#2196F3',
            '#9C27B0',
            '#607D8B',
            '#795548',
            '#FF5722',
            '#CDDC39'
          ] : 'rgba(44, 79, 124, 0.2)',
          borderWidth: 2,
        }
      ]
    }

    setChartData(chartConfig)
  }

  useEffect(() => {
    createChartData()
  }, [data])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '月別貸出統計',
        font: {
          size: 16,
          family: 'Noto Sans JP',
        }
      }
    },
    scales: type !== 'pie' ? {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Noto Sans JP'
          }
        }
      },
      x: {
        ticks: {
          font: {
            family: 'Noto Sans JP'
          }
        }
      }
    } : undefined
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={chartData} options={options} />
      case 'bar':
        return <Bar data={chartData} options={options} />
      case 'pie':
        return <Pie data={chartData} options={options} />
      default:
        return <Line data={chartData} options={options} />
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="w-full h-[400px] flex items-center justify-center">
        {renderChart()}
      </div>
    </div>
  )
}

export default StatisticsChart