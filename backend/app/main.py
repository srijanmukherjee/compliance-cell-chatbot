import os
from fastapi import FastAPI
from pydantic import BaseModel
import torch

from chatbot.model import NeuralNet
from chatbot.nltk_utils import bag_of_words, tokenize

class ChatMessage(BaseModel):
    text: str
    sender: str

app = FastAPI()

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
data = torch.load(os.environ.get("CHAT_MODEL_PATH", "data.pth"))
input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

@app.get("/")
async def index():
    return { "message": "Hello, Mom!" }

@app.post("/chat")
async def chat(chat_message: ChatMessage):
    sentence = tokenize(chat_message.text)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]
    probs = torch.softmax(output, dim=1)
    prob = probs[0][int(predicted.item())]

    return {"tag": tag, "probability": prob.item()}