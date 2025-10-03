// app/dashboard/components/CustomSelect.tsx
'use client'

import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { Fragment } from 'react'

type Option = {
    value: string;
    label: string;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
    className = "w-[220px]", // ✅ default fixed width
}: {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder: string;
    className?: string;
}) {
    const selectedOption = options.find(option => option.value === value) || null;

    return (
        <Listbox value={value} onChange={onChange}>
            <div className={`relative ${className}`}>
                {/* Button */}
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-black/30 border-2 border-gray-700 px-5 py-4 pr-10 text-left text-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 backdrop-blur-sm">
                    <span className="block truncate">{selectedOption?.label || placeholder}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>

                {/* Dropdown */}
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-150 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/30 focus:outline-none border border-gray-700">
                        {options.map((option, optionIdx) => (
                            <Listbox.Option
                                key={optionIdx}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 rounded-md transition-all duration-200 ${active ? 'bg-emerald-600/50 text-white' : 'text-gray-300'
                                    }`
                                }
                                value={option.value}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {option.label}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-400">
                                                <Check className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}
