import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Schedule } from "@shared/schema";

export default function WeeklyGoals() {
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get current week's date range
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const { data: weeklyGoals = [] } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules", {
      startDate: startOfWeek.toISOString(),
      endDate: endOfWeek.toISOString()
    }]
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: { title: string; targetDate: string }) => {
      return apiRequest("POST", "/api/schedules", {
        title: goalData.title,
        description: "",
        targetDate: goalData.targetDate,
        type: "weekly",
        isCompleted: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      setNewGoalTitle("");
      setNewGoalDate("");
      setIsDialogOpen(false);
    }
  });

  const toggleGoalMutation = useMutation({
    mutationFn: async ({ goalId, isCompleted }: { goalId: string; isCompleted: boolean }) => {
      return apiRequest("PATCH", `/api/schedules/${goalId}`, { isCompleted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
    }
  });

  const handleCreateGoal = () => {
    if (!newGoalTitle.trim() || !newGoalDate) return;
    createGoalMutation.mutate({
      title: newGoalTitle,
      targetDate: newGoalDate
    });
  };

  const formatDeadline = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "今日まで";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "明日まで";
    } else {
      return date.toLocaleDateString('ja-JP', { weekday: 'long' }) + "まで";
    }
  };

  const getGoalColor = (goal: Schedule) => {
    if (goal.isCompleted) return "bg-success text-white";
    
    const deadline = new Date(goal.targetDate);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 0) return "bg-danger text-white";
    if (daysUntilDeadline <= 1) return "bg-warning text-white";
    return "bg-primary text-white";
  };

  const getBadgeColor = (goal: Schedule) => {
    if (goal.isCompleted) return "bg-white text-success";
    
    const deadline = new Date(goal.targetDate);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 0) return "bg-white text-danger";
    if (daysUntilDeadline <= 1) return "bg-white text-warning";
    return "bg-white text-primary";
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">今週の目標</h3>
        
        <div className="space-y-3">
          {weeklyGoals.map((goal) => (
            <div
              key={goal.id}
              className={`
                flex items-center justify-between p-3 rounded-lg cursor-pointer transition-opacity
                ${getGoalColor(goal)}
                ${goal.isCompleted ? 'opacity-60' : ''}
              `}
              onClick={() => toggleGoalMutation.mutate({ 
                goalId: goal.id, 
                isCompleted: !goal.isCompleted 
              })}
            >
              <span className={`text-sm font-medium ${goal.isCompleted ? 'line-through' : ''}`}>
                {goal.title}
              </span>
              <Badge className={`text-xs ${getBadgeColor(goal)}`}>
                {goal.isCompleted ? '完了' : formatDeadline(new Date(goal.targetDate))}
              </Badge>
            </div>
          ))}
          
          {weeklyGoals.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              今週の目標はまだありません
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              新しい目標を追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しい週間目標を追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">目標</label>
                <Input
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="目標を入力してください"
                />
              </div>
              <div>
                <label className="text-sm font-medium">期限</label>
                <Input
                  type="date"
                  value={newGoalDate}
                  onChange={(e) => setNewGoalDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button 
                  onClick={handleCreateGoal}
                  disabled={!newGoalTitle.trim() || !newGoalDate}
                >
                  追加
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
