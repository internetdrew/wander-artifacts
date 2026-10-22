import { Dialog } from "@base-ui/react/dialog";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { useState, type ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export function ProjectNoteDialog({ title, children }: Props) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const transition: Transition = {
    duration: shouldReduceMotion ? 0 : 0.24,
    ease: [0.165, 0.84, 0.44, 1],
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={`Read notes for ${title}`}
        className="-ml-2 grid size-11 cursor-pointer place-items-center rounded-md outline-0 focus-visible:outline-2 focus-visible:outline-stone-600/50"
      >
        <NoteIcon />
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal keepMounted>
            <Dialog.Backdrop
              className="fixed inset-0 z-50 bg-stone-950/80"
              render={
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0, delay: 0 },
                  }}
                  transition={transition}
                />
              }
            />
            <Dialog.Viewport className="fixed inset-0 z-50 grid place-items-center p-4">
              <Dialog.Popup
                className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col rounded-xl bg-stone-50 p-4 text-neutral-900 shadow-xl ring-[0.5px] ring-stone-400/50 outline-none"
                render={
                  <motion.div
                    style={{ transformOrigin: "50% 100%" }}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            transform:
                              "translateY(calc(50dvh - 2rem)) perspective(600px) rotateX(-55deg) scale(0.06)",
                          }
                    }
                    animate={{
                      opacity: 1,
                      transform:
                        "translateY(0px) perspective(600px) rotateX(0deg) scale(1)",
                      transition: {
                        duration: shouldReduceMotion ? 0 : 0.5,
                        delay: shouldReduceMotion ? 0 : 0.25,
                        ease: [0.76, 0, 0.24, 1],
                        opacity: {
                          duration: shouldReduceMotion ? 0 : 0.1,
                          delay: shouldReduceMotion ? 0 : 0.25,
                        },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0, delay: 0 },
                    }}
                    transition={transition}
                  />
                }
              >
                <Dialog.Close
                  aria-label="Close note"
                  className="absolute top-1.5 right-1.5 grid size-11 shrink-0 cursor-pointer place-items-center rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-stone-600/50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Dialog.Close>
                <div className="mt-2.5 mb-4 flex shrink-0 items-center justify-between gap-4">
                  <Dialog.Title className="font-semibold">
                    Exploring {title}
                  </Dialog.Title>
                </div>
                <div className="min-h-0 overflow-y-auto text-sm leading-relaxed font-[460] text-stone-700 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-6 [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:font-semibold [&_li+li]:mt-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p+p]:mt-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
                  {children}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className="text-[22px] text-stone-700"
                    style={{ fontFamily: '"Caveat Variable", cursive' }}
                  >
                    -Andrew
                  </span>
                </div>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

const NoteIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 stroke-stone-600"
      aria-hidden="true"
    >
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M9.5 8h5" />
      <path d="M9.5 12H16" />
      <path d="M9.5 16H14" />
    </svg>
  );
};
