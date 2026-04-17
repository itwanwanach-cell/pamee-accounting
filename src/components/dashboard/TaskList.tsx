'use client';

import * as React from 'react';
import { cn, formatDate, getPriorityColor, getStatusColor } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Task } from '@/types';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onComplete?: (taskId: string) => void;
  showCompletedTasks?: boolean;
  className?: string;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onComplete,
  showCompletedTasks = false,
  className,
}) => {
  const filteredTasks = showCompletedTasks
    ? tasks
    : tasks.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');

  const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const sortedTasks = [...filteredTasks].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const getPriorityLabel = (priority: Task['priority']) => {
    const labels = {
      URGENT: 'เร่งด่วน',
      HIGH: 'สูง',
      MEDIUM: 'ปกติ',
      LOW: 'ต่ำ',
    };
    return labels[priority];
  };

  const getStatusLabel = (status: Task['status']) => {
    const labels = {
      TODO: 'รอดำเนินการ',
      IN_PROGRESS: 'กำลังทำ',
      COMPLETED: 'เสร็จสิ้น',
      CANCELLED: 'ยกเลิก',
    };
    return labels[status];
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200', className)}>
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">งานที่ต้องทำ</h3>
        <p className="text-sm text-gray-500 mt-1">
          {filteredTasks.length} รายการที่ต้องดำเนินการ
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {sortedTasks.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
            <p>ไม่มีงานที่ต้องทำ</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'px-6 py-4 hover:bg-gray-50 transition-colors',
                task.status === 'COMPLETED' && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn(
                      'font-medium text-gray-900 truncate',
                      task.status === 'COMPLETED' && 'line-through'
                    )}>
                      {task.title}
                    </h4>
                    <Badge
                      variant={
                        task.priority === 'URGENT' ? 'danger' :
                        task.priority === 'HIGH' ? 'warning' :
                        'default'
                      }
                      size="sm"
                    >
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {task.dueDate && (
                      <span className={cn(
                        'flex items-center gap-1',
                        isOverdue(task.dueDate) && task.status !== 'COMPLETED' && 'text-red-500'
                      )}>
                        {isOverdue(task.dueDate) && task.status !== 'COMPLETED' ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        กำหนด: {formatDate(task.dueDate)}
                      </span>
                    )}
                    <Badge
                      variant={
                        task.status === 'IN_PROGRESS' ? 'info' :
                        task.status === 'COMPLETED' ? 'success' :
                        task.status === 'CANCELLED' ? 'default' :
                        'outline'
                      }
                      size="sm"
                    >
                      {getStatusLabel(task.status)}
                    </Badge>
                  </div>
                </div>

                {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && onComplete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onComplete(task.id)}
                    className="flex-shrink-0"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    เสร็จ
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { TaskList };
