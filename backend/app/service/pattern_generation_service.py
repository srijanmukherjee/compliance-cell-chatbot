from Questgen.main import QGen

class PatternGenerationService:
    def __init__(self):
        self._question_generator = QGen()

    def generate(self, text: str, num_patterns=5):
        payload = {
            "input_text": text,
            "max_questions": num_patterns
        }

        result = self._question_generator.predict_shortq(payload)
        return result
    
    def paraphrase(self, question: str, num_questions=5):
        payload = {
            "input_text": question,
        }

        return self._question_generator.paraphrase(payload)