import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportChartsProps {
  categoryTotals: [string, number][];
}

const ReportCharts = ({ categoryTotals }: ReportChartsProps) => {
  const chartData = categoryTotals.map(([category, total]) => ({
    category,
    amount: total,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Top Categories</h3>

      {chartData.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          No data yet. Add expenses to see charts!
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {categoryTotals.map(([category, total]) => {
              const maxTotal = Math.max(...categoryTotals.map(([, t]) => t));
              const percentage = (total / maxTotal) * 100;

              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{category}</span>
                    <span className="font-semibold text-gray-800">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Bar dataKey="amount" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportCharts;