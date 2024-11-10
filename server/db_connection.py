import pymongo
from dotenv import load_dotenv, find_dotenv
import os

dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

url = os.getenv('MONGODB_URL')

client = pymongo.MongoClient(url)

db = client[os.getenv('DATABASE_NAME')]

user_collection = db['User']
aktivitasFisik = db['aktivitasFisik']
gulaDarah = db['gulaDarah']
konsumsi = db['konsumsi']
messages = db['messages']
