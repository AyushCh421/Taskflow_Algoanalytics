import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from '../components/DashboardCard';
import { fetchTasks } from '../store/slices/taskSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, items, status } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks({ limit: 5, sortBy: 'dueDate', order: 'asc' }));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard label="Total Tasks" value={stats.totalTasks} color="text-indigo-600" />
        <DashboardCard label="Pending" value={stats.pending} color="text-orange-500" />
        <DashboardCard label="In Progress" value={stats.inProgress} color="text-blue-500" />
        <DashboardCard label="Completed" value={stats.completed} color="text-green-500" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Upcoming tasks</h2>
        {status === 'loading' && <p className="text-sm text-gray-500">Loading...</p>}
        {status === 'succeeded' && items.length === 0 && (
          <p className="text-sm text-gray-500">No tasks yet — create your first one from the Tasks page.</p>
        )}
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {items.map((task) => (
            <li key={task._id} className="py-2 flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-200">{task.title}</span>
              <span className="text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
