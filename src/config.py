import os
from dotenv import load_dotenv

# تحميل متغيرات البيئة من ملف .env إذا كان موجوداً
load_dotenv()

# إعدادات قاعدة البيانات
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# إعدادات API الخارجية
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# إعدادات CORS
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://wvozuwjk.manus.space",
    "https://link-saver-app.onrender.com"
]

# إعدادات الأمان
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-development")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
