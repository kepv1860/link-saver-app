import google.generativeai as genai
import os

GEMINI_API_KEY = "AIzaSyDGy-amaQ4G-iHeZgAsZ5U8JLgc0ZouAAY"
genai.configure(api_key=GEMINI_API_KEY)

print("Available Gemini Models:")
for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    print(m.name)

