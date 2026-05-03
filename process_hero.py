import os
from PIL import Image
from rembg import remove

source_dir = r"C:\Users\mored\.gemini\antigravity\brain\21851840-8df4-4f47-a94e-ad70ab1b236f"
dest_dir = r"d:\antigravity lenovo\Steller-fury\public\assets\ships"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

files = [
    ("hero_1_1777804304872.png", "hero_1.png"),
    ("hero_2_1777804319296.png", "hero_2.png"),
    ("hero_3_1777804334446.png", "hero_3.png"),
    ("hero_4_1777804350879.png", "hero_4.png"),
    ("hero_5_1777804365158.png", "hero_5.png")
]

for src_name, dst_name in files:
    src_path = os.path.join(source_dir, src_name)
    dst_path = os.path.join(dest_dir, dst_name)
    print("Processing", src_name)
    try:
        img = Image.open(src_path)
        out = remove(img)
        out.save(dst_path)
        print("Saved to", dst_path)
    except Exception as e:
        print("Error processing", src_name, ":", e)
