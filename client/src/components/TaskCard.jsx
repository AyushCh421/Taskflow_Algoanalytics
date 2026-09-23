import React from 'react';

const priorityColor = {
  Low: 'bg-gray-100 text-gray-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-red-100 text-red-700',
};

const statusColor = {
  Pending: 'bg-orange-100 text-orange-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
};

function TaskCard({ task, onEdit, onDelete, onView }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 cursor-pointer" onClick={() => onView(task)}>
          {task.title}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor[task.priority]}`}>{task.priority}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
        <span>{task.assignedUser?.name || 'Unassigned'}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[task.status]}`}>{task.status}</span>
        <div className="flex gap-2">
          <button onClick={() => onEdit(task)} className="text-xs text-indigo-600 hover:underline">
            Edit
          </button>
          <button onClick={() => onDelete(task._id)} className="text-xs text-red-500 hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TaskCard);
