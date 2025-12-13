import requests
import json

# 测试生成大纲的API
url = "http://localhost:8000/api/generate-outline"
data = {
    "subject": "數學",
    "grade": "國小三年級",
    "unit": "分數基礎概念"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

