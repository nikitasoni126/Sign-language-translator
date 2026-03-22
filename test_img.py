import sys
sys.path.append("c:/Users/omkar/Downloads/Sign Langauge Translator")
import cv2
import gesture_model

img_path = "C:/Users/omkar/.gemini/antigravity/brain/tempmediaStorage/media__1774100618614.jpg"
img = cv2.imread(img_path)
if img is None:
    print("Failed to load image")
else:
    result = gesture_model.process_frame(img)
    print("Result:", result)
