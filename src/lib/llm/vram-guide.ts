export const MODEL_SIZES = ["0.5B", "1B", "3B", "7B", "13B", "32B", "70B"] as const;

export type ModelSize = (typeof MODEL_SIZES)[number];

export type CellStatus = "good" | "warn" | "bad";

export type CompatCell = {
  precision?: string;
  vram?: string;
  text?: string;
  status: CellStatus;
};

export type GpuRow = {
  model: string;
  vram: string;
  cells: CompatCell[];
};

export type AppleRow = {
  chip: string;
  gpuCores: string;
  memory: string;
  cells: CompatCell[];
  chipRowSpan?: number;
  gpuCoresRowSpan?: number;
};

function fp16(gb: string): CompatCell {
  return { precision: "FP16", vram: `${gb}GB`, status: "good" };
}

function int8(gb: string): CompatCell {
  return { precision: "INT8", vram: `${gb}GB`, status: "warn" };
}

function int4(gb: string): CompatCell {
  return { precision: "INT4", vram: `${gb}GB`, status: "warn" };
}

function na(): CompatCell {
  return { text: "X", status: "bad" };
}

/** 0.5B / 1B / 3B — FP16 2GB / 3GB / 8GB */
const S3 = [fp16("2"), fp16("3"), fp16("8")] as const;

/** 16GB 档：7B INT8，13B INT4 */
const NVIDIA_16GB: CompatCell[] = [
  ...S3,
  int8("10"),
  int4("9"),
  na(),
  na(),
];

/** 24GB 档：7B FP16，13B INT8，32B INT4 */
const NVIDIA_24GB: CompatCell[] = [
  ...S3,
  fp16("19"),
  int8("17"),
  int4("21"),
  na(),
];

/** 32GB 档：同 24GB */
const NVIDIA_32GB = NVIDIA_24GB;

/** 12GB 档：同 16GB */
const NVIDIA_12GB = NVIDIA_16GB;

/** 10GB 档：同 16GB */
const NVIDIA_10GB = NVIDIA_16GB;

/** 8GB 档：7B INT4 */
const NVIDIA_8GB: CompatCell[] = [
  ...S3,
  int4("5"),
  na(),
  na(),
  na(),
];

/** 6GB 档：3B INT8，7B INT4 */
const NVIDIA_6GB: CompatCell[] = [
  fp16("2"),
  fp16("3"),
  int8("4"),
  int4("5"),
  na(),
  na(),
  na(),
];

export const nvidiaGpus: GpuRow[] = [
  { model: "RTX 5090 D", vram: "32GB", cells: NVIDIA_32GB },
  { model: "RTX 5080", vram: "16GB", cells: NVIDIA_16GB },
  { model: "RTX 5070", vram: "12GB", cells: NVIDIA_12GB },
  { model: "RTX 4090", vram: "24GB", cells: NVIDIA_24GB },
  { model: "RTX 4080", vram: "16GB", cells: NVIDIA_16GB },
  { model: "RTX 4060", vram: "8GB", cells: NVIDIA_8GB },
  { model: "RTX 3080", vram: "10GB", cells: NVIDIA_10GB },
  { model: "RTX 3060", vram: "12GB", cells: NVIDIA_12GB },
  { model: "RTX 2080", vram: "8GB", cells: NVIDIA_8GB },
  { model: "RTX 2060", vram: "6GB", cells: NVIDIA_6GB },
  { model: "GTX 1080", vram: "8GB", cells: NVIDIA_8GB },
  { model: "GTX 1060", vram: "6GB", cells: NVIDIA_6GB },
];

type AppleGroup = {
  chip: string;
  gpuCores: string;
  rows: { memory: string; cells: CompatCell[] }[];
};

const appleGroups: AppleGroup[] = [
  {
    chip: "M4 Max",
    gpuCores: "32/40",
    rows: [
      {
        memory: "128GB",
        cells: [...S3, fp16("19"), fp16("34"), fp16("84"), int8("91")],
      },
      {
        memory: "64GB",
        cells: [...S3, fp16("19"), fp16("34"), int8("42"), int4("46")],
      },
      {
        memory: "48GB",
        cells: [...S3, fp16("19"), fp16("34"), int8("42"), int4("46")],
      },
      {
        memory: "36GB",
        cells: [...S3, fp16("19"), fp16("34"), int4("21"), na()],
      },
    ],
  },
  {
    chip: "M4 Pro",
    gpuCores: "16/20",
    rows: [
      {
        memory: "64GB",
        cells: [...S3, fp16("19"), fp16("34"), int8("42"), int4("46")],
      },
      {
        memory: "48GB",
        cells: [...S3, fp16("19"), fp16("34"), int8("42"), int4("46")],
      },
      {
        memory: "24GB",
        cells: [...S3, fp16("19"), int8("17"), int4("21"), na()],
      },
    ],
  },
  {
    chip: "M4",
    gpuCores: "8/10",
    rows: [
      {
        memory: "32GB",
        cells: [...S3, fp16("19"), int8("17"), int4("21"), na()],
      },
      {
        memory: "24GB",
        cells: [...S3, fp16("19"), int8("17"), int4("21"), na()],
      },
      {
        memory: "16GB",
        cells: [...S3, int8("10"), int4("9"), na(), na()],
      },
      {
        memory: "8GB",
        cells: [...S3, int4("5"), na(), na(), na()],
      },
    ],
  },
  {
    chip: "M3 Max",
    gpuCores: "30/40",
    rows: [
      {
        memory: "96GB",
        cells: [...S3, fp16("19"), fp16("34"), fp16("84"), int8("91")],
      },
      {
        memory: "64GB",
        cells: [...S3, fp16("19"), fp16("34"), int8("42"), int4("46")],
      },
      {
        memory: "48GB",
        cells: [...S3, fp16("19"), fp16("34"), int8("42"), int4("46")],
      },
      {
        memory: "36GB",
        cells: [...S3, fp16("19"), fp16("34"), int4("21"), na()],
      },
    ],
  },
  {
    chip: "M3 Pro",
    gpuCores: "14/18",
    rows: [
      {
        memory: "36GB",
        cells: [...S3, fp16("19"), fp16("34"), int4("21"), na()],
      },
      {
        memory: "18GB",
        cells: [...S3, int8("10"), int8("17"), na(), na()],
      },
    ],
  },
  {
    chip: "M3",
    gpuCores: "8/10",
    rows: [
      {
        memory: "24GB",
        cells: [...S3, fp16("19"), int8("17"), int4("21"), na()],
      },
      {
        memory: "16GB",
        cells: [...S3, int8("10"), int4("9"), na(), na()],
      },
      {
        memory: "8GB",
        cells: [...S3, int4("5"), na(), na(), na()],
      },
    ],
  },
  {
    chip: "M2 Ultra",
    gpuCores: "60/76",
    rows: [
      {
        memory: "192GB",
        cells: [...S3, fp16("19"), fp16("34"), fp16("84"), fp16("182")],
      },
      {
        memory: "128GB",
        cells: [...S3, fp16("19"), fp16("34"), fp16("84"), int8("91")],
      },
      {
        memory: "64GB",
        cells: [...S3, fp16("19"), fp16("34"), int8("42"), int4("46")],
      },
    ],
  },
  {
    chip: "M2 Max",
    gpuCores: "30/38",
    rows: [
      {
        memory: "96GB",
        cells: [...S3, fp16("19"), fp16("34"), fp16("84"), int8("91")],
      },
      {
        memory: "64GB",
        cells: [...S3, fp16("19"), fp16("34"), int8("42"), int4("46")],
      },
      {
        memory: "32GB",
        cells: [...S3, fp16("19"), int8("17"), int4("21"), na()],
      },
    ],
  },
  {
    chip: "M2 Pro",
    gpuCores: "16/19",
    rows: [
      {
        memory: "32GB",
        cells: [...S3, fp16("19"), int8("17"), int4("21"), na()],
      },
      {
        memory: "16GB",
        cells: [...S3, int8("10"), int4("9"), na(), na()],
      },
    ],
  },
  {
    chip: "M1 Ultra",
    gpuCores: "48/64",
    rows: [
      {
        memory: "128GB",
        cells: [...S3, fp16("19"), fp16("34"), fp16("84"), int8("91")],
      },
      {
        memory: "64GB",
        cells: [...S3, fp16("19"), fp16("34"), int8("42"), int4("46")],
      },
    ],
  },
  {
    chip: "M1 Max",
    gpuCores: "24/32",
    rows: [
      {
        memory: "64GB",
        cells: [...S3, fp16("19"), fp16("34"), int8("42"), int4("46")],
      },
      {
        memory: "32GB",
        cells: [...S3, fp16("19"), int8("17"), int4("21"), na()],
      },
    ],
  },
  {
    chip: "M1 Pro",
    gpuCores: "14/16",
    rows: [
      {
        memory: "32GB",
        cells: [...S3, fp16("19"), int8("17"), int4("21"), na()],
      },
      {
        memory: "16GB",
        cells: [...S3, int8("10"), int4("9"), na(), na()],
      },
    ],
  },
  {
    chip: "M1",
    gpuCores: "7/8",
    rows: [
      {
        memory: "16GB",
        cells: [...S3, int8("10"), int4("9"), na(), na()],
      },
      {
        memory: "8GB",
        cells: [...S3, int4("5"), na(), na(), na()],
      },
    ],
  },
];

export const appleSiliconRows: AppleRow[] = appleGroups.flatMap((group) =>
  group.rows.map((row, index) => ({
    chip: group.chip,
    gpuCores: group.gpuCores,
    memory: row.memory,
    cells: row.cells,
    chipRowSpan: index === 0 ? group.rows.length : undefined,
    gpuCoresRowSpan: index === 0 ? group.rows.length : undefined,
  })),
);

export const referenceNotes = {
  zh: [
    {
      title: "精度说明",
      body: "FP32：全精度浮点推理（4 字节/参数）；FP16：半精度浮点推理（2 字节/参数）；INT8：8 位量化推理（1 字节/参数）；INT4：4 位量化推理（0.5 字节/参数）。",
    },
    {
      title: "显存估算",
      body: "显存需求 = 模型参数量 × 精度系数 × (1 + KV Cache 开销)。运行时开销（KV Cache 等）约 30%–50%。",
    },
    {
      title: "快速估算参考",
      body: "FP32：显存(GB) ≈ 参数量(B) × 4；FP16：≈ × 2.6；INT8：≈ × 1.3；INT4：≈ × 0.65。",
    },
    {
      title: "架构特性说明",
      body: "NVIDIA 显卡：专用显存、Tensor 核心加速、CUDA 生态完善。Apple Silicon：统一内存架构、Metal 性能着色器、CoreML 框架优化。",
    },
    {
      title: "苹果芯片补充说明",
      body: "统一内存架构 (UMA) 让 CPU 和 GPU 共享同一内存池，无需数据复制；Metal 性能着色器支持 16 位和 8 位量化推理；CoreML 框架提供本地模型优化和加速；实际性能受限于软件生态支持和优化程度。",
    },
  ],
  en: [
    {
      title: "Precision",
      body: "FP32: full float (4 B/param); FP16: half float (2 B/param); INT8: 8-bit quant (1 B/param); INT4: 4-bit quant (0.5 B/param).",
    },
    {
      title: "VRAM estimate",
      body: "VRAM = params × precision factor × (1 + KV cache overhead). Runtime overhead (KV cache, etc.) ~30–50%.",
    },
    {
      title: "Quick reference",
      body: "FP32: GB ≈ B × 4; FP16: ≈ × 2.6; INT8: ≈ × 1.3; INT4: ≈ × 0.65.",
    },
    {
      title: "Architecture",
      body: "NVIDIA: dedicated VRAM, Tensor cores, CUDA ecosystem. Apple Silicon: unified memory, Metal shaders, CoreML optimization.",
    },
    {
      title: "Apple Silicon notes",
      body: "UMA shares one memory pool for CPU/GPU; Metal supports 16/8-bit quant inference; CoreML optimizes local models; performance depends on software ecosystem maturity.",
    },
  ],
};

export const referenceFootnote = {
  zh: "* 实际运行显存可能因具体实现、批处理大小、上下文长度等因素而变化",
  en: "* Actual VRAM usage may vary with implementation, batch size, context length, and other factors",
};
