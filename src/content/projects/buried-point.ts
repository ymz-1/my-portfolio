import type { ProjectDetail } from "./types";

export const buriedPoint: ProjectDetail = {
  slug: "buried-point",
  title: "埋点上报",
  description: {
    zh: "Windows C++ 客户端埋点 SDK：离线优先、AES 加密本地存储、定时 HTTP 批量上报，4 个 C API 即可完成集成。",
    en: "Windows C++ client analytics SDK — offline-first persistence, AES-encrypted SQLite, timed HTTP batch upload, integrated via 4 C APIs.",
  },
  tags: ["C++", "Windows", "SQLite", "CMake"],
  codeUrl: "https://github.com/ymz-1/anchorpoint",
  coverSrc: "/projects/buried-point.png",
  accent: "from-cyan-500/25 to-blue-600/15",
  featureTags: ["离线优先", "AES-256", "批量上报", "C API", "多线程安全"],
  intro: {
    zh: "BuriedPoint 是一款面向 Windows 桌面应用的客户端埋点 SDK。集成方通过 C ABI 上报自定义事件，SDK 负责本地持久化、加密存储与定时批量 HTTP 上报，保证弱网或离线场景下数据不丢失。\n\n核心设计采用 Persist-first：事件先 AES-256 加密写入 SQLite，再由后台线程每 5 秒批量上传最多 10 条；`Buried_Report` 可在任意线程并发调用，DB 与上报操作在 report_strand 上串行化，保证线程安全。",
    en: "BuriedPoint is a Windows desktop client analytics SDK. Host apps call a stable C ABI to track custom events; the SDK handles encrypted local persistence and timed HTTP batch uploads so data survives offline or flaky networks.\n\nPersist-first: events are AES-256 encrypted into SQLite first, then a background loop uploads up to 10 records every 5 seconds. `Buried_Report` is thread-safe — DB and upload work is serialized on a report strand.",
  },
  techStack: [
    { name: "C++20", role: { zh: "SDK 实现", en: "SDK implementation" } },
    { name: "CMake", role: { zh: "构建", en: "Build system" } },
    { name: "SQLite", role: { zh: "离线持久化", en: "Offline persistence" } },
    { name: "Boost.Asio", role: { zh: "异步 IO / HTTP", en: "Async I/O & HTTP" } },
    { name: "mbedTLS", role: { zh: "AES-256 加密", en: "AES-256 encryption" } },
  ],
  architecture: {
    overview: {
      zh: "分层模块化设计：C API 层 → 核心编排 → 上报管道 / 元数据采集 → SQLite + HTTP + 加密基础设施。",
      en: "Layered modules: C API → core orchestration → report pipeline & metadata → SQLite, HTTP, and crypto infrastructure.",
    },
    frontend: {
      zh: "Host Application 通过 4 个 C 函数集成：`Buried_Create` / `Buried_Start` / `Buried_Report` / `Buried_Destroy`。",
      en: "Host apps integrate via four C calls: `Buried_Create`, `Buried_Start`, `Buried_Report`, `Buried_Destroy`.",
    },
    backend: {
      zh: "BuriedReport 定时拉取 SQLite 队列，HttpReporter 批量 POST JSON 数组；失败保留记录下一周期重传。",
      en: "BuriedReport pulls the SQLite queue on a timer; HttpReporter POSTs JSON arrays — failures stay queued for retry.",
    },
  },
  media: [
    {
      src: "/projects/buried-point.png",
      alt: { zh: "埋点 SDK 架构示意", en: "Analytics SDK architecture" },
      caption: {
        zh: "Persist-first 上报管道与 C API 集成",
        en: "Persist-first pipeline and C API integration",
      },
    },
  ],
  highlights: [
    {
      title: { zh: "离线优先", en: "Offline-first" },
      content: {
        zh: "事件先加密写入 `{work_dir}/buried/buried.db`，网络恢复后自动重传，进程崩溃期间数据仍保留。",
        en: "Events encrypt to `{work_dir}/buried/buried.db` first; the SDK retries when the network returns, surviving process crashes.",
      },
    },
    {
      title: { zh: "AES-256 本地加密", en: "AES-256 at rest" },
      content: {
        zh: "SQLite 内容经 AES-256-CBC + PBKDF2 密钥派生加密，降低本地明文泄露风险。",
        en: "SQLite payloads use AES-256-CBC with PBKDF2 key derivation to reduce plaintext exposure on disk.",
      },
    },
    {
      title: { zh: "定时批量上报", en: "Timed batch upload" },
      content: {
        zh: "每 5 秒触发一次，每批最多 10 条，按 priority 降序优先上传高优先级事件。",
        en: "Every 5 seconds, up to 10 records per batch, sorted by priority descending.",
      },
    },
    {
      title: { zh: "多线程安全", en: "Thread-safe reporting" },
      content: {
        zh: "`Buried_Report` 通过 report_strand 异步投递，调用线程立即返回，可从任意线程并发上报。",
        en: "`Buried_Report` posts work to a report strand and returns immediately — safe from any thread.",
      },
    },
  ],
  quickStart: {
    zh: `# 克隆仓库
git clone https://github.com/ymz-1/anchorpoint.git
cd anchorpoint

# 编译 SDK
mkdir build && cd build
cmake .. -G "Visual Studio 17 2022" -DCMAKE_BUILD_TYPE=Debug
cmake --build . --config Debug

# 启动测试服务器（Rust，监听 :5678）
bin/server.exe

# 集成示例
#include "include/buried.h"
Buried* buried = Buried_Create("D:/buried");
BuriedConfig config = { .host = "localhost", .port = "5678", .topic = "test_topic" };
Buried_Start(buried, &config);
Buried_Report(buried, "button_click", "{\\"button\\":\\"submit\\"}", 0);
Buried_Destroy(buried);`,
    en: `# Clone
git clone https://github.com/ymz-1/anchorpoint.git
cd anchorpoint

# Build SDK
mkdir build && cd build
cmake .. -G "Visual Studio 17 2022" -DCMAKE_BUILD_TYPE=Debug
cmake --build . --config Debug

# Start test server (Rust, :5678)
bin/server.exe

# Integrate
#include "include/buried.h"
Buried* buried = Buried_Create("D:/buried");
BuriedConfig config = { .host = "localhost", .port = "5678", .topic = "test_topic" };
Buried_Start(buried, &config);
Buried_Report(buried, "button_click", "{\\"button\\":\\"submit\\"}", 0);
Buried_Destroy(buried);`,
  },
};

export default buriedPoint;
