'use client';

import { useState, useMemo } from 'react';
import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { TaskList } from '@/components/task-list';
import { TaskDialog } from '@/components/task-dialog';
import { PlusCircle } from 'lucide-react';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleOpenAddTaskDialog = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  const handleOpenEditTaskDialog = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(undefined);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData } : t));
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        completed: false,
        ...taskData,
      };
      setTasks([newTask, ...tasks]);
    }
    handleCloseDialog();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };
  
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  }, [tasks]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <div>
              <h1 className="text-3xl font-bold text-primary">To-Do App</h1>
              <p className="text-muted-foreground">Organize your life, one task at a time.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <ThemeToggle />
            <Button onClick={handleOpenAddTaskDialog} className="font-semibold">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </header>

        <main>
          <TaskList
            tasks={sortedTasks}
            onEdit={handleOpenEditTaskDialog}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onReorder={setTasks}
          />
        </main>
      </div>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}
