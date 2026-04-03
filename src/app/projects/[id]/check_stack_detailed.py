import re

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

tokens = re.findall(r'<(div)|(/div)>', content)
stack = []

for i, (opening, closing) in enumerate(re.finditer(r'<(div\b|/div)>', content)):
    tag = opening.group(1)
    if tag == 'div':
        # Find line number
        line_num = content.count('\n', 0, opening.start()) + 1
        stack.append((line_num, opening.start()))
    else:
        if stack:
            stack.pop()

print(f"Final stack size: {len(stack)}")
for line, _ in stack:
    print(f"Unclosed <div> at line {line}")
