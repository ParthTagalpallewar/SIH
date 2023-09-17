import requests
import PyPDF2


pdf_url = "https://file-examples.com/storage/fedfb3ac2565047789d11e0/2017/10/file-sample_150kB.pdf"
response = requests.get(pdf_url)

with open("document.pdf", "wb") as pdf_file:
    pdf_file.write(response.content)

pdf_file = open('document.pdf', 'rb')

# Create a PDF object
pdf_reader = PyPDF2.PdfReader(pdf_file)

# Initialize an empty string to store the extracted text
text = ''

# Iterate through each page of the PDF
for page_num in range(len(pdf_reader.pages)):
    page = pdf_reader.pages[page_num]
    text += page.extract_text()

# Close the PDF file
pdf_file.close()

# Print or save the extracted text
print(text)
