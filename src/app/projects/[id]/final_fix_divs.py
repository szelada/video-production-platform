import re

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the point before the final return closing
# The file ends roughly with:
#         </div>
#       </div>
#     </div>
#   );
# }

# Find the last ); before the end
match_return_end = list(re.finditer(r'\s+?\);\s+?}', content))
if not match_return_end:
    print("Could not find end of component")
    exit(1)

last_match = match_return_end[-1]
pos = last_match.start()

# Calculate stack at this point
subcontent = content[:pos]
tokens = re.findall(r'<(div\b|/div)>', subcontent)
stack_count = 0
for tag in tokens:
    if tag == 'div':
        stack_count += 1
    else:
        stack_count -= 1

print(f"Stack at return end: {stack_count}")

if stack_count > 0:
    closing_tags = "\n" + ("        " * 2) + ("</div>\n" * stack_count)
    new_content = content[:pos] + closing_tags + content[pos:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Added {stack_count} closing tags")
else:
    print("No tags to close at this point")
