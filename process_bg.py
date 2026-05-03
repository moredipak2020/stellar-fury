from rembg import remove
from PIL import Image
import glob

files = glob.glob("public/assets/new_aliens/*.png")
for f in files:
    print(f"Removing background from {f}...")
    try:
        input_img = Image.open(f)
        output_img = remove(input_img)
        output_img.save(f)
        print(f"Success: {f}")
    except Exception as e:
        print(f"Failed to process {f}: {e}")
