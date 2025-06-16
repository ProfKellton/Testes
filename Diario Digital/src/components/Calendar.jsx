
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Calendar = ({ selectedDate, onDateSelect, notesCount = {}, reminders = {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateYear = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  const getDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 floating-animation"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(-1)}
                className="h-8 w-8 p-0 hover:bg-primary/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold gradient-text min-w-[120px] text-center">
                {monthNames[currentDate.getMonth()]}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(1)}
                className="h-8 w-8 p-0 hover:bg-primary/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateYear(-1)}
                className="h-6 w-6 p-0 text-xs hover:bg-primary/20"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-lg font-semibold text-muted-foreground min-w-[60px] text-center">
                {currentDate.getFullYear()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateYear(1)}
                className="h-6 w-6 p-0 text-xs hover:bg-primary/20"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day, index) => {
          const dateKey = getDateKey(day.date);
          const hasNotes = notesCount[dateKey] > 0;
          const hasReminder = reminders[dateKey] > 0;

          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(day.date)}
              className={`
                calendar-day relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center
                ${day.isCurrentMonth 
                  ? 'text-foreground hover:bg-primary/20' 
                  : 'text-muted-foreground/50'
                }
                ${day.isToday 
                  ? 'bg-primary text-primary-foreground pulse-glow' 
                  : ''
                }
                ${day.isSelected && !day.isToday 
                  ? 'bg-primary/30 text-primary-foreground ring-1 sm:ring-2 ring-primary' 
                  : ''
                }
                ${hasNotes && !day.isToday && !day.isSelected
                  ? 'bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20'
                  : ''
                }
              `}
            >
              {day.date.getDate()}
              {hasNotes && (
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-primary rounded-full flex items-center justify-center opacity-80">
                </div>
              )}
              {hasReminder && (
                 <Bell className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 opacity-90" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Calendar;