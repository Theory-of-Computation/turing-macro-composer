import { useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PseudocodeEditor, sanitizePseudocode } from "./PseudocodeEditor";
import type { ComposerNodeData } from "@/features/block-editor/useComposerStore";

const DEFAULT_PSEUDOCODE = sanitizePseudocode("copy input");

export const CustomBlockModal = ({
  open,
  onClose,
  onSubmit
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ComposerNodeData) => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inputs, setInputs] = useState(1);
  const [outputs, setOutputs] = useState(1);
  const [pseudocode, setPseudocode] = useState(DEFAULT_PSEUDOCODE);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const cleanedPseudocode = sanitizePseudocode(pseudocode);
    if (!cleanedPseudocode) return;

    onSubmit({
      label: trimmedName,
      description: description.trim() || "Custom macroinstruction",
      ports: { inputs, outputs },
      kind: "custom",
      pseudocode: cleanedPseudocode
    });
    setName("");
    setDescription("");
    setInputs(1);
    setOutputs(1);
    setPseudocode(DEFAULT_PSEUDOCODE);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:max-w-xl xl:max-w-2xl 2xl:max-w-3xl"
          >
            <div className="flex max-h-[82vh] flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 xl:p-10">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl xl:text-2xl 2xl:text-3xl">
                    Create custom block
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base xl:text-lg 2xl:text-xl">
                    Define a reusable macroinstruction block to drop into the composer.
                  </p>
                </div>
                <div className="mt-6 space-y-4 text-sm sm:text-base xl:space-y-5 xl:text-lg 2xl:space-y-6 2xl:text-xl">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:text-sm 2xl:text-base">Name</span>
                    <input
                      value={name}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setName(event.target.value)
                      }
                      className="rounded-xl border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 xl:px-4 xl:py-3 2xl:px-5 2xl:py-3.5"
                      placeholder="Block name"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:text-sm 2xl:text-base">Description</span>
                    <input
                      value={description}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setDescription(event.target.value)
                      }
                      className="rounded-xl border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 xl:px-4 xl:py-3 2xl:px-5 2xl:py-3.5"
                      placeholder="What does this block do?"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-4 xl:gap-6 2xl:gap-8">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:text-sm 2xl:text-base">Inputs</span>
                      <input
                        type="number"
                        min={0}
                        max={4}
                        value={inputs}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setInputs(Number(event.target.value))
                        }
                        className="rounded-xl border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 xl:px-4 xl:py-3 2xl:px-5 2xl:py-3.5"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:text-sm 2xl:text-base">Outputs</span>
                      <input
                        type="number"
                        min={1}
                        max={4}
                        value={outputs}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setOutputs(Number(event.target.value))
                        }
                        className="rounded-xl border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 xl:px-4 xl:py-3 2xl:px-5 2xl:py-3.5"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:text-sm 2xl:text-base">Macroinstructions</span>
                    <PseudocodeEditor value={pseudocode} onChange={setPseudocode} />
                  </div>
                  <div className="space-y-2 rounded-2xl border border-dashed border-slate-300 bg-slate-100/60 p-4 text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 xl:text-sm 2xl:text-base">
                    <p className="font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                      Pseudocode guidelines
                    </p>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>
                        Build instructions using the keyword chips above. Only supported tokens are accepted, so every block will simulate correctly.
                      </li>
                      <li>
                        Combine actions with numbers, e.g. <strong>"add 2"</strong>, <strong>"subtract 4"</strong>, <strong>"multiply 3"</strong>, or flow like <strong>"if input ≥ second then true else false"</strong>.
                      </li>
                      <li>
                        Use <em>"copy"</em>, <em>"duplicate"</em>, or <em>"fan-out"</em> to broadcast values to every output.
                      </li>
                      <li>
                        Keep the first line short—the simulator surfaces it in the run log.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-white/80 p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900/80 xl:gap-3 2xl:gap-4">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Save block
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
