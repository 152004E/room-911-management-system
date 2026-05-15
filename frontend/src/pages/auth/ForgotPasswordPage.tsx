import { Link } from 'react-router-dom';
import { Input } from '../../components/globalcomponent/Input';
import { Button } from '../../components/globalcomponent/Button';
import { Card } from '../../components/globalcomponent/Card';
import { faEnvelope, faPaperPlane, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ForgotPasswordPage = () => {
  return (
    <Card>
      <div className="mb-8 text-center">
        <div className="lg:hidden flex justify-center mb-4">
          <div className="w-12 h-12 bg-room-primary/20 rounded flex items-center justify-center border border-room-primary/30">
            <FontAwesomeIcon icon={faShieldHalved} className="text-room-primary text-2xl" />
          </div>
        </div>
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">Recuperar Acceso</h1>
        <p className="text-xs text-white/40 font-medium px-4">
          Por favor, introduzca su identificador para recibir instrucciones de recuperación.
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <Input 
          id="email"
          label="IDENTIFICADOR"
          type="email"
          placeholder="ej. admin@room911.sh"
          icon={faEnvelope}
          required
        />

        <Button 
          type="submit"
          text="ENVIAR INSTRUCCIONES"
          iconRight={faPaperPlane}
          variant="primary"
          className="w-full py-3 text-xs uppercase tracking-widest font-bold"
        />

        <div className="text-center">
          <Link 
            to="/auth/login" 
            className="text-xs text-room-primary hover:underline underline-offset-4 transition-all uppercase tracking-widest font-medium"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/30 uppercase tracking-tighter leading-relaxed">
          ALERTA DE SEGURIDAD: TODAS LAS ACTIVIDADES SON MONITOREADAS Y REGISTRADAS.<br />
          LOS INTENTOS NO AUTORIZADOS ACTIVARÁN EL AISLAMIENTO DEL SISTEMA.
        </p>
      </div>
    </Card>
  );
};

export default ForgotPasswordPage;
