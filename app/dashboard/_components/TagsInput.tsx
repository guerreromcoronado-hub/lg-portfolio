'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface TagsInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export function TagsInput({ value, onChange, placeholder = 'Escribe y pulsa Enter...' }: TagsInputProps) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (raw: string) => {
        const tag = raw.trim().toLowerCase().replace(/\s+/g, '-');
        if (tag && !value.includes(tag)) {
            onChange([...value, tag]);
        }
        setInputValue('');
    };

    const removeTag = (tag: string) => onChange(value.filter(t => t !== tag));

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    return (
        <div
            className="flex flex-wrap gap-1.5 bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 min-h-[42px] cursor-text focus-within:border-yellow transition-colors"
            onClick={() => inputRef.current?.focus()}
        >
            {value.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-text/[0.07] text-text text-xs font-semibold px-2.5 py-1 rounded-full">
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                        className="text-subtle hover:text-text leading-none -mr-0.5"
                    >
                        ×
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
                className="flex-1 min-w-[120px] bg-transparent text-sm text-text outline-none placeholder:text-subtle/60"
                placeholder={value.length === 0 ? placeholder : ''}
            />
        </div>
    );
}
