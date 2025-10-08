'use client';

import { deleteBanner } from "./actions";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useTransition } from 'react';
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteBannerButton({ id, imageUrl }: { id: string; imageUrl: string; }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function closeModal() { setIsOpen(false); }
    function openModal() { setIsOpen(true); }

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteBanner(id, imageUrl);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
            }

            closeModal();
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete Banner"
            >
                <Trash2 className="h-5 w-5" />
            </button>

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
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
                                                Delete Banner
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-400">
                                                    Are you sure you want to delete this banner? This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button type="button" className="inline-flex justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700" onClick={closeModal}>
                                            Cancel
                                        </button>
                                        <form action={handleDelete}>
                                            <button
                                                type="submit"
                                                disabled={isPending}
                                                className="inline-flex justify-center items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isPending ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : null}
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