import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faBackspace, faFingerprint, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../globalcomponent/Button';

interface SecurityModalProps {
  onClose: () => void;
  onVerify: (code: string) => void;
}

export const SecurityModal = ({ onClose, onVerify }: SecurityModalProps) => {
  const [code, setCode] = useState('');

  const handleKeyPress = (num: string) => {
    if (code.length < 4) {
      setCode(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setCode(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1f2a3c] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-[#152031] flex items-center gap-4">
          <FontAwesomeIcon icon={faShieldHalved} className="text-room-primary text-xl" />
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Validación de Identidad</h2>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-room-primary uppercase tracking-widest text-center">
              CÓDIGO DE ACCESO
            </label>
            <div className="bg-[#040e1f] border border-white/10 rounded-lg p-4 text-center text-3xl tracking-[0.5em] text-room-primary font-mono shadow-glow h-16 flex items-center justify-center">
              {'*'.repeat(code.length)}
              <span className="animate-pulse ml-1 opacity-50 font-sans">|</span>
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num.toString())}
                className="p-5 rounded-lg bg-[#152031] hover:bg-[#2a3548] text-white text-2xl font-bold border border-white/5 transition-all active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="p-5 rounded-lg bg-[#152031] hover:bg-[#2a3548] text-room-error text-2xl border border-white/5 transition-all active:scale-95"
            >
              <FontAwesomeIcon icon={faBackspace} />
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="p-5 rounded-lg bg-[#152031] hover:bg-[#2a3548] text-white text-2xl font-bold border border-white/5 transition-all active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              className="p-5 rounded-lg bg-[#152031] hover:bg-[#2a3548] text-room-primary text-2xl border border-white/5 transition-all active:scale-95"
            >
              <FontAwesomeIcon icon={faFingerprint} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => onVerify(code)}
              text="VERIFICAR ACCESO"
              iconLeft={faUserShield}
              variant="primary"
              className="w-full py-4 text-lg font-bold shadow-glow"
              disabled={code.length < 4}
            />
            <button 
              type="button"
              onClick={onClose}
              className="text-xs text-white/30 hover:text-white/50 uppercase tracking-widest font-bold transition-colors mt-2"
            >
              Cerrar Validación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
