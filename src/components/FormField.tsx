
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FormFieldProps {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField = ({ label, icon, required, children }: FormFieldProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-cyan-400 font-medium flex items-center space-x-2 text-lg">
        {icon}
        <span>{label}</span>
        {required && <span className="text-yellow-400">*</span>}
      </Label>
      {children}
    </div>
  );
};

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export const TextInput = ({ value, onChange, placeholder, type = 'text' }: TextInputProps) => {
  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-2xl border-2 border-gray-700 bg-gray-800/50 focus:border-cyan-400 focus:ring-cyan-400/20 h-14 text-lg text-white placeholder:text-gray-400 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-cyan-400/20"
    />
  );
};

interface TextAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const TextAreaInput = ({ value, onChange, placeholder, rows = 3 }: TextAreaInputProps) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="rounded-2xl border-2 border-gray-700 bg-gray-800/50 focus:border-cyan-400 focus:ring-cyan-400/20 text-lg text-white placeholder:text-gray-400 shadow-lg backdrop-blur-sm transition-all duration-300"
    />
  );
};

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
}

export const SelectInput = ({ value, onChange, placeholder, options }: SelectInputProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="rounded-2xl border-2 border-gray-700 bg-gray-800/50 focus:border-cyan-400 focus:ring-cyan-400/20 h-14 text-lg text-white shadow-lg backdrop-blur-sm transition-all duration-300">
        <SelectValue placeholder={placeholder} className="text-white" />
      </SelectTrigger>
      <SelectContent className="rounded-2xl bg-gray-800 border-gray-700">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-lg text-white hover:bg-gray-700 focus:bg-gray-700">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface CheckboxInputProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const CheckboxInput = ({ checked, onChange, label }: CheckboxInputProps) => {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-2xl border-2 border-gray-700 bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="rounded-lg border-2 border-gray-600 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400"
      />
      <span className="text-lg text-white">{label}</span>
    </div>
  );
};
