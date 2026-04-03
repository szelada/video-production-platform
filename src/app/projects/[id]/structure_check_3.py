import sys

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    stack = []
    pairs = {'{': '}', '(': ')', '[': ']'}
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        for j, char in enumerate(line):
            if char in pairs.keys():
                stack.append((char, i + 1, j + 1))
            elif char in pairs.values():
                if not stack:
                    print(f"Extra closing '{char}' at line {i+1}, col {j+1}")
                    continue
                opening, line_no, col_no = stack.pop()
                if pairs[opening] != char:
                    print(f"Mismatched closing '{char}' at line {i+1}, col {j+1} (matches '{opening}' from line {line_no}, col {col_no})")
    
    for char, line_no, col_no in stack:
        print(f"Unclosed '{char}' from line {line_no}, col {col_no}")

# Simple tag balance check (approximate)
def check_tags(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    import re
    # Find all tags like <div ... > or </div>
    tags = re.findall(r'<(\w+)|</(\w+)>', content)
    
    tag_stack = []
    for opening, closing in tags:
        if opening:
            if opening[0].isupper() or opening in ['div', 'span', 'p', 'h1', 'h2', 'h3', 'button', 'nav', 'section', 'header', 'footer', 'main', 'a', 'img', 'input', 'form', 'textarea', 'option', 'select']:
                # Self-closing tags might be missed here, but let's be simple
                if '/>' not in opening: # This regex is too simple for self-closing
                    pass
        # This is hard with regex... let's just use the brace check first.

print("Checking Braces/Parentheses Balance:")
check_balance(filepath)
