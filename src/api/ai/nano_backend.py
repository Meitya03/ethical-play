import requests
import json

API_URL = "https://grsai.dakka.com.cn/v1/draw/nano-banana"
API_KEY = "sk-e1662c33975d4043b31a5fe1065d1f0b"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}
data = {
    "model": "nano-banana-fast",
    "prompt": "四格漫画，简约扁平风格，工程伦理场景，软件工程师拒绝老板泄露用户数据的要求"
    # 不设置 webHook 或设为空，就会走 SSE
}

response = requests.post(API_URL, headers=headers, json=data, stream=True)

# 逐行读取响应体
for line in response.iter_lines():
    if line:
        # SSE 格式： "data: {...}"
        line = line.decode('utf-8')
        if line.startswith("data: "):
            json_str = line[6:]  # 去掉 "data: " 前缀
            try:
                event = json.loads(json_str)
                print("收到事件:", event)
                status = event.get("status")
                if status == "succeeded":
                    image_url = event["results"][0]["url"]
                    print("生成成功！图片URL:", image_url)
                    # 下载图片...
                    break
                elif status == "failed":
                    print("生成失败:", event.get("failure_reason"))
                    break
            except json.JSONDecodeError:
                print("JSON解析失败:", json_str)