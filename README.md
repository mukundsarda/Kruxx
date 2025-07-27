# Kruxx: AI-Powered Educational Content Summarizer and Quiz Generator

Kruxx is a web application designed to help students and educators manage educational content more efficiently. [cite_start]By leveraging Natural Language Processing (NLP) and Optical Character Recognition (OCR), Kruxx can summarize various types of educational materials and generate personalized quizzes[cite: 8].

## ✨ Features

* [cite_start]**Multi-Format Support**: Upload content in various formats including[cite: 70, 71]:
    * [cite_start]Documents: PDF, DOC, PPT [cite: 71]
    * [cite_start]Images: Scanned notes and textbook pages [cite: 71]
    * [cite_start]Video: YouTube video links [cite: 71]
    * [cite_start]Websites: Website links [cite: 300]
* **Advanced Summarization**:
    * [cite_start]**Extractive Summarization**: Utilizes the BERT model to pull key sentences from the text[cite: 149, 303].
    * [cite_start]**Abstractive Summarization**: Employs the BART model to generate new, concise summaries[cite: 149, 302].
    * [cite_start]**Customizable Length**: Choose between short, medium, or long summaries[cite: 304].
* **Dynamic Quiz Generation**:
    * [cite_start]Automatically creates multiple-choice questions based on the uploaded content[cite: 73, 305].
    * [cite_start]Generates relevant distractors to ensure the quizzes are challenging and effective[cite: 327].
* **YouTube Tools**:
    * [cite_start]**Clickbait Detection**: Analyzes YouTube videos to determine if they are clickbait[cite: 74, 156, 311].
    * [cite_start]**Video Recommendations**: Suggests relevant YouTube videos based on the provided link[cite: 74, 159, 312].
* **Accessibility Features**:
    * [cite_start]**Text-to-Speech**: Converts summaries into audio[cite: 307].
    * [cite_start]**Multi-Language Translation**: Translates summarized content into various languages[cite: 309].

## 💻 Technologies Used

* [cite_start]**Frontend**: HTML, Tailwind CSS, React, JavaScript [cite: 233]
* [cite_start]**Backend**: Flask (Python) [cite: 234]
* **AI/ML**:
    * [cite_start]**NLP Models**: BERT, BART (from Transformers library) [cite: 659, 731]
    * [cite_start]**Quiz Generation**: Generative AI API [cite: 306, 669]
    * [cite_start]**OCR**: EasyOCR, DocTR [cite: 153, 238, 345]
* **APIs**:
    * [cite_start]YouTube Transcript API [cite: 238]
    * [cite_start]Google Translate API [cite: 68, 655]
    * [cite_start]YouTube Data API [cite: 311, 329]

## ⚙️ Setup and Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/your-username/Kruxx.git](https://github.com/your-username/Kruxx.git)
    cd Kruxx
    ```
2.  **Install backend dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Install frontend dependencies**:
    ```bash
    npm install
    ```
4.  **Run the application**:
    * Start the Flask backend:
        ```bash
        python app.py
        ```
    * Start the React frontend:
        ```bash
        npm start
        ```

## 🤝 Team

* [cite_start]Mukund Sarda (21103105) [cite: 12, 31]
* [cite_start]Vansh Gupta (21103107) [cite: 14, 32]
* [cite_start]Aryan Jolly (21103110) [cite: 16, 33]

## 👩‍🏫 Supervisor

* [cite_start]Dr. Aastha Maheshwari [cite: 17]
