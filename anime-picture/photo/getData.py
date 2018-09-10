# -*- coding: utf-8 -*- 
import os
import re
import time


def getName(path) :
	pathDir = os.listdir(path)
	pattern = r'.*jpg'
	for dir in pathDir : 
		fileName = re.match(pattern,dir)
		if fileName!=None :
			photoName.append(fileName.group())
	#len = len(photoName)
	
def getTitle(path) :
	pattern = r"(.*)\.jpg"
	for name in photoName :
		title = re.match(pattern,name)
		if title != None :
			photoTitle.append(title.group(1))
			
def getTime(path) :
	for name in photoName :
		#getatime: access time,getctime : create time ,getmtime : modify time
		timeStamp = os.path.getmtime(path+name)
		timeArray = time.localtime(timeStamp)
		date = time.strftime("%Y-%m-%d %Hh",timeArray)
		photoTime.append(date)
	#print(photoTime)	
	
def writeIn() :
	length = len(photoName)
	file = open('./data.js','r+')
	file.write("var data = [")
	for i in range(length) :
		if i < length - 1 :
			str = '{img : \"'+photoName[i]+'\",date : \"'+photoTime[i]+'\",title : \"'+photoTitle[i]+'\"},'
			file.write(str)
		if i == length - 1: 
			str = '{img : \"'+photoName[i]+'\",date : \"'+photoTime[i]+'\",title : \"'+photoTitle[i]+'\"}]'
			file.write(str)

	file.close()
	


if __name__ == '__main__' :
	path = r'./'
	photoName = []
	photoTitle = []
	photoTime = []
	getName(path)
	getTitle(path)
	getTime(path)
	writeIn()
	