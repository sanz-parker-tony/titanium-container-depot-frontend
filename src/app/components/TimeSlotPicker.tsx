import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

interface TimeSlotPickerProps {
  selectedSlot: string;
  onSlotSelect: (slot: string) => void;
  initialSlot?: string; // Cupo previamente seleccionado (para edición)
}

// Mock data: horarios ya ocupados con su cupo
const occupiedSlots: { [key: string]: number[] } = {
  '08:00': [1, 2],
  '09:00': [1],
  '10:30': [1, 2, 3],
  '13:00': [1],
  '14:15': [1, 2],
  '15:30': [1, 2, 3, 4], // Completo
  '16:00': [1],
  '18:00': [1, 2],
  '19:30': [1],
  '21:00': [1, 2, 3],
};

export function TimeSlotPicker({ selectedSlot, onSlotSelect, initialSlot }: TimeSlotPickerProps) {
  // Generate time slots from 08:00 to 23:45 in 15-minute intervals
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 8; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const totalCupos = 4;

  const getOccupiedCupos = (time: string): number[] => {
    const occupied = occupiedSlots[time] || [];
    
    // If editing and there's an initial slot, don't count it as occupied
    if (initialSlot) {
      const [initialTime, initialCupo] = initialSlot.split('-');
      if (initialTime === time) {
        return occupied.filter(cupo => cupo !== parseInt(initialCupo));
      }
    }
    
    return occupied;
  };

  const getNextAvailableCupo = (time: string): number | null => {
    const occupied = getOccupiedCupos(time);
    if (occupied.length >= totalCupos) return null; // All full
    
    // Find first available cupo (must be consecutive)
    for (let i = 1; i <= totalCupos; i++) {
      if (!occupied.includes(i)) {
        return i;
      }
    }
    return null;
  };

  const isOfficeHours = (time: string): boolean => {
    const [hour] = time.split(':').map(Number);
    return hour >= 8 && hour < 18;
  };

  const handleSlotClick = (time: string) => {
    const nextCupo = getNextAvailableCupo(time);
    if (nextCupo !== null) {
      const slotId = `${time}-${nextCupo}`;
      if (selectedSlot === slotId) {
        onSlotSelect(''); // Deselect
      } else {
        onSlotSelect(slotId);
      }
    }
  };

  return (
    <div className="space-y-3">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-sm text-amber-800">
          <strong>Importante:</strong> Solo puede seleccionar UN turno por reserva. 
          El sistema asignará automáticamente el primer cupo disponible.
        </AlertDescription>
      </Alert>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs p-3 bg-gray-50 rounded-md">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
          <span>Horario oficina (08:00-17:00)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-blue-900 border-2 border-blue-900 rounded"></div>
          <span>Fuera de oficina (18:00-23:45)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-red-100 border-2 border-red-300 rounded"></div>
          <span>Ocupado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-green-500 border-2 border-green-600 rounded"></div>
          <span>Seleccionado</span>
        </div>
      </div>
      
      <ScrollArea className="h-[450px] border rounded-md bg-white">
        <div className="p-4">
          {/* Header */}
          <div className="grid grid-cols-5 gap-2 mb-3 sticky top-0 bg-white pb-2 border-b-2 z-10">
            <div className="px-2 py-2 text-sm text-center bg-gray-100 rounded">
              Hora
            </div>
            {[1, 2, 3, 4].map((cupo) => (
              <div key={cupo} className="px-2 py-2 text-sm text-center bg-blue-50 rounded">
                Cupo {cupo}
              </div>
            ))}
          </div>

          {/* Time slots grid */}
          {timeSlots.map((time) => {
            const occupiedCupos = getOccupiedCupos(time);
            const nextAvailable = getNextAvailableCupo(time);
            const officeHours = isOfficeHours(time);
            const isFull = occupiedCupos.length >= totalCupos;

            return (
              <div key={time} className="grid grid-cols-5 gap-2 mb-2">
                {/* Time column */}
                <div className={`
                  px-2 py-3 text-sm text-center rounded flex items-center justify-center
                  ${officeHours 
                    ? 'bg-yellow-50 border-2 border-yellow-200' 
                    : 'bg-blue-900 text-white border-2 border-blue-900'
                  }
                `}>
                  {time}
                </div>
                
                {/* Cupo columns */}
                {[1, 2, 3, 4].map((cupo) => {
                  const isOccupied = occupiedCupos.includes(cupo);
                  const isAvailable = cupo === nextAvailable;
                  const isSelected = selectedSlot === `${time}-${cupo}`;
                  const isInitial = initialSlot === `${time}-${cupo}` && !isSelected;
                  
                  return (
                    <button
                      key={`${time}-${cupo}`}
                      type="button"
                      onClick={() => (isAvailable || isInitial) && handleSlotClick(time)}
                      disabled={!isAvailable && !isInitial}
                      className={`
                        px-2 py-3 rounded-md text-xs transition-all border-2 relative
                        ${
                          isOccupied
                            ? 'bg-red-100 border-red-300 text-red-600 cursor-not-allowed'
                            : isSelected
                            ? 'bg-green-500 text-white border-green-600 hover:bg-green-600 shadow-lg scale-105'
                            : isInitial
                            ? 'bg-green-400 text-white border-green-500 hover:bg-green-500 shadow-md cursor-pointer'
                            : isAvailable
                            ? 'bg-white border-gray-300 hover:border-green-400 hover:bg-green-50 cursor-pointer'
                            : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {isOccupied ? (
                        <span className="text-base">✕</span>
                      ) : isSelected ? (
                        <span className="text-base">✓</span>
                      ) : isInitial ? (
                        <span className="text-base">◉</span>
                      ) : isAvailable ? (
                        <span className="text-base">○</span>
                      ) : (
                        <span className="text-base">-</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {selectedSlot && (
        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-md">
          <p className="text-sm">
            <strong>Turno seleccionado:</strong>
          </p>
          <p className="text-lg text-green-700 mt-1">
            {selectedSlot.split('-')[0]} - Cupo {selectedSlot.split('-')[1]}
          </p>
        </div>
      )}
    </div>
  );
}
