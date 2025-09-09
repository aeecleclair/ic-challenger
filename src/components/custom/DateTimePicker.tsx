"use client";

import * as React from "react";
import { Clock2Icon, CalendarIcon, ChevronDownIcon } from "lucide-react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date?: Date) => void;
  fromDate?: Date;
  toDate?: Date;
  timeLabel?: string;
  timeId?: string;
  id?: string;
}

export function DateTimePicker({
  date,
  setDate,
  fromDate,
  toDate,
  timeLabel = "Heure du match",
  timeId = "match-time",
  id = "datetime",
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (date) {
        // Preserve existing time
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
        newDate.setSeconds(date.getSeconds());
      } else {
        // Set default time to 14:00
        newDate.setHours(14);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
      }
      setDate(newDate);
    } else {
      setDate(undefined);
    }
  };

  const handleTimeChange = (timeString: string) => {
    if (timeString) {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      const currentDate = date || new Date();
      const newDate = new Date(currentDate);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      newDate.setSeconds(seconds || 0);
      setDate(newDate);
    }
  };

  const formatTime = (date?: Date): string => {
    if (!date) return "14:00:00";
    return date.toTimeString().slice(0, 8); // HH:MM:SS format
  };

  const formatDateTime = () => {
    if (!date) {
      return "Sélectionnez une date et heure";
    }

    const dateStr = format(date, "dd/MM/yyyy", { locale: fr });
    const timeStr = format(date, "HH:mm", { locale: fr });
    return `${dateStr} à ${timeStr}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          className="w-full justify-between font-normal h-11"
        >
          <div className="flex items-center gap-2">{formatDateTime()}</div>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Card className="w-fit py-4 border-0 shadow-none">
          <CardContent className="px-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={fr}
              captionLayout="dropdown-buttons"
              fromDate={fromDate ?? new Date(1900)}
              toDate={toDate ?? new Date()}
              initialFocus
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-6 border-t px-4 !pt-4">
            <div className="flex w-full flex-col gap-3">
              <Label htmlFor={timeId}>{timeLabel}</Label>
              <div className="relative flex w-full items-center gap-2">
                <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                <Input
                  id={timeId}
                  type="time"
                  step="1"
                  value={formatTime(date)}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
