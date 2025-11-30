import { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Tag } from 'lucide-react';
import Header from './Header';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import CategoryList from './CategoryList';
import ReportCharts from './ReportCharts';
import { useExpenses } from '../lib/hooks/useExpenses';
import { useCategories } from '../lib/hooks/useCategories';
// Import interfaces used in this component
import type { Expense, Category } from '@expense-tracker/shared';
import type { ExpenseFilters } from '@expense-tracker/shared';


const Dashboard = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Define filters object explicitly
  const filters: ExpenseFilters = {
    category: filterCategory === 'all' ? undefined : filterCategory,
    startDate: filterStartDate || undefined,
    endDate: filterEndDate || undefined,
  };

  // Use 'data' variable for query results and map it to a local 'expenses' variable
  const { data: expensesData, isLoading: expensesLoading } = useExpenses(filters);
  const expenses = expensesData?.items; // expenses is now an array of Expense[] | undefined

  // Use 'data' variable for query results and map it to a local 'categories' variable
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData; // categories is now an array of Category[] | undefined

  const monthlyTotal = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    // Type 'exp' explicitly as Expense, and 'sum' as number
    return (expenses || [])
      .filter((exp: Expense) => exp.date.startsWith(currentMonth))
      .reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    // Type the accumulator object correctly
    const totals: Record<string, number> = {};
    // Type 'exp' explicitly as Expense
    (expenses || []).forEach((exp: Expense) => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    // Type Object.entries result explicitly as array of tuples [string, number]
    return Object.entries(totals) as [string, number][];
  }, [expenses]); // Dependency changed from expenses?.items to just expenses

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">This Month</span>
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ${monthlyTotal.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Expenses</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {expensesData?.total || 0} {/* Access total from expensesData */}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Categories</span>
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {categories?.length || 0} {/* Access length from categories array */}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex gap-2 flex-wrap">
                <select
                  value={filterCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value)} // Explicitly type 'e'
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {/* Type 'cat' explicitly as Category */}
                  {categories?.map((cat: Category) => ( 
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterStartDate(e.target.value)} // Explicitly type 'e'
                  placeholder="Start Date"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterEndDate(e.target.value)} // Explicitly type 'e'
                  placeholder="End Date"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Expense Form */}
            {showExpenseForm && (
              <ExpenseForm
                onClose={() => setShowExpenseForm(false)}
                onSubmit={(expense) => {
                  // handle adding the new expense
                  console.log('New expense submitted:', expense);
                  setShowExpenseForm(false);
                }}
              />
            )}

            {/* Expense List */}
            <ExpenseList
              onAddExpense={() => setShowExpenseForm(true)}
              isLoading={expensesLoading}
            />
          </div>

          <div className="space-y-6">
            {/* Charts */}
            <ReportCharts categoryTotals={categoryTotals} />

            {/* Categories */}
            <CategoryList isLoading={categoriesLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
