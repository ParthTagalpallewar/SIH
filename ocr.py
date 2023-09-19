import cv2 
import argparse 
import os 
import pytesseract 
from PIL import Image 

ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image",
    help="epaper.jpg")
args = vars(ap.parse_args())


def extract_text(image):
    im = cv2.imread(image) 
    imgray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY) 
    ret, thresh1 = cv2.threshold(imgray, 180, 255, cv2.THRESH_BINARY) 
    filename = "{}.png".format(os.getpid()) 
    cv2.imwrite(filename, thresh1) 
    img = Image.open(filename)
    text = pytesseract.image_to_string(img)
    return text

def main():
    text = extract_text("epaper.jpg")
    print(text)

if __name__ == "__main__":
    main()
