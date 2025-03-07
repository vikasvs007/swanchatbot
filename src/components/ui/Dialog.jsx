import React, { Fragment } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import { cn } from '../../lib/utils';

export const Dialog = ({ isOpen, onClose, title, children, className }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog
        as="div"
        className={cn("relative z-50", className)}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
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
              <HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-light-background dark:bg-dark-background p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <HeadlessDialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-light-primary dark:text-dark-primary"
                  >
                    {title}
                  </HeadlessDialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors"
                    aria-label="Close dialog"
                  >
                    <FiX />
                  </button>
                </div>
                <div className="mt-2">
                  {children}
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
};

Dialog.displayName = "Dialog";

export default Dialog; 