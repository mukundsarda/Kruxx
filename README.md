# Kruxx: AI-Powered Educational Content Summarizer and Quiz Generator

Kruxx is a web application designed to help students and educators manage educational content more efficiently. By leveraging Natural Language Processing (NLP) and Optical Character Recognition (OCR), Kruxx can summarize various types of educational materials and generate personalized quizzes.

## ✨ Features

* **Multi-Format Support**: Upload content in various formats including:
    * Documents: PDF, DOC, PPT
    * Images: Scanned notes and textbook pages
    * Video: YouTube video links
    * Websites: Website links
* **Advanced Summarization**:
    * **Extractive Summarization**: Utilizes the BERT model to pull key sentences from the text.
    * **Abstractive Summarization**: Employs the BART model to generate new, concise summaries.
    * **Customizable Length**: Choose between short, medium, or long summaries.
* **Dynamic Quiz Generation**:
    * Automatically creates multiple-choice questions based on the uploaded content.
    * Generates relevant distractors to ensure the quizzes are challenging and effective.
* **YouTube Tools**:
    * **Clickbait Detection**: Analyzes YouTube videos to determine if they are clickbait.
    * **Video Recommendations**: Suggests relevant YouTube videos based on the provided link.
* **Accessibility Features**:
    * **Text-to-Speech**: Converts summaries into audio.
    * **Multi-Language Translation**: Translates summarized content into various languages.

## 💻 Technologies Used

* **Frontend**: HTML, Tailwind CSS, React, JavaScript
* **Backend**: Flask (Python)
* **AI/ML**:
    * **NLP Models**: BERT, BART (from Transformers library)
    * **Quiz Generation**: Generative AI API
    * **OCR**: EasyOCR, DocTR
* **APIs**:
    * YouTube Transcript API
    * Google Translate API
    * YouTube Data API

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

* Mukund Sarda (21103105)
* Vansh Gupta (21103107)
* Aryan Jolly (21103110)
