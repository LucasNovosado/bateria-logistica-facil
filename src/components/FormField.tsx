
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
    <div className="space-y-2">
      <Label className="text-slate-700 font-medium flex items-center space-x-2">
        {icon}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
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
      className="rounded-2xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-lg"
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
      className="rounded-2xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-lg"
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
      <SelectTrigger className="rounded-2xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-lg">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-2xl">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-lg">
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
    <div className="flex items-center space-x-3 p-4 rounded-2xl border border-slate-300 bg-white">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="rounded-lg"
      />
      <span className="text-lg text-slate-700">{label}</span>
    </div>
  );
};
