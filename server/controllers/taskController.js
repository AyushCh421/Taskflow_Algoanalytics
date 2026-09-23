const Task = require('../models/Task');

// @route GET /api/tasks
// Supports: search, status, priority, sort, pagination
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy = 'dueDate', order = 'asc', page = 1, limit = 10 } = req.query;

    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const sortOptions = { [sortBy]: order === 'desc' ? -1 : 1 };
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignedUser', 'name email')
        .populate('createdBy', 'name email')
        .sort(sortOptions)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Task.countDocuments(query),
    ]);

    const [totalTasks, pending, completed, inProgress] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'Pending' }),
      Task.countDocuments({ status: 'Completed' }),
      Task.countDocuments({ status: 'In Progress' }),
    ]);

    res.status(200).json({
      success: true,
      tasks,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
      stats: { totalTasks, pending, completed, inProgress },
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(200).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status, assignedUser } = req.body;
    if (!title || !dueDate || !assignedUser) {
      return res.status(400).json({ success: false, message: 'Title, due date and assigned user are required' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status,
      assignedUser,
      createdBy: req.user._id,
    });

    const populated = await task.populate([
      { path: 'assignedUser', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(201).json({ success: true, task: populated });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(200).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
