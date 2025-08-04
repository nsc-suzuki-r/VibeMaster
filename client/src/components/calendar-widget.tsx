import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Schedule } from "@shared/schema";

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());
  
  const { data: schedules = [] } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules", { 
      startDate: startOfCalendar.toISOString(),
      endDate: endOfMonth.toISOString()
    }]
  });

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
  };

  const getDaysInMonth = () => {
    const days = [];
    const daysInMonth = endOfMonth.getDate();
    const firstDayOfWeek = startOfMonth.getDay();
    
    // Add previous month's trailing days
    for (let i = 0; i < firstDayOfWeek; i++) {
      const date = new Date(startOfMonth);
      date.setDate(date.getDate() - (firstDayOfWeek - i));
      days.push({ date, isCurrentMonth: false });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Add next month's leading days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days = 42 cells
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(endOfMonth);
      date.setDate(date.getDate() + i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const hasSchedule = (date: Date) => {
    return schedules.some(schedule => {
      const scheduleDate = new Date(schedule.targetDate);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

  const getScheduleColor = (date: Date) => {
    const schedule = schedules.find(schedule => {
      const scheduleDate = new Date(schedule.targetDate);
      return scheduleDate.toDateString() === date.toDateString();
    });
    
    if (!schedule) return '';
    
    switch (schedule.type) {
      case 'weekly': return 'bg-primary text-white';
      case 'monthly': return 'bg-secondary text-white';
      default: return 'bg-accent text-white';
    }
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const days = getDaysInMonth();

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">今月のスケジュール</h3>
        
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-gray-900">
            {formatMonth(currentDate)}
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-gray-500 p-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                p-1 rounded cursor-pointer transition-colors
                ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${hasSchedule(day.date) 
                  ? getScheduleColor(day.date)
                  : 'hover:bg-gray-100'
                }
              `}
            >
              {day.date.getDate()}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
