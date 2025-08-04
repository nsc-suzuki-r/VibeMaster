import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LevelCard from "@/components/level-card";
import CalendarWidget from "@/components/calendar-widget";
import WeeklyGoals from "@/components/weekly-goals";
import LearningNotes from "@/components/learning-notes";
import ProgressRing from "@/components/progress-ring";
import { Code, Laptop, CalendarDays, Flame, Plus, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Level, Task, UserStats } from "@shared/schema";

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: levels = [], isLoading: levelsLoading } = useQuery<Level[]>({
    queryKey: ["/api/levels"]
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"]
  });

  const { data: userStats } = useQuery<UserStats>({
    queryKey: ["/api/user-stats"]
  });

  const getCurrentLevel = () => {
    const inProgressLevel = levels.find(level => level.progress > 0 && level.progress < 100);
    if (inProgressLevel) return inProgressLevel;
    
    const completedLevels = levels.filter(level => level.isCompleted);
    const nextLevel = levels.find(level => level.levelNumber === completedLevels.length + 1);
    return nextLevel || levels[0];
  };

  const currentLevel = getCurrentLevel();
  const weeklyCompletedTasks = 5; // This would be calculated from actual data
  const weeklyTotalTasks = 8;

  if (levelsLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Code className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold text-gray-900">バイブコーディング・ロードマップ</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button className="text-primary border-b-2 border-primary pb-2 font-medium">ダッシュボード</button>
              <button className="text-gray-500 hover:text-gray-900 pb-2">スケジュール</button>
              <button className="text-gray-500 hover:text-gray-900 pb-2">学習記録</button>
              <button className="text-gray-500 hover:text-gray-900 pb-2">設定</button>
            </nav>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed inset-x-0 top-0 bg-white shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">メニュー</h2>
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-4">
                <button className="block py-2 text-primary font-medium">ダッシュボード</button>
                <button className="block py-2 text-gray-600">スケジュール</button>
                <button className="block py-2 text-gray-600">学習記録</button>
                <button className="block py-2 text-gray-600">設定</button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Overall Progress */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">全体進捗</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats?.overallProgress || 0}%</p>
                </div>
                <ProgressRing value={userStats?.overallProgress || 0} size={48} />
              </div>
            </CardContent>
          </Card>

          {/* Current Level */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">現在のレベル</p>
                  <p className="text-lg font-bold text-gray-900">レベル{currentLevel?.levelNumber}</p>
                  <p className="text-xs text-gray-500">{currentLevel?.title}</p>
                </div>
                <Laptop className="text-2xl text-secondary" />
              </div>
            </CardContent>
          </Card>

          {/* This Week */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">今週の目標</p>
                  <p className="text-lg font-bold text-gray-900">{weeklyCompletedTasks}/{weeklyTotalTasks}</p>
                  <p className="text-xs text-gray-500">タスク完了</p>
                </div>
                <CalendarDays className="text-2xl text-accent" />
              </div>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">連続学習日数</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats?.streakDays || 0}</p>
                  <p className="text-xs text-gray-500">日継続中</p>
                </div>
                <Flame className="text-2xl text-danger" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Level Cards */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">学習ロードマップ</h2>
              <Button className="bg-primary text-white hover:bg-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                新しいタスク
              </Button>
            </div>

            <div className="space-y-6">
              {levels.map((level) => {
                const levelTasks = tasks.filter(task => task.levelId === level.id);
                return (
                  <LevelCard 
                    key={level.id} 
                    level={level} 
                    tasks={levelTasks}
                  />
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CalendarWidget />
            <WeeklyGoals />
            <LearningNotes />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full bg-primary hover:bg-blue-600 shadow-lg"
        >
          <Plus className="text-xl" />
        </Button>
      </div>
    </div>
  );
}
