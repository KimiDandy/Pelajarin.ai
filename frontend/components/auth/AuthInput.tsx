'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  icon: React.ReactNode;
  validate?: (value: string) => boolean;
  validationMessage?: string;
}

export function AuthInput({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  autoComplete,
  icon,
  validate,
  validationMessage = 'Format tidak valid'
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    if (validate && value) {
      setIsValid(validate(value));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (validate && touched) {
      setIsValid(validate(e.target.value));
    }
  };

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          {icon}
        </div>
        
        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            "w-full px-4 py-3 pl-12 pr-12 border rounded-xl bg-background/20 text-foreground placeholder-neutral-400",
            "focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300",
            "disabled:opacity-50 backdrop-blur-sm",
            touched && isValid === true && "border-green-500/50 focus:border-green-500",
            touched && isValid === false && "border-red-500/50 focus:border-red-500"
          )}
        />

        {/* Validation icon */}
        {touched && isValid !== null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </motion.div>
        )}

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Validation message */}
      {touched && isValid === false && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-400"
        >
          {validationMessage}
        </motion.p>
      )}
    </div>
  );
}
