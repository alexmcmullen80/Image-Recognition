# Image Recognition with Google Vision API
Hosted at this [link](https://image-recognition.alexmcmullen.ca/)

This project leverages the Google Vision API to analyze and label images with tag words, allowing users to search for images based on the generated tags. The application includes both a **backend** for processing and storing image metadata, and a **frontend** for displaying and searching the images.

## Features

- **Image Upload and Labeling:** Automatically label uploaded images using the Google Vision API.
- **Tag-Based Search:** Search for images using generated tag words.
- **Image Hosting on AWS S3:** Images and metadata are stored in an AWS S3 bucket.
- **Frontend with React:** A user-friendly interface to view, search, and interact with the images.

---

## Project Structure

```plaintext
root/
├── backend/
│   ├── public/             # Contains images and metadata
│   ├── vision.py           # Python script to process images and upload metadata
│   ├── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/             # Contains HTML
│   ├── src/                # React app source files
│   ├── package.json        # Frontend dependencies
├── README.md               # This file
