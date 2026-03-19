import {
  Dialog as HeadlessUIDialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { IconX } from '@tabler/icons-react'
import { Dispatch, Fragment, ReactNode, SetStateAction } from 'react'

interface IMyDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  children: ReactNode
  title: string
  className?: string
  widthClassName?: string
}

export const Dialog = ({
  open,
  setOpen,
  children,
  title,
  widthClassName = 'max-w-md',
}: IMyDialogProps) => {
  function closeModal() {
    setOpen(false)
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <HeadlessUIDialog
        as="div"
        className="relative z-50 rounded"
        onClose={closeModal}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`glass-panel w-full border border-white/40 p-4 overflow-hidden text-left align-middle transition-all transform shadow-xl ${widthClassName}`}
              >
                <button
                  type="button"
                  className="absolute top-1 right-1 flex items-center justify-center w-8 h-8 rounded-lg transition hover:bg-white/30"
                  onClick={() => setOpen(false)}
                >
                  <IconX className="text-gray-700" />
                </button>
                <DialogTitle
                  as="h3"
                  className="mb-4 pr-8 text-lg font-semibold leading-6 text-gray-900"
                >
                  {title}
                </DialogTitle>
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </HeadlessUIDialog>
    </Transition>
  )
}
