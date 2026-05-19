import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/globalcomponent/Input';
import { Button } from '../../components/globalcomponent/Button';
import { Card } from '../../components/globalcomponent/Card';
import { SecurityModal } from '../../components/auth/SecurityModal';
import { faEnvelope, faKey, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authApi } from '../../services/api';

const LoginPage = () => {
  const [showSecurityModal, setShowSecurityModal] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login({ identifier, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Credenciales inválidas. Acceso denegado.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <img src="/logo.png" alt="ROOM 911" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">Portal de Acceso</h1>
          <p className="text-xs text-white/40 font-medium">Por favor, proporcione las credenciales administrativas</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-room-error/10 border border-room-error text-room-error text-xs p-3 rounded text-center font-bold tracking-widest uppercase">
              {error}
            </div>
          )}
          <Input 
            id="identifier"
            label="IDENTIFICADOR"
            type="text"
            placeholder="admin"
            icon={faEnvelope}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          
          <Input 
            id="password"
            label="TOKEN DE SEGURIDAD"
            type="password"
            placeholder="••••••••••••"
            icon={faKey}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            text={isLoading ? "AUTENTICANDO..." : "ESTABLECER CONEXIÓN"}
            iconRight={faRightToBracket}
            variant="primary"
            className="w-full py-3 text-xs uppercase tracking-widest font-bold"
            disabled={isLoading}
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
