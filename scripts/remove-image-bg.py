"""Remove near-white or near-black background from PNG; feather edges."""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

BgMode = str


def remove_white_bg(
    img: Image.Image,
    *,
    threshold: int = 240,
    feather: int = 20,
) -> Image.Image:
    out = img.convert("RGBA")
    pixels = out.load()
    width, height = out.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue

            min_rgb = min(r, g, b)
            max_rgb = max(r, g, b)

            if min_rgb >= threshold:
                pixels[x, y] = (r, g, b, 0)
                continue

            if min_rgb >= threshold - feather:
                t = (min_rgb - (threshold - feather)) / feather
                new_alpha = int(a * (1 - t))
                pixels[x, y] = (r, g, b, new_alpha)
                continue

            saturation = max_rgb - min_rgb
            brightness = (r + g + b) / 3
            if brightness >= threshold - feather and saturation <= 18:
                t = min(1.0, (brightness - (threshold - feather)) / feather)
                new_alpha = int(a * (1 - t))
                pixels[x, y] = (r, g, b, new_alpha)

    return out


def remove_dark_bg(
    img: Image.Image,
    *,
    threshold: int = 45,
    feather: int = 18,
) -> Image.Image:
    out = img.convert("RGBA")
    pixels = out.load()
    width, height = out.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue

            max_rgb = max(r, g, b)
            min_rgb = min(r, g, b)
            saturation = max_rgb - min_rgb

            if max_rgb <= threshold:
                pixels[x, y] = (r, g, b, 0)
                continue

            if max_rgb <= threshold + feather:
                t = (max_rgb - threshold) / feather
                new_alpha = int(a * t)
                pixels[x, y] = (r, g, b, new_alpha)
                continue

            # Dark desaturated fringe (terminal bg noise near edges)
            brightness = (r + g + b) / 3
            if brightness <= threshold + feather and saturation <= 22:
                t = min(1.0, (brightness - threshold) / feather)
                new_alpha = int(a * max(t, 0.15))
                pixels[x, y] = (r, g, b, new_alpha)

    return out


def process_image(
    input_path: Path,
    output_path: Path,
    *,
    mode: BgMode = "white",
    threshold: int | None = None,
    feather: int | None = None,
) -> None:
    img = Image.open(input_path)

    if mode == "dark":
        result = remove_dark_bg(
            img,
            threshold=threshold if threshold is not None else 45,
            feather=feather if feather is not None else 18,
        )
    else:
        result = remove_white_bg(
            img,
            threshold=threshold if threshold is not None else 240,
            feather=feather if feather is not None else 20,
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    result.save(output_path, "PNG")


def main() -> None:
    parser = argparse.ArgumentParser(description="Remove solid PNG background")
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path, nargs="?")
    parser.add_argument(
        "--mode",
        choices=("white", "dark"),
        default="white",
        help="Background color to remove (default: white)",
    )
    parser.add_argument("--threshold", type=int)
    parser.add_argument("--feather", type=int)
    args = parser.parse_args()

    input_path: Path = args.input
    output_path: Path = args.output or input_path

    if output_path == input_path:
        backup = input_path.with_name(f"{input_path.stem}.source{input_path.suffix}")
        if not backup.exists():
            shutil.copy2(input_path, backup)

    process_image(
        input_path,
        output_path,
        mode=args.mode,
        threshold=args.threshold,
        feather=args.feather,
    )
    print(f"Saved ({args.mode}): {output_path}")


if __name__ == "__main__":
    main()
