interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'purple' | 'green' | 'red';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  red: 'from-red-500 to-red-600',
};

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-2">
        <div className="text-3xl">{icon}</div>
        <div className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
          {value}
        </div>
      </div>
      <div className="text-gray-600 text-sm">{title}</div>
    </div>
  );
}

export default StatCard;
