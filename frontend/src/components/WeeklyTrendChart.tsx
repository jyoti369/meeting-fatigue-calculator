import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyTrendChartProps {
  data: Array<{ week: string; hours: number }>;
}

function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  if (data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No trend data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value: number) => `${value}h`} />
        <Line
          type="monotone"
          dataKey="hours"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ fill: '#3b82f6', r: 6 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default WeeklyTrendChart;
