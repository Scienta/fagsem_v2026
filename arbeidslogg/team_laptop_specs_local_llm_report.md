# Team Laptop Specification Report for Local LLM Experiments

Generated: 2026-04-24  
Group: 3.3 - Local LLM in practice  
Purpose: document hardware used for local LLM experiments and compare expected constraints.

## PC1 - Lenovo ThinkPad T14 Gen 5

### Summary

| Area | Specification |
| --- | --- |
| Manufacturer / model | Lenovo ThinkPad T14 Gen 5, 21ML003MMX |
| Operating system | Fedora Linux 43, Workstation Edition |
| Kernel | Linux 6.19.13-200.fc43.x86_64 |
| CPU | Intel Core Ultra 7 155U |
| CPU cores / threads | 12 cores / 14 threads |
| CPU max frequency | 4.8 GHz |
| Memory | 32 GB system memory |
| Discrete GPU | None detected |
| Integrated GPU | Intel Meteor Lake-P, Intel Arc / Xe integrated graphics |
| Dedicated VRAM | None, uses shared system memory |
| Storage | 1 TB NVMe SSD, LUKS encrypted |

### CPU

| Field | Value |
| --- | --- |
| Name | Intel Core Ultra 7 155U |
| Architecture | x86-64, Intel hybrid architecture with P-cores and E-cores |
| Physical cores | 12 |
| Threads | 14 |
| Frequency range | 400 MHz to 4,800 MHz |
| L1d cache | 352 KiB, 10 instances |
| L1i cache | 640 KiB, 10 instances |
| L2 cache | 10 MiB, 5 instances |
| L3 cache | 12 MiB, 1 instance |
| Relevant extensions | AVX2, AVX-VNNI, AES-NI, VAES, VNNI |

### Memory

| Area | Total | Used | Free | Available |
| --- | --- | --- | --- | --- |
| RAM | 32 GB | ~7 GB | ~6 GB | ~24 GB |
| Swap | 8 GB | 0 GB | 8 GB | Not reported |

Memory type, speed, and module count were not collected because they require `sudo dmidecode`.

### GPU

| Field | Value |
| --- | --- |
| Name | Intel Meteor Lake-P, Intel Arc / Xe integrated graphics |
| PCI ID | 8086:7d45, rev 08 |
| Kernel driver | i915, with xe also available |
| Dedicated VRAM | None |
| Memory model | Shared system memory |
| GPU frequency | Up to approximately 1,200 MHz, measured via sysfs |

No discrete NVIDIA or AMD GPU was detected.

### Storage

| Device | Size | Type | Model |
| --- | --- | --- | --- |
| nvme0n1 | 953.9 GB | NVMe SSD | Micron MTFDKBA1T0TGD |

The disk is LUKS encrypted. The root partition has approximately 953 GB total capacity, with approximately 100 GB used and 850 GB free.

### Relevance for Local LLM Experiments

This machine has no discrete GPU with dedicated VRAM. Local LLM inference will mainly run on CPU via `llama.cpp` with GGUF models, or through the Intel Xe / SYCL backend with shared system memory.

With 32 GB system memory, the realistic model envelope is:

| Model size | Quantization | Estimated size | Status |
| --- | --- | --- | --- |
| 7B | Q4_K_M | ~4 to 5 GB | Comfortable |
| 13B | Q4_K_M | ~8 to 10 GB | Comfortable |
| 34B | Q4_K_M | ~20 to 22 GB | Possible, but leaves limited memory for OS and tools |
| 70B | Q4_K_M | ~40 to 45 GB | Not realistic on this machine |

Expected CPU inference performance for 7B and 13B quantized models is acceptable, roughly 5 to 15 tokens per second depending on quantization, context length, prompt shape, and runtime. Recommended tools are Ollama or direct `llama.cpp`.

## PC2 - Razer Blade 16

### Summary

| Area | Specification |
| --- | --- |
| Manufacturer / model | Razer Blade 16 - RZ09-0528 |
| System type | x64-based PC |
| Operating system | Windows Home, DisplayVersion 25H2, build 26200.8246 |
| CPU | AMD Ryzen AI 9 365 w/ Radeon 880M |
| CPU cores / threads | 10 cores / 20 logical processors |
| CPU max clock reported by WMI | 2,000 MHz |
| Memory | 64 GiB installed, 63.1 GiB reported usable |
| Discrete GPU | NVIDIA GeForce RTX 5080 Laptop GPU |
| GPU VRAM | 16,303 MiB total, 15,832 MiB free at collection time |
| NVIDIA driver | 596.21 |
| CUDA version reported by nvidia-smi | 13.2 |
| Integrated GPU | AMD Radeon 880M Graphics |
| Primary display resolution | 2560 x 1600 |
| Storage | Lexar SSD NM790 2TB, NVMe SSD |
| Main volume | C: NTFS, 1.84 TiB total, 796 GiB free |
| Python | Python 3.13.3 |
| Git | git version 2.45.1.windows.1 |
| PowerShell | 5.1.26100.8115 |

### CPU

| Field | Value |
| --- | --- |
| Name | AMD Ryzen AI 9 365 w/ Radeon 880M |
| Manufacturer | AuthenticAMD |
| Physical cores | 10 |
| Logical processors | 20 |
| Max clock speed reported by WMI | 2,000 MHz |
| L2 cache | 10,240 KB |
| L3 cache | 24,576 KB |
| Virtualization firmware enabled | True |
| Second-level address translation extensions | False |

### Memory

The system reports four Micron memory entries, each 16 GiB, for 64 GiB installed memory.

| Channel | Manufacturer | Part number | Capacity | Speed |
| --- | --- | --- | --- | --- |
| P0 CHANNEL A | Micron Technology | MT62F4G32D8DV-023 WT | 16 GiB | 8000 MT/s |
| P0 CHANNEL B | Micron Technology | MT62F4G32D8DV-023 WT | 16 GiB | 8000 MT/s |
| P0 CHANNEL C | Micron Technology | MT62F4G32D8DV-023 WT | 16 GiB | 8000 MT/s |
| P0 CHANNEL D | Micron Technology | MT62F4G32D8DV-023 WT | 16 GiB | 8000 MT/s |

Total physical memory reported by Windows: 67,772,461,056 bytes, approximately 63.1 GiB usable.

### GPU

#### NVIDIA Discrete GPU

| Field | Value |
| --- | --- |
| Name | NVIDIA GeForce RTX 5080 Laptop GPU |
| Driver version | 596.21 |
| CUDA version from nvidia-smi | 13.2 |
| Driver model | WDDM |
| VRAM total | 16,303 MiB |
| VRAM free at collection time | 15,832 MiB |
| Temperature at collection time | 50 C |
| GPU utilization at collection time | 0% |
| Power cap from nvidia-smi | 152 W shown in summary; query field returned N/A |
| Active compute process | Ollama was listed as a compute process at collection time |

#### Integrated GPU

| Field | Value |
| --- | --- |
| Name | AMD Radeon(TM) 880M Graphics |
| Driver version | 32.0.13028.3 |
| Driver date | 2025-01-28 |
| Reported adapter RAM | 512 MiB |
| Active resolution | 2560 x 1600 |

### Storage

| Field | Value |
| --- | --- |
| Physical disk | Lexar SSD NM790 2TB |
| Media type | SSD |
| Bus type | NVMe |
| Raw size | 2,048,408,248,320 bytes, approximately 1.86 TiB |
| Health status | Healthy |
| Operational status | OK |

| Volume | File system | Size | Free space | Health |
| --- | --- | --- | --- | --- |
| C: Razer Blade 16 | NTFS | 2,020,393,086,976 bytes, approximately 1.84 TiB | 854,790,410,240 bytes, approximately 796 GiB | Healthy |
| Recovery | NTFS | 26,843,541,504 bytes, approximately 25.0 GiB | 6,482,485,248 bytes, approximately 6.0 GiB | Healthy |
| Winre | NTFS | 1,048,571,904 bytes, approximately 1.0 GiB | 341,200,896 bytes, approximately 325 MiB | Healthy |

### Relevance for Local LLM Experiments

This laptop is well suited for local LLM experiments using GPU acceleration. The most important limit is discrete GPU memory: approximately 16 GiB VRAM. This is typically enough for quantized 7B and 8B models, many 13B or 14B models depending on quantization and context length, and some larger models with heavier quantization or CPU/RAM offloading.

The 64 GiB system memory gives useful headroom for CPU offloading, dataset handling, local vector indexes, and supporting tools such as Ollama, Python scripts, notebooks, or evaluation harnesses. The NVMe SSD has enough free space for multiple model files, but model artifacts should still be tracked because quantized local models can consume many gigabytes each.

## PC3 - MacBook Pro 2021

### Summary

| Area | Specification |
| --- | --- |
| Manufacturer / model | Apple MacBook Pro 18,1, 2021 |
| Operating system | macOS 26.3 Tahoe, build 25D125 |
| CPU / SoC | Apple M1 Pro |
| CPU cores | 10 cores, 8 performance and 2 efficiency |
| GPU | Apple M1 Pro integrated GPU, 16 cores |
| Memory | 32 GB LPDDR5 unified memory, shared by CPU and GPU |
| Dedicated VRAM | None, unified memory architecture |
| Storage | 1 TB Apple SSD AP1024R, NVMe, approximately 37 GB free |
| GPU backend | Metal 4 |

### CPU

| Field | Value |
| --- | --- |
| Chip | Apple M1 Pro |
| CPU cores | 10 |
| Core layout | 8 performance cores and 2 efficiency cores |
| Architecture | Apple Silicon, ARM64 |

### Memory

| Field | Value |
| --- | --- |
| Capacity | 32 GB |
| Type | LPDDR5 unified memory |
| Memory model | Shared by CPU and GPU |

### GPU

| Field | Value |
| --- | --- |
| Name | Apple M1 Pro integrated GPU |
| GPU cores | 16 |
| Dedicated VRAM | None |
| Backend for LLM acceleration | Metal 4 |
| Memory model | Unified memory shared with CPU |

### Storage

| Field | Value |
| --- | --- |
| Disk | Apple SSD AP1024R |
| Capacity | 1 TB |
| Type | NVMe SSD |
| Free space at collection time | Approximately 37 GB |

### Relevance for Local LLM Experiments

The 32 GB unified memory is shared between CPU and GPU. This allows models up to roughly 26 to 28 GB to run fully through the Metal backend in tools such as llama.cpp or Ollama, assuming enough free memory is available.

The M1 Pro has high memory bandwidth, approximately 200 GB/s, which is important for local LLM inference. It should perform well with quantized Q4 and Q5 models. Models larger than roughly 28 GB will spill layers to CPU or fail depending on runtime settings, reducing throughput significantly.

The main practical constraint on this specific machine is storage free space: approximately 37 GB free. That limits how many model files can be stored locally at the same time.

## Cross-Machine Comparison

| Area | PC1 - Lenovo ThinkPad T14 Gen 5 | PC2 - Razer Blade 16 | PC3 - MacBook Pro 2021 |
| --- | --- | --- | --- |
| OS | Fedora Linux 43 | Windows Home 25H2, build 26200.8246 | macOS 26.3 Tahoe |
| CPU | Intel Core Ultra 7 155U | AMD Ryzen AI 9 365 | Apple M1 Pro |
| CPU cores / threads | 12 cores / 14 threads | 10 cores / 20 threads | 10 cores |
| System memory | 32 GB | 64 GiB installed, 63.1 GiB usable | 32 GB unified memory |
| Main GPU | Intel Arc / Xe integrated | NVIDIA GeForce RTX 5080 Laptop GPU | Apple M1 Pro 16-core integrated GPU |
| Dedicated VRAM | None | 16,303 MiB | None, uses unified memory |
| LLM acceleration backend | CPU, Intel Xe / SYCL possible | CUDA | Metal |
| Storage | 1 TB NVMe, ~850 GB free | 2 TB NVMe, ~796 GiB free | 1 TB NVMe, ~37 GB free |
| Best suited model range | 7B to 13B comfortably, 34B possible with care | 7B to 14B comfortably on GPU, larger with quantization/offload | 7B to 13B comfortably, larger quantized models possible within unified memory |
| Main bottleneck | No dedicated VRAM, CPU/shared-memory inference | 16 GB VRAM limits larger GPU-only models | Unified memory and limited free disk space |
| Recommended runtimes | Ollama, llama.cpp | Ollama, llama.cpp, CUDA-enabled runtimes | Ollama, llama.cpp with Metal |

## General Reproducibility Checklist

For each local LLM experiment, record:

- Machine ID, for example PC1, PC2, or PC3.
- Model name and exact quantization format.
- Runtime or framework, for example Ollama, llama.cpp, LM Studio, vLLM, or Transformers.
- Runtime version.
- Acceleration backend, for example CPU, SYCL, CUDA, Metal, Vulkan, or DirectML.
- Context length.
- Batch size and parallel request settings, if applicable.
- Prompt token count and generated token count.
- Wall-clock runtime and tokens per second.
- Peak RAM and VRAM/unified memory if measured.
- Whether other heavy CPU, GPU, or memory processes were running.

## Notes

The three reports were supplied by team members and normalized into one shared Markdown format. Some values are directly measured at collection time, such as free disk space and free GPU memory, and may change between experiments.
