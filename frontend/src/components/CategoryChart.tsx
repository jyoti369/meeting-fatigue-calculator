import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryChartProps {
  data: Record<string, number>;
}

const COLORS = {
  standup: '#3b82f6',
  one_on_one: '#8b5cf6',
  planning: '#06b6d4',
  review: '#10b981',
  brainstorm: '#f59e0b',
  training: '#ec4899',
  interview: '#ef4444',
  all_hands: '#6366f1',
  social: '#14b8a6',
  other: '#64748b',
};

const LABELS: Record<string, string> = {
  standup: 'Standup',
  one_on_one: '1:1',
  planning: 'Planning',
  review: 'Review/Demo',
  brainstorm: 'Brainstorm',
  training: 'Training',
  interview: 'Interview',
  all_hands: 'All-Hands',
  social: 'Social',
  other: 'Other',
};

function CategoryChart({ data }: CategoryChartProps) {
  const chartData = Object.entries(data)
    .filter(([_, hours]) => hours > 0)
    .map(([category, hours]) => ({
      name: LABELS[category] || category,
      value: parseFloat(hours.toFixed(1)),
      category,
    }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return <div className="text-center text-gray-500 py-8">No meeting data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.category as keyof typeof COLORS] || '#64748b'} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value}h`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CategoryChart;
