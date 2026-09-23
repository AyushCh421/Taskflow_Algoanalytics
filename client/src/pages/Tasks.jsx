import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import useDebounce from '../hooks/useDebounce';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';

export default function Tasks() {
  const dispatch = useDispatch();
  const { items, pagination, status } = useSelector((state) => state.tasks);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  useEffect(() => {
    api.get('/auth/users').then((res) => setUsers(res.data.users)).catch(() => {});
  }, []);

  // useMemo: only recompute the query params object when its inputs change
  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      sortBy,
      order,
      page,
      limit: 9,
    }),
    [debouncedSearch, statusFilter, priorityFilter, sortBy, order, page]
  );

  useEffect(() => {
    dispatch(fetchTasks(queryParams));
  }, [dispatch, queryParams]);

  // useCallback: stable handlers passed down to memoized TaskCard
  const handleEdit = useCallback((task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const handleView = useCallback((task) => setViewingTask(task), []);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm('Delete this task?')) return;
      const result = await dispatch(deleteTask(id));
      if (deleteTask.fulfilled.match(result)) {
        toast.success('Task deleted');
        dispatch(fetchTasks(queryParams));
      } else {
        toast.error(result.payload || 'Failed to delete task');
      }
    },
    [dispatch, queryParams]
  );

  const handleSubmit = async (form) => {
    let result;
    if (editingTask) {
      result = await dispatch(updateTask({ id: editingTask._id, payload: form }));
    } else {
      result = await dispatch(createTask(form));
    }
    if (result.type.endsWith('/fulfilled')) {
      toast.success(editingTask ? 'Task updated' : 'Task created');
      setModalOpen(false);
      setEditingTask(null);
      dispatch(fetchTasks(queryParams));
    } else {
      toast.error(result.payload || 'Something went wrong');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [sb, o] = e.target.value.split('-');
              setSortBy(sb);
              setOrder(o);
            }}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="dueDate-asc">Due date ↑</option>
            <option value="dueDate-desc">Due date ↓</option>
            <option value="createdAt-desc">Newest first</option>
          </select>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
        >
          + New Task
        </button>
      </div>

      {status === 'loading' && <p className="text-sm text-gray-500">Loading tasks...</p>}
      {status === 'succeeded' && items.length === 0 && (
        <p className="text-sm text-gray-500">No tasks match your filters.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-sm rounded-md ${
                p === page ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingTask}
        users={users}
      />

      {viewingTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setViewingTask(null)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{viewingTask.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{viewingTask.description || 'No description'}</p>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>Priority: {viewingTask.priority}</p>
              <p>Status: {viewingTask.status}</p>
              <p>Due: {new Date(viewingTask.dueDate).toLocaleDateString()}</p>
              <p>Assigned to: {viewingTask.assignedUser?.name}</p>
            </div>
            <button
              onClick={() => setViewingTask(null)}
              className="w-full py-2 mt-2 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
