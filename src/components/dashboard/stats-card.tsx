import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
}

const cardStyle = {
  gradient: 'from-blue-400 to-indigo-500',
  bgLight: 'from-white to-blue-50/30',
  iconBg: 'from-blue-400 to-indigo-500',
  border: 'border-blue-100',
  hoverBorder: 'hover:border-blue-200',
}

export function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {

  return (
    <div className="group relative">
      <Card className={`
        relative overflow-hidden transition-all duration-300 ease-in-out
        hover:shadow-lg hover:shadow-blue-200/50
        hover:scale-[1.02] cursor-pointer
        bg-gradient-to-br ${cardStyle.bgLight}
        border ${cardStyle.border} ${cardStyle.hoverBorder}
      `}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className={`w-full h-full bg-gradient-to-br ${cardStyle.gradient}`} />
        </div>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-800 transition-colors">
            {title}
          </CardTitle>
          <div className={`
            p-2 rounded-lg shadow-sm group-hover:shadow-md
            bg-gradient-to-r ${cardStyle.iconBg}
            transition-all duration-300 group-hover:scale-105
          `}>
            <Icon className="h-5 w-5 text-white drop-shadow-sm" />
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {description && (
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors font-medium">
              {description}
            </p>
          )}

          {/* Progress indicator for numbers */}
          {typeof value === 'number' && value > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`h-1 rounded-full bg-gradient-to-r ${cardStyle.gradient} transition-all duration-1000`}
                  style={{ width: `${Math.min((value / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}