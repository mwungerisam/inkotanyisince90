from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
src = root / "logo.png"
if not src.exists():
    src = root / "public" / "logo.png"
if not src.exists():
    raise FileNotFoundError(f"Logo not found at {src}")

img = Image.open(src).convert("RGBA")

out = root / "public" / "favicon.ico"
sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
img.save(out, format="ICO", sizes=sizes)
print(f"Created {out}")
