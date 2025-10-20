import { useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { ComposerNodeData } from "@/features/block-editor/useComposerStore";

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
  const [pseudocode, setPseudocode] = useState("repeat until blank: move right");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      label: name,
      description: description || "Custom macroinstruction",
      ports: { inputs, outputs },
      kind: "custom",
      pseudocode
    });
    setName("");
    setDescription("");
    setInputs(1);
    setOutputs(1);
    setPseudocode("repeat until blank: move right");
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
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:max-w-xl xl:max-w-2xl xl:p-8 2xl:max-w-3xl 2xl:p-10"
          >
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
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:text-sm 2xl:text-base">Macroinstructions</span>
                <textarea
                  value={pseudocode}
                  rows={4}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setPseudocode(event.target.value)
                  }
                  className="rounded-xl border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 xl:px-4 xl:py-3 2xl:px-5 2xl:py-3.5"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2 xl:gap-3 2xl:gap-4">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Save block
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
