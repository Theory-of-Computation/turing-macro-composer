import { useId, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const COMPARATOR_TOKENS = [">=", "≤", "<=", "≥", ">", "<", "==", "=", "!="];

const VALID_WORD_TOKENS = [
  "add",
  "and",
  "blank",
  "clear",
  "condition",
  "copy",
  "decrement",
  "divide",
  "double",
  "duplicate",
  "exponent",
  "exponentiation",
  "else",
  "erase",
  "fan-out",
  "fanout",
  "false",
  "base",
  "factorial",
  "if",
  "increment",
  "input",
  "nonzero",
  "power",
  "positive",
  "remove",
  "reset",
  "second",
  "result",
  "subtract",
  "then",
  "times",
  "true",
  "value",
  "zero",
  "halve",
  "multiply",
  "by"
];

const VALID_WORDS = new Set(VALID_WORD_TOKENS.map((token) => token.toLowerCase()));
const VALID_COMPARATORS = new Set(COMPARATOR_TOKENS);

const TOKEN_GROUPS = [
  {
    label: "Actions",
    tokens: [
      "copy",
      "increment",
      "decrement",
      "erase",
      "clear",
      "add",
      "subtract",
      "multiply",
      "divide",
      "halve",
      "double",
      "power",
      "factorial"
    ]
  },
  {
    label: "Conditions",
    tokens: ["if", "zero", "nonzero", "positive", ">=", "≤", "<=", "≥", ">", "<", "=", "!="]
  },
  {
    label: "References",
    tokens: ["input", "second", "value", "base", "exponent", "then", "else", "true", "false", "result"]
  }
];

const tokenPattern = /(>=|<=|==|!=|≥|≤|>|<|=|\d+|[A-Za-z]+(?:-[A-Za-z]+)?|\s+)/g;

export const sanitizePseudocode = (value: string): string => {
  if (!value) return "";

  const matches = value.match(tokenPattern);
  if (!matches) return "";

  const rebuilt = matches
    .map((token) => {
      if (/^\s+$/.test(token)) {
        return token.replace(/[\t ]+/g, " ");
      }
      if (/^\d+$/.test(token)) {
        return token;
      }
      if (VALID_COMPARATORS.has(token)) {
        return token;
      }
      const normalized = token.toLowerCase();
      if (VALID_WORDS.has(normalized)) {
        return token;
      }
      return "";
    })
    .join("");

  return rebuilt
    .replace(/[\t ]+/g, " ")
    .replace(/ \n/g, "\n")
    .trimStart();
};

interface PseudocodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const PseudocodeEditor = ({ value, onChange, className }: PseudocodeEditorProps) => {
  const id = useId();

  const groupedTokens = useMemo(() => TOKEN_GROUPS, []);

  const handleTextChange = (raw: string) => {
    const sanitized = sanitizePseudocode(raw);
    onChange(sanitized);
  };

  const handleInsert = (token: string) => {
    const separator = value.trim().length === 0 || value.trim().endsWith("\n") ? "" : " ";
    const nextValue = `${value}${separator}${token}`.replace(/\s+/g, (match) => (match.includes("\n") ? "\n" : " "));
    onChange(sanitizePseudocode(nextValue + (token === "if" ? " " : "")));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label htmlFor={id} className="sr-only">
        Pseudocode
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => handleTextChange(event.target.value)}
        onBlur={(event) => handleTextChange(event.target.value)}
        rows={5}
        className="min-h-[160px] w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-sm text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 xl:px-4 xl:py-3 xl:text-base 2xl:px-5 2xl:py-3.5"
        placeholder="Build instructions by inserting keywords"
      />
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
        {groupedTokens.map((group) => (
          <div key={group.label} className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 xl:text-xs">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.tokens.map((token) => (
                <Button
                  key={token}
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleInsert(token)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 hover:bg-primary/10 hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {token}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
