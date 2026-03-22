import cv2
import sys
import numpy as np

def dhash(image, hash_size=8):
    resized = cv2.resize(image, (hash_size + 1, hash_size))
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    diff = gray[:, 1:] > gray[:, :-1]
    return sum([2 ** i for (i, v) in enumerate(diff.flatten()) if v])

img_path = "C:/Users/omkar/.gemini/antigravity/brain/tempmediaStorage/media__1774100618614.jpg"
img = cv2.imread(img_path)
if img is not None:
    print("Hash for img 1:", dhash(img))
else:
    print("Img 1 not found")

# Let's glob the temp folder for other potential images
import glob
for f in glob.glob("C:/Users/omkar/.gemini/antigravity/brain/tempmediaStorage/*.jpg"):
    im = cv2.imread(f)
    if im is not None:
        print(f"Hash for {f}:", dhash(im))

