import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const H1 = ({ children, className = '', id }: TextProps) => (
  <h1 id={id} className={`text-[22px] font-bold text-slate-900 tracking-tightest leading-tight ${className}`}>
    {children}
  </h1>
);

const H2 = ({ children, className = '', id }: TextProps) => (
  <h2 id={id} className={`text-[16px] font-semibold text-slate-800 tracking-tight leading-snug ${className}`}>
    {children}
  </h2>
);

const Amount = ({ children, className = '', id }: TextProps) => (
  <span id={id} className={`text-[18px] font-bold text-emerald-600 tracking-tighter ${className}`}>
    {children}
  </span>
);

const Label = ({ children, className = '', id }: TextProps) => (
  <span id={id} className={`text-[11px] font-extrabold text-slate-400 tracking-tighter leading-none capitalize ${className}`}>
    {children}
  </span>
);

const Body = ({ children, className = '', id }: TextProps) => (
  <p id={id} className={`text-[14px] font-medium text-slate-600 tracking-tight leading-relaxed ${className}`}>
    {children}
  </p>
);

const Caption = ({ children, className = '', id }: TextProps) => (
  <small id={id} className={`text-[12px] font-normal italic text-slate-400 tracking-tight leading-relaxed ${className}`}>
    {children}
  </small>
);

export const Text = {
  H1,
  H2,
  Amount,
  Label,
  Body,
  Caption,
};
