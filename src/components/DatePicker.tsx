
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
import { getWeddingAnniversaryName } from "@/utils/weddingAnniversary";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  // Calcular o número de anos desde a data de início
  const currentDate = new Date();
  const yearDiff = currentDate.getFullYear() - date.getFullYear();
  const monthDiff = currentDate.getMonth() - date.getMonth();
  const dateDiff = currentDate.getDate() - date.getDate();
  
  // Ajustar para o caso em que ainda não se completou um ano inteiro
  let years = (monthDiff < 0 || (monthDiff === 0 && dateDiff < 0))
    ? yearDiff - 1
    : yearDiff;
  
  // Calcular meses quando for menos de um ano
  let months = 0;
  if (years === 0) {
    months = monthDiff >= 0 ? monthDiff : 12 + monthDiff;
    // Ajustar para o caso em que ainda não se completou um mês inteiro
    if (dateDiff < 0) {
      months = months > 0 ? months - 1 : 0;
    }
  }
  
  // Obter o nome das bodas
  const anniversaryName = getWeddingAnniversaryName(years, months);
  
  return (
    <div className="flex flex-col items-center space-y-4">
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
      
      <div className="w-full max-w-xs mx-auto">
        <div className="bg-gradient-to-r from-love-pink/30 to-love-purple/30 rounded-lg p-3 text-center border border-primary/20 shadow-sm">
          <p className="text-sm text-muted-foreground">Celebração atual</p>
          <h3 className="text-lg font-semibold text-primary">{anniversaryName}</h3>
        </div>
      </div>
    </div>
  );
}

export default DatePicker;
