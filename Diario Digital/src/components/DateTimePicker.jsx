import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShadcnCalendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DateTimePicker = ({ dateTime, setDateTime, label = "Lembrete" }) => {
  const [date, setDate] = useState(dateTime ? new Date(dateTime) : undefined);
  const [time, setTime] = useState(dateTime ? format(new Date(dateTime), 'HH:mm') : '00:00');

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hours, minutes, 0, 0);
      setDateTime(newDateTime.toISOString());
    } else {
      setDateTime(null);
    }
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (date && newTime) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDateTime = new Date(date);
      newDateTime.setHours(hours, minutes, 0, 0);
      setDateTime(newDateTime.toISOString());
    }
  };

  return (
    <div className="space-y-2">
       <Label className="text-sm font-medium text-foreground flex items-center">
        <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] justify-start text-left font-normal glass-effect border-primary/30 hover:bg-primary/10",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yyyy") : <span>Escolha uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 glass-effect border-primary/20">
            <ShadcnCalendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className="relative w-[120px]">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="pl-10 glass-effect border-primary/30 focus:border-primary"
          />
        </div>
      </div>
      {dateTime && (
        <p className="text-xs text-muted-foreground">
          Lembrete definido para: {format(new Date(dateTime), "dd/MM/yyyy 'às' HH:mm")}
        </p>
      )}
    </div>
  );
};

export default DateTimePicker;