import requests as rq;
from bs4 import *;


r2 = rq.get("https://www.news18.com/politics/");
soup2 = BeautifulSoup(r2.text, "html.parser");

x = soup2.find("div", class_="jsx-1374841737 blog_list");

for child in x:
    aTag = child.find("a")
    link = aTag['href']
    descLink = rq.get(link)
    descSoup2 = BeautifulSoup(descLink.text, "html.parser");
 

    print("Title :-  --------- ")
    
    divTitle = child.find("div", class_="jsx-1374841737 blog_title")
    title = divTitle.find("h4", class_="jsx-1374841737")
    print(title.text)
    print("")
    print("Description: ---------- \n")

   

    description1 = descSoup2.find("p", class_="story_para_0").text;
    description2 = descSoup2.find("p", class_="story_para_1").text;

    print(description1);
    print(description2);

    print("________________________________")

