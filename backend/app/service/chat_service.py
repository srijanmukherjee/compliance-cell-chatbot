from enum import Enum
from app.main import ChatMessage
from app.service.model_service import ModelService, ModelState
from chatbot.nltk_utils import bag_of_words, tokenize

class ChatServiceNotLoadedException(Exception):
    pass

class ChatService:
    def __init__(self, model_service: ModelService):
        # self.data = torch.load(model_path)

        # input_size = self.data["input_size"]
        # hidden_size = self.data["hidden_size"]
        # output_size = self.data["output_size"]
        # model_state = self.data["model_state"]
        
        # self.all_words = self.data['all_words']
        # self.tags = self.data['tags']
        # self.model = NeuralNet(input_size, hidden_size, output_size).to(self.device)
        # self.model.load_state_dict(model_state)
        # self.model.eval()
        self.model_service = model_service

    def generate_response(self, message: ChatMessage):
        # sentence = tokenize(message.text)
        # X = bag_of_words(sentence, self.all_words)
        # X = X.reshape(1, X.shape[0])
        # X = torch.from_numpy(X).to(self.device)

        # output = self.model(X)
        # _, predicted = torch.max(output, dim=1)

        # tag = self.tags[predicted.item()]
        # probs = torch.softmax(output, dim=1)
        # prob = probs[0][int(predicted.item())]

        # return tag, prob.item()
        if self.model_service.state == ModelState.NOT_AVAILABLE:
            raise ChatServiceNotLoadedException()
        
        return NotImplemented