interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

let tasks: Task[] = [
  {
    id: '1',
    title: 'تنظیم ساختار کلاینت و Apollo',
    description: 'نصب پکیج‌ها و اتصال کلاینت ری‌اکت به GraphQL سرور',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'طراحی بورد کانبان با Tailwind',
    description: 'پیاده‌سازی ستون‌های TODO، IN_PROGRESS و DONE',
    status: 'TODO',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'تعریف اسکیما و تایپ‌های سرور',
    description: 'ایجاد TypeDefs و فیلدهای TaskStatus',
    status: 'DONE',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
  },
];

export const resolvers = {
  Query: {
    tasks: (_parent: unknown, args: { status?: Task['status'] }) => {
      if (args.status) {
        return tasks.filter((t) => t.status === args.status);
      }
      return tasks;
    },

    task: (_parent: unknown, args: { id: string }) => {
      return tasks.find((t) => t.id === args.id) || null;
    },
  },

  Mutation: {
    createTask: (
      _parent: unknown,
      args: { input: { title: string; description?: string; priority?: Task['priority'] } }
    ) => {
      const newTask: Task = {
        id: String(Date.now()),
        title: args.input.title,
        description: args.input.description,
        status: 'TODO',
        priority: args.input.priority || 'MEDIUM',
        createdAt: new Date().toISOString(),
      };

      tasks.unshift(newTask);
      return newTask;
    },

    updateTask: (
      _parent: unknown,
      args: { id: string; input: Partial<Omit<Task, 'id' | 'createdAt'>> }
    ) => {
      const index = tasks.findIndex((t) => t.id === args.id);
      if (index === -1) {
        throw new Error(`تسک با شناسه ${args.id} یافت نشد.`);
      }

      tasks[index] = {
        ...tasks[index],
        ...args.input,
      };

      return tasks[index];
    },

    deleteTask: (_parent: unknown, args: { id: string }) => {
      const initialLength = tasks.length;
      tasks = tasks.filter((t) => t.id !== args.id);
      return tasks.length < initialLength;
    },
  },
};