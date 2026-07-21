'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useMemo } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface PriceChartProps {
  data: { name: string; price: number }[]
  darkMode: boolean
  showRub: boolean
  rubRate: number
}

const COLORS = [
  'rgba(59, 130, 246, 0.85)',
  'rgba(16, 185, 129, 0.85)',
  'rgba(245, 158, 11, 0.85)',
  'rgba(139, 92, 246, 0.85)',
  'rgba(236, 72, 153, 0.85)',
  'rgba(14, 165, 233, 0.85)',
]

export function PriceChart({ data, darkMode, showRub = false, rubRate = 90 }: PriceChartProps) {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.price - b.price)
  }, [data])

  const barColors = useMemo(() => {
    return sortedData.map((_, index) => COLORS[index % COLORS.length])
  }, [sortedData])

  const chartData = useMemo(() => {
    const prices = sortedData.map((item) => 
      showRub ? Math.round(item.price * rubRate) : item.price
    )

    return {
      labels: sortedData.map((item) => item.name),
      datasets: [
        {
          label: showRub ? 'Цена (₽)' : 'Цена ($)',
          data: prices,
          backgroundColor: barColors,
          borderColor: barColors.map(c => c.replace('0.85', '1')),
          borderWidth: 2,
          borderRadius: 8,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        },
      ],
    }
  }, [sortedData, showRub, rubRate, barColors])

  const options: ChartOptions<'bar'> = useMemo(() => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart' as const,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: darkMode ? '#e5e7eb' : '#1f2937',
          font: {
            size: 13,
            weight: 'bold' as const,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle' as const,
        },
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: darkMode ? '#f3f4f6' : '#1f2937',
        bodyColor: darkMode ? '#e5e7eb' : '#374151',
        borderColor: darkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.parsed.x
            if (typeof value === 'number') {
              return showRub ? `${value.toLocaleString()} ₽/мес` : `$${value.toFixed(2)}/мес`
            }
            return ''
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.5)',
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
          callback: function(value) {
            if (typeof value === 'number') {
              return showRub ? `${value.toLocaleString()} ₽` : `$${value.toFixed(2)}`
            }
            return ''
          },
        },
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(55, 65, 81, 0.15)' : 'rgba(229, 231, 235, 0.3)',
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
        },
      },
    },
  }), [darkMode, showRub])

  return (
    <div className="w-full h-full min-h-[280px]">
      <Bar data={chartData} options={options} />
    </div>
  )
}