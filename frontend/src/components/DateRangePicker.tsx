import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const MONTHS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];
const DAYS_ES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

function parseLocal(str: string): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfMonthWeekday(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

function isBetween(d: Date, start: Date, end: Date): boolean {
  return d > start && d < end;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangePickerProps) => {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHoverDate(null);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const startD = parseLocal(startDate);
  const endD = parseLocal(endDate);

  function handleDayClick(date: Date) {
    const ymd = toYMD(date);

    if (!startD || (startD && endD)) {
      onStartDateChange(ymd);
      onEndDateChange('');
      return;
    }

    if (date < startD) {
      onStartDateChange(ymd);
    } else if (isSameDay(date, startD)) {
      onStartDateChange('');
    } else {
      onEndDateChange(ymd);
      setOpen(false);
      setHoverDate(null);
    }
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(y => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth(m => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(y => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(m => m + 1);
    }
  }

  function formatLabel(): string {
    if (!startD && !endD) return 'Seleccionar rango de fechas';
    const fmt = (d: Date) =>
      d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    if (startD && !endD) return `Desde ${fmt(startD)}`;
    if (startD && endD) return `${fmt(startD)}  →  ${fmt(endD)}`;
    return 'Seleccionar rango de fechas';
  }

  const firstWeekday = startOfMonthWeekday(viewYear, viewMonth);
  const totalDays = daysInMonth(viewYear, viewMonth);
  const cells: (Date | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => new Date(viewYear, viewMonth, i + 1))
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function getDayStyle(date: Date): {
    bg: string;
    text: string;
    ring: boolean;
    muted: boolean;
  } {
    const isStart = startD && isSameDay(date, startD);
    const isEnd = endD && isSameDay(date, endD);
    const isToday = isSameDay(date, today);

    const rangeEnd = endD || hoverDate;
    const inRange =
      startD && rangeEnd && !isStart && !isEnd && (endD || (hoverDate && startD))
        ? isBetween(
            date,
            startD < (rangeEnd as Date) ? startD : (rangeEnd as Date),
            startD < (rangeEnd as Date) ? (rangeEnd as Date) : startD
          )
        : false;

    if (isStart || isEnd) return { bg: 'bg-room-primary', text: 'text-white', ring: false, muted: false };
    if (inRange) return { bg: 'bg-room-primary/20', text: 'text-white', ring: false, muted: false };
    if (isToday) return { bg: '', text: 'text-room-primary', ring: true, muted: false };
    return { bg: '', text: 'text-white/70', ring: false, muted: false };
  }

  function clearRange(e: React.MouseEvent) {
    e.stopPropagation();
    onStartDateChange('');
    onEndDateChange('');
    setHoverDate(null);
  }

  const hasRange = startDate || endDate;

  return (
    <div ref={containerRef} className="relative select-none">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`
          w-full flex items-center gap-3 px-4 py-3
          bg-[#040e1f] border rounded-room text-sm transition-all
          ${open ? 'border-room-primary/60 ring-2 ring-room-primary/20' : 'border-white/10 hover:border-white/20'}
        `}
      >
        <FontAwesomeIcon icon={faCalendarDays} className="text-room-primary shrink-0" />
        <span className={`flex-1 text-left truncate ${hasRange ? 'text-white' : 'text-white/30'}`}>
          {formatLabel()}
        </span>
        {hasRange && (
          <span
            role="button"
            onClick={clearRange}
            className="text-white/20 hover:text-white/60 transition-colors cursor-pointer"
            title="Limpiar fechas"
          >
            <FontAwesomeIcon icon={faXmark} className="text-xs" />
          </span>
        )}
      </button>

      {open && (
        <div className="
          absolute top-full left-0 mt-2 z-[200]
          bg-[#0d1f35] border border-white/10 rounded-room
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          p-5 w-[320px] animate-fade-in
        ">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-room
                         text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>

            <span className="text-sm font-black text-white uppercase tracking-widest">
              {MONTHS_ES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-room
                         text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS_ES.map(d => (
              <div key={d} className="text-center text-[10px] font-black text-white/20 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((date, idx) => {
              if (!date) return <div key={`empty-${idx}`} />;

              const { bg, text, ring, muted } = getDayStyle(date);
              const isStart = startD && isSameDay(date, startD);
              const isEnd = endD && isSameDay(date, endD);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleDayClick(date)}
                  onMouseEnter={() => {
                    if (startD && !endD) setHoverDate(date);
                  }}
                  onMouseLeave={() => setHoverDate(null)}
                  className={`
                    relative h-8 w-full text-xs font-semibold rounded-room
                    transition-all duration-100
                    ${bg} ${text}
                    ${ring ? 'ring-1 ring-room-primary ring-inset' : ''}
                    ${muted ? 'opacity-30' : ''}
                    ${!isStart && !isEnd ? 'hover:bg-white/10' : ''}
                    ${isStart || isEnd ? 'font-black scale-105' : ''}
                  `}
                >
                  {date.getDate()}
                  {isSameDay(date, today) && !isStart && !isEnd && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-room-primary" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5">
            <p className="text-[10px] text-white/25 text-center uppercase tracking-widest">
              {!startD
                ? '① Selecciona fecha inicio'
                : !endD
                  ? '② Ahora selecciona fecha fin'
                  : `${toYMD(startD)}  →  ${toYMD(endD)}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
