"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { rankQuotesForModel, summarizeQuotes } from "@/lib/llm/budget-calc";
import { modelCatalog } from "@/lib/llm/providers";
import { scenarioPresets } from "@/lib/llm/scenario-presets";
import {
  tokensToUnit,
  unitToTokens,
  type InputUnit,
} from "@/lib/llm/tokenEstimate";
import { BudgetComparisonTable } from "@/components/tools/budget/BudgetComparisonTable";
import { BudgetCostChart } from "@/components/tools/budget/BudgetCostChart";
import { BudgetSidebar } from "@/components/tools/budget/BudgetSidebar";
import { BudgetSummaryCards } from "@/components/tools/budget/BudgetSummaryCards";

const DEFAULT_PRESET = scenarioPresets.find((p) => p.id === "long-summary")!;

export function LlmBudgetCalculator() {
  const { pick } = useLanguage();

  const [selectedModelId, setSelectedModelId] = useState(modelCatalog[0].id);
  const [inputUnit, setInputUnit] = useState<InputUnit>("tokens");
  const [inputAmount, setInputAmount] = useState(DEFAULT_PRESET.inputTokens);
  const [outputTokens, setOutputTokens] = useState(DEFAULT_PRESET.outputTokens);
  const [dailyCalls, setDailyCalls] = useState(DEFAULT_PRESET.dailyCalls);
  const [activePresetId, setActivePresetId] = useState<string | null>(
    DEFAULT_PRESET.id,
  );

  const inputTokens = useMemo(
    () => unitToTokens(inputAmount, inputUnit),
    [inputAmount, inputUnit],
  );

  const selectedModel = useMemo(
    () => modelCatalog.find((m) => m.id === selectedModelId) ?? modelCatalog[0],
    [selectedModelId],
  );

  const ranked = useMemo(
    () =>
      rankQuotesForModel(
        selectedModelId,
        inputTokens,
        outputTokens,
        dailyCalls,
      ),
    [selectedModelId, inputTokens, outputTokens, dailyCalls],
  );

  const summary = useMemo(
    () => summarizeQuotes(selectedModel.name, ranked),
    [selectedModel.name, ranked],
  );

  const handleInputUnitChange = (unit: InputUnit) => {
    const tokens = unitToTokens(inputAmount, inputUnit);
    setInputUnit(unit);
    setInputAmount(tokensToUnit(tokens, unit));
    setActivePresetId(null);
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = scenarioPresets.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(presetId);
    setInputAmount(tokensToUnit(preset.inputTokens, inputUnit));
    setOutputTokens(preset.outputTokens);
    setDailyCalls(preset.dailyCalls);
  };

  const handleInputAmountChange = (value: number) => {
    setInputAmount(value);
    setActivePresetId(null);
  };

  const handleOutputTokensChange = (value: number) => {
    setOutputTokens(value);
    setActivePresetId(null);
  };

  const handleDailyCallsChange = (value: number) => {
    setDailyCalls(value);
    setActivePresetId(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-14">
      <Link
        href="/#social"
        className="mb-8 inline-flex text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {pick({ zh: "返回小工具", en: "Back to gadgets" })}
      </Link>

      <header className="mb-8 border-b border-white/10 pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          {pick({ zh: "Pricing Intelligence", en: "Pricing Intelligence" })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {pick({ zh: "LLM 预算计算器", en: "LLM Budget Calculator" })}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {pick({
            zh: "选定模型，对比各服务商/reseller 定价。支持场景预设、用量滑块与 VS 官方折扣分析。",
            en: "Pick a model and compare provider/reseller pricing with scenario presets and official baseline discounts.",
          })}
        </p>
      </header>

      <div className="space-y-6">
        <BudgetSummaryCards summary={summary} />

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <BudgetSidebar
            models={modelCatalog}
            selectedModelId={selectedModelId}
            onModelChange={setSelectedModelId}
            inputUnit={inputUnit}
            onInputUnitChange={handleInputUnitChange}
            inputAmount={inputAmount}
            onInputAmountChange={handleInputAmountChange}
            outputTokens={outputTokens}
            onOutputTokensChange={handleOutputTokensChange}
            dailyCalls={dailyCalls}
            onDailyCallsChange={handleDailyCallsChange}
            activePresetId={activePresetId}
            onPresetSelect={handlePresetSelect}
          />

          <div className="space-y-6">
            <BudgetCostChart
              ranked={ranked}
              modelName={pick(selectedModel.name)}
              dailyCalls={dailyCalls}
            />
            <BudgetComparisonTable ranked={ranked} />
          </div>
        </div>

        <p className="text-center text-[11px] text-muted">
          {pick({
            zh: "价格仅供参考，以各厂商官方文档为准。Reseller 数据为示例占位，请自行维护 providers.ts。",
            en: "Prices are indicative only — check official docs. Reseller entries are samples; maintain providers.ts yourself.",
          })}
        </p>
      </div>
    </div>
  );
}
