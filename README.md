# Kruxx

Kruxx is an intelligent web application designed to optimize and revolutionize exam preparation by summarizing educational content and generating personalized quizzes. It combines advanced natural language processing (NLP) models, modern web technologies, and user-friendly tools to summarize educational content and generate personalized quizzes, ensuring a seamless learning experience.

---

## Features

- **Summarization**:
  - Automatically generate concise summaries of text, documents, audio, or video content.
  - Choose from short, medium, or long summary lengths.
  - Powered by state-of-the-art NLP models: **BART** and **BERT**.

- **Quiz Generation**:
  - Personalized quiz generation tailored to the uploaded or summarized content.
  - Leverages the **T5-small** model for question generation.

- **Input Flexibility**:
  - Upload a variety of content formats:
    - Text files (e.g., `.txt`)
    - Documents (e.g., `.pdf`)
    - Images (via OCR processing)
    - Audio files (via transcription)
    - YouTube videos (via transcript extraction)

- **Interactive UI**:
  - User-friendly interface with clear navigation and output visualization.
  - Display quiz results and track performance to identify areas for improvement.

- **Text Extraction**:
  - **OCR (Optical Character Recognition)** for extracting text from images.
  - Transcription of audio content for summarization and quiz creation.

- **Multi-Model Support**:
  - Choose between **BERT** (extractive summarization) and **BART** (abstractive summarization) based on your requirements.

---

## Technology Stack

### Frontend
- **React.js**: Modern JavaScript library for building the user interface.
- **Bootstrap**: Responsive and clean UI components.

### Backend
- **Flask**: Lightweight Python framework for API development.

### Core Functionalities
- **Summarization Models**:
  - **BART (facebook/bart-large-cnn)**: Generates human-like, contextually rich summaries.
  - **BERT (bert-base-uncased)**: Extracts the most critical sentences to form concise summaries.
- **Quiz Generation**:
  - **T5-small**: Tailored for creating interactive quizzes.
- **OCR**:
  - **Tesseract OCR**: Extracts text from uploaded image files.
- **Audio Processing**:
  - **SpeechRecognition**: Converts audio files into text for further processing.
- **YouTube Transcripts**:
  - Extracts transcripts from YouTube videos to support summarization and quiz generation.

---

## Workflow

1. **Input Stage**:
   - Users upload content in any supported format (text, documents, images, audio, or YouTube links).

2. **Processing Stage**:
   - Summarization: User selects the model (**BART** or **BERT**) and desired summary length.
   - Quiz Generation: Extracted or summarized content is passed to the **T5-small** model for question creation.

3. **Output Stage**:
   - Summaries are displayed with options for short, medium, and long formats.
   - Quizzes are presented interactively, allowing users to assess their understanding.

4. **Performance Tracking**:
   - Tracks user quiz performance and provides feedback to enhance learning efficiency.
