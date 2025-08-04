import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, ChevronDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import type { Level, Task } from "@shared/schema";

interface LevelCardProps {
  level: Level;
  tasks: Task[];
}

const colorClasses = {
  success: "bg-success text-white",
  secondary: "bg-secondary text-white", 
  primary: "bg-primary text-white",
  accent: "bg-accent text-white",
  warning: "bg-warning text-white",
  danger: "bg-danger text-white",
  purple: "bg-purple text-white"
};

const progressColorClasses = {
  success: "bg-success",
  secondary: "bg-secondary",
  primary: "bg-primary", 
  accent: "bg-accent",
  warning: "bg-warning",
  danger: "bg-danger",
  purple: "bg-purple"
};

const borderColorClasses = {
  success: "border-l-success",
  secondary: "border-l-secondary",
  primary: "border-l-primary",
  accent: "border-l-accent", 
  warning: "border-l-warning",
  danger: "border-l-danger",
  purple: "border-l-purple"
};

export default function LevelCard({ level, tasks }: LevelCardProps) {
  const [expanded, setExpanded] = useState(level.progress > 0 && level.progress < 100);
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) => {
      return apiRequest("PATCH", `/api/tasks/${taskId}`, { isCompleted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/levels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-stats"] });
    }
  });

  const handleTaskToggle = (taskId: string, isCompleted: boolean) => {
    updateTaskMutation.mutate({ taskId, isCompleted });
  };

  const getStatusBadge = () => {
    if (level.isCompleted) {
      return <Badge className="bg-success text-white">完了</Badge>;
    } else if (level.progress > 0) {
      return <Badge className="bg-secondary text-white">進行中</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-gray-200 text-gray-600">未開始</Badge>;
    }
  };

  const shouldShowExpanded = expanded && level.progress > 0;
  const shouldShowCollapsed = !expanded && (level.progress === 0 || level.isCompleted);

  if (shouldShowCollapsed) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3",
                level.isCompleted ? "bg-success" : "bg-gray-400"
              )}>
                {level.levelNumber}
              </div>
              <h4 className="font-medium text-gray-900">{level.title}</h4>
              <span className="ml-3">
                {getStatusBadge()}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setExpanded(true)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "border border-gray-200 overflow-hidden",
      level.progress > 0 && level.progress < 100 && `border-l-4 ${borderColorClasses[level.color as keyof typeof borderColorClasses]}`
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3",
              colorClasses[level.color as keyof typeof colorClasses]
            )}>
              {level.levelNumber}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{level.title}</h3>
            <span className="ml-3">
              {getStatusBadge()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {level.isCompleted ? (
              <CheckCircle className="text-success text-xl" />
            ) : (
              <span className={cn(
                "text-sm font-medium",
                `text-${level.color}`
              )}>
                {level.progress}%
              </span>
            )}
            {shouldShowExpanded && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setExpanded(false)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              progressColorClasses[level.color as keyof typeof progressColorClasses]
            )}
            style={{ width: `${level.progress}%` }}
          />
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <label key={task.id} className="flex items-center cursor-pointer">
              <Checkbox
                checked={task.isCompleted}
                onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                className="mr-3"
              />
              <span className={cn(
                "text-sm",
                task.isCompleted ? "text-gray-600 line-through" : "text-gray-700"
              )}>
                {task.title}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
