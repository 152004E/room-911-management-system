import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faBackspace,
  faFingerprint,
  faUserShield,
  faLock,
  faLockOpen,
  faXmark,
  faDoorOpen,
  faCircleCheck,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../globalcomponent/Button';
import api from '../../services/api';
import { FaceCaptureModal } from '../FaceCaptureModal';

interface SecurityModalProps {
  onClose: () => void;
  onVerify?: (code: string) => void;
}

type AccessState = 'IDLE' | 'VALIDATING' | 'FACE_SCAN' | 'GRANTED' | 'DENIED';

export const SecurityModal = ({ onClose }: SecurityModalProps) => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<AccessState>('IDLE');
  const [message, setMessage] = useState('Ingrese su código de identificación');
  const [employeeInfo, setEmployeeInfo] = useState<{name: string, dept: string} | null>(null);
  const [pendingEmployeeId, setPendingEmployeeId] = useState<number | null>(null);

  // Simulación de sonidos
  const playSound = (type: 'SUCCESS' | 'ERROR' | 'KEY') => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    if (type === 'SUCCESS') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.1);
    } else if (type === 'ERROR') {
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(220, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(110, context.currentTime + 0.2);
    } else {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, context.currentTime);
    }

    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  };

  const handleKeyPress = (num: string) => {
    if (status !== 'IDLE') return;
    if (code.length < 4) {
      playSound('KEY');
      setCode(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (status !== 'IDLE') return;
    setCode(prev => prev.slice(0, -1));
  };

  const verifyAccess = async () => {
    if (code.length < 4) return;
    
    setStatus('VALIDATING');
    setMessage('VERIFICANDO CREDENCIALES...');

    try {
      // Usamos el endpoint de acceso de empleado
      const response = await api.post('/auth/employee/access', { internalId: code });
      
      if (response.authorized) {
        setEmployeeInfo({
          name: `${response.employee.firstName} ${response.employee.lastName}`,
          dept: response.employee.departmentName
        });
        setPendingEmployeeId(response.employee.id);
        setStatus('FACE_SCAN');
        setMessage('VERIFICACIÓN BIOMÉTRICA REQUERIDA');
      } else {
        throw new Error(response.message || 'No autorizado');
      }
    } catch (error: any) {
      playSound('ERROR');
      setStatus('DENIED');
      setMessage(error.message || 'ACCESO DENEGADO');
      
      // Reset después de 2 segundos para reintentar
      setTimeout(() => {
        setStatus('IDLE');
        setCode('');
        setMessage('Ingrese su código de identificación');
      }, 2000);
    }
  };

  return (
    <>
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className={`w-full max-w-md bg-[#1f2a3c] border-2 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-all duration-500 ${
        status === 'GRANTED' ? 'border-room-success shadow-[0_0_30px_rgba(16,211,152,0.2)]' :
        status === 'DENIED' ? 'border-room-error shadow-[0_0_30px_rgba(255,89,89,0.2)]' :
        status === 'FACE_SCAN' ? 'border-room-primary shadow-[0_0_30px_rgba(0,180,255,0.15)]' : 'border-white/10'
      }`}>
        
        {/* Header - Terminal Style */}
        <div className="p-4 border-b border-white/5 bg-[#152031] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'GRANTED' ? 'bg-room-success' : 'bg-room-primary'}`}></div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Secure_Entry_System // V2.4</span>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Display Area */}
        <div className="p-8 flex flex-col items-center gap-6 bg-gradient-to-b from-[#040e1f] to-[#1f2a3c]">
          
          {/* Status Icon */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
            status === 'GRANTED' ? 'border-room-success text-room-success bg-room-success/10 scale-110' :
            status === 'DENIED' ? 'border-room-error text-room-error bg-room-error/10 animate-shake' :
            'border-white/10 text-white/20 bg-white/5'
          }`}>
            <FontAwesomeIcon 
              icon={status === 'GRANTED' ? faLockOpen : status === 'DENIED' ? faTriangleExclamation : faLock} 
              className={`text-4xl ${status === 'VALIDATING' ? 'animate-pulse' : ''}`} 
            />
          </div>

          <div className="text-center space-y-1">
            <h3 className={`text-sm font-black uppercase tracking-[0.3em] transition-colors ${
              status === 'GRANTED' ? 'text-room-success' : 
              status === 'DENIED' ? 'text-room-error' : 'text-room-primary'
            }`}>
              {message}
            </h3>
            {status === 'GRANTED' && employeeInfo && (
              <div className="animate-fade-in-up">
                <p className="text-lg font-bold text-white uppercase">{employeeInfo.name}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{employeeInfo.dept}</p>
              </div>
            )}
          </div>

          {/* Pin Display */}
          <div className="w-full flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-12 h-16 rounded-lg border-2 flex items-center justify-center text-2xl font-mono transition-all duration-300 ${
                  code.length > i ? 'border-room-primary text-room-primary bg-room-primary/5 shadow-glow' : 'border-white/5 bg-white/2 text-white/10'
                } ${status === 'GRANTED' ? 'border-room-success text-room-success' : ''} ${status === 'DENIED' ? 'border-room-error text-room-error' : ''}`}
              >
                {code.length > i ? '●' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Interface - Grid or Door Animation */}
        <div className="p-6 bg-[#152031] relative overflow-hidden">
          {status === 'GRANTED' ? (
            <div className="h-[280px] flex flex-col items-center justify-center animate-fade-in">
              <div className="relative">
                <FontAwesomeIcon icon={faDoorOpen} className="text-8xl text-room-success opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-5xl text-room-success animate-bounce" />
                </div>
              </div>
              <p className="mt-6 text-[10px] font-bold text-room-success uppercase tracking-[0.5em] animate-pulse">
                Abriendo Puerta 911...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  type="button"
                  disabled={status !== 'IDLE'}
                  onClick={() => handleKeyPress(num.toString())}
                  className="w-16 h-16 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xl font-bold border border-white/5 transition-all active:scale-90 disabled:opacity-50"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                disabled={status !== 'IDLE'}
                onClick={handleBackspace}
                className="w-16 h-16 rounded-xl bg-room-error/10 hover:bg-room-error/20 text-room-error text-xl border border-white/5 transition-all active:scale-90"
              >
                <FontAwesomeIcon icon={faBackspace} />
              </button>
              <button
                type="button"
                disabled={status !== 'IDLE'}
                onClick={() => handleKeyPress('0')}
                className="w-16 h-16 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xl font-bold border border-white/5 transition-all active:scale-90"
              >
                0
              </button>
              <button
                type="button"
                disabled={status !== 'IDLE' || code.length < 4}
                onClick={verifyAccess}
                className="w-16 h-16 rounded-xl bg-room-primary/20 hover:bg-room-primary/30 text-room-primary text-xl border border-room-primary/20 transition-all active:scale-90 shadow-glow disabled:opacity-20"
              >
                <FontAwesomeIcon icon={faFingerprint} />
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#040e1f] text-center">
          <p className="text-[9px] text-white/20 font-mono uppercase tracking-widest">
            {status === 'GRANTED' ? 'SYSTEM_STATUS: UNLOCKED' : 'SYSTEM_STATUS: SECURED_BY_ROOM911'}
          </p>
        </div>
      </div>
    </div>

    {status === 'FACE_SCAN' && pendingEmployeeId && (
      <FaceCaptureModal
        employeeId={pendingEmployeeId}
        mode="verify"
        onSuccess={() => {
          playSound('SUCCESS');
          setStatus('GRANTED');
          setMessage('ACCESO CONCEDIDO');
          setTimeout(() => {
            navigate('/room-911', { state: { employee: { ...employeeInfo, id: pendingEmployeeId } } });
          }, 1500);
        }}
        onError={(msg) => {
          playSound('ERROR');
          setStatus('DENIED');
          setMessage(msg || 'BIOMETRÍA NO COINCIDE');
          setTimeout(() => {
            setStatus('IDLE');
            setCode('');
            setPendingEmployeeId(null);
            setMessage('Ingrese su código de identificación');
          }, 2000);
        }}
        onClose={() => {
          setStatus('IDLE');
          setCode('');
          setPendingEmployeeId(null);
          setMessage('Ingrese su código de identificación');
        }}
      />
    )}
    </>
  );
};
