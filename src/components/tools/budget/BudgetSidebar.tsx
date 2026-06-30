"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { ModelCatalogEntry } from "@/lib/llm/providers";
import { scenarioPresets } from "@/lib/llm/scenario-presets";
import type { InputUnit } from "@/lib/llm/tokenEstimate";
import { getInputSliderRange } from "@/lib/llm/tokenEstimate";
import { cn } from "@/lib/utils";

type Props = {
  models: ModelCatalogEntry[];
  selectedModelId: string;
  onModelChange: (id: string) => void;
  inputUnit: InputUnit;
  onInputUnitChange: (unit: InputUnit) => void;
  inputAmount: number;
  onInputAmountChange: (value: number) => void;
  outputTokens: number;
  onOutputTokensChange: (value: number) => void;
  dailyCalls: number;
  onDailyCallsChange: (value: number) => void;
  activePresetId: string | null;
  onPresetSelect: (presetId: string) => void;
};

const UNITS: { id: InputUnit; label: { zh: string; en: string } }[] = [
  { id: "tokens", label: { zh: "Tokens", en: "Tokens" } },
  { id: "words", label: { zh: "词", en: "Words" } },
  { id: "chars", label: { zh: "字符", en: "Chars" } },
];

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-foreground">{label}</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
            }}
            className="w-20 rounded-md border border-white/10 bg-background/60 px-2 py-1 text-right font-mono text-xs text-brand outline-none focus:ring-1 focus:ring-brand/40"
          />
          {suffix && <span className="text-xs text-muted">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand"
      />
      {hint && <p className="mt-1 text-[10px] text-muted">{hint}</p>}
    </div>
  );
}

export function BudgetSidebar({
  models,
  selectedModelId,
  onModelChange,
  inputUnit,
  onInputUnitChange,
  inputAmount,
  onInputAmountChange,
  outputTokens,
  onOutputTokensChange,
  dailyCalls,
  onDailyCallsChange,
  activePresetId,
  onPresetSelect,
}: Props) {
  const { pick } = useLanguage();
  const inputRange = getInputSliderRange(inputUnit);

  const inputLabel =
    inputUnit === "tokens"
      ? pick({ zh: "Input Tokens", en: "Input tokens" })
      : inputUnit === "words"
        ? pick({ zh: "Input 词数", en: "Input words" })
        : pick({ zh: "Input 字符数", en: "Input characters" });

  return (
    <aside className="space-y-5 rounded-2xl border border-white/10 bg-surface/50 p-4 sm:p-5 lg:sticky lg:top-20 lg:self-start">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-brand">
          {pick({ zh: "计算参数", en: "Parameters" })}
        </p>
        <h2 className="mt-1 text-base font-semibold">
          {pick({ zh: "用量配置", en: "Usage config" })}
        </h2>
      </div>

      <div>
        <label className="text-xs font-medium text-muted">
          {pick({ zh: "模型", en: "Model" })}
        </label>
        <select
          value={selectedModelId}
          onChange={(e) => onModelChange(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-background/60 px-3 py-2.5 text-sm outline-none ring-brand/40 focus:ring-2"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {pick(m.name)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-muted">
          {pick({ zh: "计算单位", en: "Input unit" })}
        </label>
        <div className="mt-2 flex gap-1 rounded-lg border border-white/10 bg-background/40 p-1">
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => onInputUnitChange(u.id)}
              className={cn(
                "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                inputUnit === u.id
                  ? "bg-brand/20 text-brand"
                  : "text-muted hover:text-foreground",
              )}
            >
              {pick(u.label)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted">
          {pick({ zh: "场景预设", en: "Scenario presets" })}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {scenarioPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPresetSelect(preset.id)}
              className={cn(
                "rounded-lg border px-2.5 py-2 text-left transition-colors",
                activePresetId === preset.id
                  ? "border-brand/50 bg-brand/10"
                  : "border-white/10 bg-background/30 hover:border-white/20",
              )}
            >
              <p className="text-xs font-medium">{pick(preset.label)}</p>
              <p className="mt-0.5 text-[10px] text-muted line-clamp-1">
                {pick(preset.description)}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t border-white/10 pt-4">
        <SliderField
          label={inputLabel}
          value={inputAmount}
          min={inputRange.min}
          max={inputRange.max}
          step={inputRange.step}
          onChange={onInputAmountChange}
        />
        <SliderField
          label={pick({ zh: "Output Tokens", en: "Output tokens" })}
          value={outputTokens}
          min={128}
          max={8000}
          step={128}
          onChange={onOutputTokensChange}
        />
        <SliderField
          label={pick({ zh: "日调用次数", en: "Daily calls" })}
          value={dailyCalls}
          min={1}
          max={1000}
          step={1}
          onChange={onDailyCallsChange}
          suffix={pick({ zh: "/天", en: "/day" })}
          hint={`→ ${(dailyCalls * 30).toLocaleString()} ${pick({ zh: "次/月", en: "calls/mo" })}`}
        />
      </div>
    </aside>
  );
}
