
import React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ date }: DatePickerProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-muted-foreground text-sm">Data de início do relacionamento</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-auto justify-start text-left font-normal cursor-default",
              !date && "text-muted-foreground"
            )}
            disabled={true}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolher data</span>}
          </Button>
        </PopoverTrigger>
      </Popover>
    </div>
  );
}

export default DatePicker;
