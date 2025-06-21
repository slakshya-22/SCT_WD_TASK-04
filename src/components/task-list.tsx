'use client';

import { useState } from 'react';
import type { Task } from '@/lib/types';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onReorder: (tasks: Task[]) => void;
}

export function TaskList({ tasks, onEdit, onDelete, onToggleComplete, onReorder }: TaskListProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    if (task.completed) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    setDraggedTaskId(task.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetTask: Task) => {
    e.preventDefault();
    if (targetTask.completed || !draggedTaskId) {
      setDraggedTaskId(null);
      return;
    };

    const activeTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    const draggedIndex = activeTasks.findIndex(t => t.id === draggedTaskId);
    const targetIndex = activeTasks.findIndex(t => t.id === targetTask.id);

    if (draggedIndex > -1 && targetIndex > -1) {
      const reorderedActiveTasks = [...activeTasks];
      const [draggedItem] = reorderedActiveTasks.splice(draggedIndex, 1);
      reorderedActiveTasks.splice(targetIndex, 0, draggedItem);
      onReorder([...reorderedActiveTasks, ...completedTasks]);
    }
    setDraggedTaskId(null);
  };
  
  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-8 bg-card rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold">All caught up!</h3>
        <p className="text-muted-foreground mt-2">You have no tasks. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map(task => (
        <div
          key={task.id}
          draggable={!task.completed}
          onDragStart={e => handleDragStart(e, task)}
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, task)}
          onDragEnd={handleDragEnd}
          className={!task.completed ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
        >
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            isDragging={draggedTaskId === task.id}
          />
        </div>
      ))}
    </div>
  );
}
