interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={`bg-[#152031] border-2 border-white/5 rounded-lg p-8 shadow-2xl ${className ?? ''}`}>
    {children}
  </div>
);
