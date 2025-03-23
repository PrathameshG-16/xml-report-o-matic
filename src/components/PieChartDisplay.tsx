
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface PieChartDisplayProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  title: string;
  className?: string;
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartDisplay: React.FC<PieChartDisplayProps> = ({ data, title, className }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className={cn("glass-card p-6 rounded-xl animate-fade-in", className)}>
      <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={800}
              animationBegin={300}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  strokeWidth={activeIndex === index ? 2 : 1}
                  className="transition-all-300"
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}`, '']}
              contentStyle={{ 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                border: 'none' 
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              iconType="circle"
              layout="horizontal"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartDisplay;
