import logging
import math
import os
from typing import List
import numpy as np
import logging
import uuid

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from app.model.intent import IntentRepository

from .nltk_utils import bag_of_words, tokenize, stem
from .model import NeuralNet

class ChatDataset(Dataset):
    def __init__(self, X_train, y_train):
        self.n_samples = len(X_train)
        self.x_data = X_train
        self.y_data = y_train

    # support indexing such that dataset[i] can be used to get i-th sample
    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    # we can call len(dataset) to return the size
    def __len__(self):
        return self.n_samples

def train_model(device: torch.device, 
                intents: List[IntentRepository], 
                epochs=1000, 
                batch_size=8, 
                learning_rate=0.001, 
                hidden_size=8,
                logger: logging.Logger = logging.getLogger("chatbot"),
                output_dir: str = ".") -> str:
    all_words = []
    tags = []
    xy = []

    for intent in intents:
        tags.append(intent.tag)
        for pattern in intent.patterns:
            w = tokenize(pattern)
            all_words.extend(w)
            xy.append((w, intent.tag))

    # stem and lower each word
    ignore_words = ['?', '.', '!']
    all_words = [stem(w) for w in all_words if w not in ignore_words]

    # remove duplicates and sort
    all_words = sorted(set(all_words))
    tags = sorted(set(tags))

    logger.info(f"{len(xy)} patterns")
    logger.info(f"{len(tags)} tags: {tags}")
    logger.info(f"{len(all_words)} unique stemmed words: {all_words}")

    # create training data
    X_train = []
    y_train = []

    for (pattern_sentence, tag) in xy:
        # X: bag of words for each pattern_sentence
        bag = bag_of_words(pattern_sentence, all_words)
        X_train.append(bag)
        # y: PyTorch CrossEntropyLoss needs only class labels, not one-hot
        label = tags.index(tag)
        y_train.append(label)

    X_train = np.array(X_train)
    y_train = np.array(y_train)

    input_size = len(X_train[0])
    output_size = len(tags)

    dataset = ChatDataset(X_train, y_train)
    train_loader = DataLoader(dataset=dataset,
                          batch_size=batch_size,
                          shuffle=True,
                          num_workers=0)
    
    model = NeuralNet(input_size, hidden_size, output_size).to(device)

    # Loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

    # Train the model
    loss_value = math.inf
    for epoch in range(epochs):
        for (words, labels) in train_loader:
            words = words.to(device)
            labels = labels.to(dtype=torch.long).to(device)
            
            # Forward pass
            outputs = model(words)
            # if y would be one-hot, we must apply
            # labels = torch.max(labels, 1)[1]
            loss = criterion(outputs, labels)
            
            # Backward and optimize
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            loss_value = loss.item()
            
        if (epoch+1) % 100 == 0:
            logger.info(f'Epoch [{epoch+1}/{epochs}], Loss: {loss_value:.4f}')
    
    logger.info(f'final loss: {loss_value:.4f}')

    data = {
        "model_state": model.state_dict(),
        "input_size": input_size,
        "hidden_size": hidden_size,
        "output_size": output_size,
        "all_words": all_words,
        "tags": tags
    }

    output_path = os.path.join(output_dir, f"{uuid.uuid4()}.pth")
    torch.save(data, output_path)

    return output_path