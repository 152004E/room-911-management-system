import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: IconDefinition;
  error?: string;
}

export const Input = ({ label, icon, error, className, id, ...props }: InputProps) => {
  return (
    <div className="space-y-1 w-full">
      <label 
        htmlFor={id} 
        className="block font-medium text-xs text-white/50 uppercase tracking-tighter"
      >
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-room-primary transition-colors">
            <FontAwesomeIcon icon={icon} className="text-sm" />
          </div>
        )}
        <input
          id={id}
          className={`w-full bg-room-dark/50 border border-white/10 rounded-md py-2.5 ${icon ? 'pl-10' : 'pl-4'} pr-4 text-white font-sans text-sm placeholder:text-white/10 focus:border-room-primary focus:ring-1 focus:ring-room-primary outline-none transition-all ${className ?? ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-room-error mt-1">{error}</p>}
    </div>
  );
};
