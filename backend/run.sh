#!/bin/sh

export STORAGE_BUCKET=compliance-chatbot-e9fe6.appspot.com
export GOOGLE_APPLICATION_CREDENTIALS=credentials.json
export CHAT_MODEL_PATH=/home/srijan/code/chatbot-with-pytorch/pytorch-chatbot/data.pth
uvicorn app.main:app --reload