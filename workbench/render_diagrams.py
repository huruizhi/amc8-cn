from __future__ import annotations

import argparse
import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE_ROOT = PROJECT_ROOT.parent / "AMC8历年真题_1985-2026"


def renderer_path(explicit: str | None) -> str:
    if explicit:
        return explicit
    discovered = shutil.which("pdftoppm")
    if discovered:
        return discovered
    raise FileNotFoundError("pdftoppm was not found; pass --pdftoppm explicitly")


def main() -> None:
    parser = argparse.ArgumentParser(description="Render and crop reviewed AMC 8 diagrams")
    parser.add_argument("--source-root", type=Path, default=DEFAULT_SOURCE_ROOT)
    parser.add_argument("--pdftoppm")
    args = parser.parse_args()

    manifest = json.loads((PROJECT_ROOT / "workbench/diagram-crops.json").read_text())
    temp_root = PROJECT_ROOT / "tmp/pdfs/workbench-pages"
    temp_root.mkdir(parents=True, exist_ok=True)

    for entry in manifest:
        year = int(entry["year"])
        question = int(entry["question"])
        page = int(entry["page"])
        source_pdf = args.source_root / str(year) / f"{year}_AMC8_真题.pdf"
        page_prefix = temp_root / f"{year}-page-{page}"
        page_png = page_prefix.with_suffix(".png")

        subprocess.run(
            [
                renderer_path(args.pdftoppm),
                "-f",
                str(page),
                "-l",
                str(page),
                "-singlefile",
                "-r",
                "160",
                "-png",
                str(source_pdf),
                str(page_prefix),
            ],
            check=True,
        )

        output_dir = PROJECT_ROOT / f"public/questions/{year}"
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / f"q{question:02}.png"
        with Image.open(page_png) as page_image:
            cropped = page_image.crop(tuple(entry["box"]))
            cropped.save(output_path, optimize=True)
        print(output_path.relative_to(PROJECT_ROOT))


if __name__ == "__main__":
    main()
