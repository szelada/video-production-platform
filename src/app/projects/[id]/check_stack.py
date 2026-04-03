import sys
import re

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    # Find all <div or </div> in the line
    # Simple regex (might miss some edge cases but should work for main structure)
    opens = re.findall(r'<div\b', line)
    closes = re.findall(r'</div>', line)
    
    for _ in opens:
        stack.append(i + 1)
    
    for _ in closes:
        if stack:
            stack.pop()
        else:
            print(f"Extra </div> at line {i + 1}")

print(f"Final stack size: {len(stack)}")
if stack:
    print(f"First unclosed <div> at line {stack[0]}")
    # Print the line
    print(f"Content: {lines[stack[0]-1].strip()}")
