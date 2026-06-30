import React from 'react';

export const TraditionalGrid: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.06] overflow-hidden select-none">
    {/* Grid of traditional wooden window panes ('Hanok Changho-mun' style) */}
    <div className="w-full h-full" style={{
      backgroundImage: `
        linear-gradient(to right, #78350f 2px, transparent 2px),
        linear-gradient(to bottom, #78350f 2px, transparent 2px)
      `,
      backgroundSize: '40px 40px'
    }} />
    <div className="absolute inset-4 border-4 border-amber-900 opacity-30" />
    <div className="absolute inset-6 border-2 border-amber-900 opacity-20" />
  </div>
);

export const FloatingCloud: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 120 60"
    className={`pointer-events-none select-none opacity-25 fill-amber-700/50 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20,40 C10,40 5,30 15,22 C10,12 25,5 35,15 C45,5 65,10 60,25 C70,15 85,25 78,35 C88,35 95,45 85,52 C75,52 70,45 60,45 C50,55 30,52 20,40 Z" />
    <path d="M40,48 C35,48 32,44 36,40 C32,36 38,32 42,36 C46,32 54,34 52,40 C56,36 62,40 59,44 C63,44 66,48 62,51 C58,51 56,48 52,48 C48,52 44,51 40,48 Z" opacity="0.6" />
  </svg>
);

export const DancheongBorder: React.FC = () => (
  <div className="w-full h-2 flex pointer-events-none select-none overflow-hidden opacity-85">
    {/* Staggered row of traditional royal colors: Crimson, Gold, Jade Green, Indigo Navy */}
    {Array.from({ length: 40 }).map((_, i) => {
      const colors = ['bg-[#C82538]', 'bg-[#F2C94C]', 'bg-[#27AE60]', 'bg-[#2F80ED]'];
      const colorClass = colors[i % colors.length];
      return (
        <div
          key={i}
          className={`flex-1 h-full skew-x-12 ${colorClass}`}
          style={{ transformOrigin: '0 0' }}
        />
      );
    })}
  </div>
);

export const HanjiCardFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`relative bg-[#FCF9F2] border border-[#E6DCC3] rounded-2xl shadow-sm p-5 overflow-hidden ${className}`}>
    {/* Hanji paper fibers lookalike effect */}
    <div 
      className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-multiply" 
      style={{
        backgroundImage: `radial-gradient(#8C6239 1px, transparent 0), radial-gradient(#8C6239 1px, transparent 0)`,
        backgroundSize: '8px 8px',
        backgroundPosition: '0 0, 4px 4px'
      }}
    />
    <div className="relative z-10 h-full">{children}</div>
  </div>
);
