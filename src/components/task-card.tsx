'use client';

import { useState, useEffect } from 'react';
import type { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  isDragging: boolean;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete, isDragging }: TaskCardProps) {
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (task.dueDate && !task.completed) {
      setIsOverdue(isPast(new Date(task.dueDate)));
    } else {
      setIsOverdue(false);
    }
  }, [task.dueDate, task.completed]);

  return (
    <Card
      className={cn(
        'mb-4 transition-all duration-300 ease-in-out hover:shadow-lg',
        task.completed ? 'bg-card/60 opacity-60' : 'bg-card',
        isDragging ? 'opacity-50 scale-95 shadow-2xl' : 'opacity-100 scale-100 shadow-md'
      )}
    >
      <CardContent className="p-4 flex items-start gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="mt-1.5 size-5"
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-grow">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              'font-medium text-lg cursor-pointer transition-all',
              task.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'
            )}
          >
            {task.title}
          </label>
          {task.description && (
            <p className={cn('text-sm text-muted-foreground mt-1', task.completed && 'line-through')}>
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 text-sm">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span className={cn(isOverdue && !task.completed && 'text-destructive font-medium')}>
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}
            {isOverdue && !task.completed && <Badge variant="destructive">Overdue</Badge>}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0 size-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(task)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete(task.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
