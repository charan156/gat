import urllib.request as req
import requests
from bs4 import BeautifulSoup
import json
import shutil
import os.path
import PyPDF2 
import textract
from pymongo import MongoClient
import os
import tempfile
import pdf2image
from pdf2image import convert_from_path
from PIL import Image
import pytesseract
import re
import cv2
import sys
from getpass import getpass



# Method to convert non-OCR'ed PDFs into jpeg images
# Each page in a pdf will be converted into seperate images
# Later images that belong to the same pdf will be joined together as a single image

def convert_pdf(file_path, name):
    if not os.path.exists('./temp_dir'):
        os.makedirs('./temp_dir')
    if not os.path.exists('./Image'):
        os.makedirs('./Image')
    images = convert_from_path(file_path, output_folder='temp_dir')
    temp_images = []
    temp_dir = './temp_dir/'
    for i in range(len(images)):
        image_path = f'{temp_dir}/{i}.jpg'
        images[i].save(image_path, 'JPEG')
        temp_images.append(image_path) 
    imgs = list(map(Image.open, temp_images))
    min_img_width = min(i.width for i in imgs)
    total_height = 0
    for i, img in enumerate(imgs):
        total_height += imgs[i].height
    merged_image = Image.new(imgs[0].mode, (min_img_width, total_height))
    y = 0
    for img in imgs:
        merged_image.paste(img, (0, y))
        y += img.height
    merged_image.save("./Image/"+name+".jpg")
    return "./Image/"+name+".jpg"



# Method to convert the image into text

def imagetotext(imagename):
    output = pytesseract.image_to_string(Image.open(imagename))
    return output


# Main   
 
client = MongoClient()
db = client.metadata
files = db.meta # Database connection
soup = BeautifulSoup(open("./gats_metadata.htm", 'rb'), "lxml")
tables = soup.findAll("table") # All the tables inside the metadata html file
k=20 # Adjust the value of k to insert k records into the mongodb database
while(k<9711):
    try:
        rows = tables[k].findAll('tr')
        data = [[td.findChildren(text=True) for td in tr.findAll("td")] for tr in rows]
        dict1 = {
                    'PKEY': " ",
                    'PKEY_DATE': " " ,
                    'NO' : " ",
                    'HDT' : " ",
                    'IDT' : " ",
                    'RDT': " ",
                    'PDF': " ",
                    'CCLINK': " ",
                    'EXTLINK' : " ",
                    'EMPLOYER' : " ",
                    'UNION' : " ",
                    'SORT1' : " ",
                    'IDTCOUNT' : " ",
                    'YR': " ",
                    'CASECOUNT' : " " ,
                    'filepath' : " ",
                    'text': " ",
                    'TI': " ",
                    'CH': " ",
                    'EEREP' : " ",
                    'ERREP' : " ",
                    'BOARD' : " ",
                    'ERNOM' : " ",
                    'SUB' : " ",
                    'F' : " ",
                    'GSB Decision': " ",
                    'HD': " ",
                    'DI': " ",
                    'CC': " ",
                    'IDNO': " ",
                    'MDT': " ",
                    'UNNOM' : " ",
                    'JR': " ",
                    'JRPDF': " "
                }
        i,j=0,0


        # insert the metadata and the data into the dictionary

        for dat in data:
            a = data[i][j]
            b = data[i][j+1]
            dict1.update( { a[0] : b[0] } )
            i=i+1
        #dict1['filepath'] = 'http://localhost:4200/assets/pdf/'+dict1['YR']+'/'+dict1['PDF']
        filename = '../pdf/'+dict1['YR']+'/'+dict1['PDF']
        filen = dict1['PDF']
        filen = filen[:-4] 


        # Convert pdf into text and later insert the converted text into the DB
        # If the pdf is not already OCR'ed, convert it into image and then into text
        # And then insert the text into the DB

        pdfFileObj = open(filename,'rb')
        pdfReader = PyPDF2.PdfFileReader(pdfFileObj, strict=False)
        num_pages = pdfReader.numPages
        count = 0
        text = ""
        while count < num_pages:
            pageObj = pdfReader.getPage(count)
            count +=1
            text += pageObj.extractText()
        if text != "":
            text = text
        else:
            image = convert_pdf(filename, filen)
            text = imagetotext(image)        
        dict1['text'] = text
        #print(dict1)    
        files.insert_one(dict1)
        print("Wrote Document No. %d\n" % (k))  
    

    # For all the errors in particular records, log the record into a file
    # The file has information such as which record is not inserted into the DB

    except Exception as error:
        er = ""
        er += "error in Rec No. "+str(k)+"; PKEY. "+str(dict1['PKEY'])+"; "+str(error)+"\n"
        print(er)
        with open("error_log.txt", "a") as myfile:
            myfile.write(er)
            myfile.close()
    k+=1

shutil.rmtree('./temp_dir/') 
shutil.rmtree('./Image/') 
