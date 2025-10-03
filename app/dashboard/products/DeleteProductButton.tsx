'use client'

import { deleteProduct } from "./actions";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Trash2, AlertTriangle } from "lucide-react";

export default function DeleteProductButton({
    productId,
    className
}: {
    productId: string,
    className?: string
}) {
    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    return (
        <>
            {/* This is the button that will be visible in your table */}
            <button
                type="button"
                onClick={openModal}
                className={className || "text-gray-500 hover:text-red-500 transition-colors"}
                title="Delete Product"
                aria-label="Delete Product"
            >
                <Trash2 size={28} />
            </button>

            {/* This is the Modal that will pop up */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {/* The backdrop, rendered as a fixed sibling to the panel container */}
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black/50 p-6 text-left align-middle shadow-xl transition-all border border-red-500/30">
                                    <div className="flex items-start space-x-4">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                                            <AlertTriangle className="h-6 w-6 text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="flex-1">
                                            <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white">
                                                Delete Product
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-400">
                                                    Are you sure you want to delete this product? This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                        {/* The form is now inside the modal */}
                                        <form action={async (formData: FormData) => { await deleteProduct(formData); }}>
                                            <input type="hidden" name="productId" value={productId} />
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                                            >
                                                Confirm Delete
                                            </button>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}