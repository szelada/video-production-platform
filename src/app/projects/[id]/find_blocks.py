import os

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "activeTab === 'pre'" in line:
        print(f"PRE START: {i+1}")
    if "activeTab === 'pro'" in line:
        print(f"PRO START: {i+1}")
    if "activeTab === 'entrega'" in line:
        print(f"ENTREGA START: {i+1}")
    if "activeTab === 'configuracion'" in line:
        print(f"CONFIG START: {i+1}")
    if "activeTab === 'ajustes'" in line:
        print(f"AJUSTES START: {i+1}")

