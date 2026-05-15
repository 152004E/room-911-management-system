import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/globalcomponent/Input';
import { Button } from '../../components/globalcomponent/Button';
import { Card } from '../../components/globalcomponent/Card';
import { SecurityModal } from '../../components/auth/SecurityModal';
import { faEnvelope, faKey, faRightToBracket, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoginPage = () => {
  const [showSecurityModal, setShowSecurityModal] = useState(true);

  return (
    <>
      {showSecurityModal && (
        <SecurityModal 
          onClose={() => setShowSecurityModal(false)}
          onVerify={(code) => {
            console.log('Verificando código:', code);
            // Aquí iría la lógica de validación
            setShowSecurityModal(false);
          }}
        />
      )}
      <Card>
        <div className="mb-8 text-center">
          <div className="lg:hidden flex justify-center mb-4">
            <div className="w-12 h-12 bg-room-primary/20 rounded flex items-center justify-center border border-room-primary/30">
              <FontAwesomeIcon icon={faShieldHalved} className="text-room-primary text-2xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">Portal de Acceso</h1>
          <p className="text-xs text-white/40 font-medium">Por favor, proporcione las credenciales administrativas</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <Input 
            id="email"
            label="IDENTIFICADOR"
            type="number"
            placeholder="123456789"
            icon={faEnvelope}
            required
          />
          
          <Input 
            id="password"
            label="TOKEN DE SEGURIDAD"
            type="password"
            placeholder="••••••••••••"
            icon={faKey}
            required
          />

          <div className="flex items-center justify-between py-2 border-y border-white/5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded-sm bg-[#081425] border-white/10 text-room-primary focus:ring-room-primary focus:ring-offset-0"
              />
              <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">Mantener sesión</span>
            </label>
            <Link 
              to="/auth/forgot-password" 
              className="text-xs text-room-primary hover:underline underline-offset-4 transition-all"
            >
              Protocolo de recuperación
            </Link>
          </div>

          <Button 
            type="submit"
            text="ESTABLECER CONEXIÓN"
            iconRight={faRightToBracket}
            variant="primary"
            className="w-full py-3 text-xs uppercase tracking-widest font-bold"
          />
        </form>
        <div className="mt-4 text-center">
        <button 
          type="button"
          onClick={() => setShowSecurityModal(true)}
          className="text-[10px] text-room-primary/40 hover:text-room-primary uppercase tracking-widest transition-colors font-bold"
        >
          Solicitar Acceso de Empleado
        </button>
      </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-tighter leading-relaxed">
            ALERTA DE SEGURIDAD: TODAS LAS ACTIVIDADES SON MONITOREADAS Y REGISTRADAS.<br />
            LOS INTENTOS NO AUTORIZADOS ACTIVARÁN EL AISLAMIENTO DEL SISTEMA.
          </p>
        </div>
      </Card>
      
      
    </>
  );
};

export default LoginPage;
