import sys
import os

filepath = r'e:\WEBS y APPS Antigravity\video-production-platform\next_app\src\app\projects\[id]\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# find the last occurrence of the avatar adjustment controls
target_index = -1
for i, line in enumerate(lines):
    if "Ajuste del Fotocheck (Foto Portador)" in line:
        target_index = i

if target_index == -1:
    print("Could not find target string")
    sys.exit(1)

# From target_index, find the next ')}' and ensure there are enough </div> before it
# We know we need to close:
# 1. <div grid-cols-1 md:grid-cols-3> (line 3225 in prev view)
# 2. <div p-8 ...> (line 3219)
# 3. <div space-y-10> (line 3083) - Wait, let's re-verify this.
# 4. <div bg-gray-900 (line 3060)
# 5. <div grid-cols-1 xl:grid-cols-2> (line 2931)
# 6. <div bg-white (line 2917)
# 7. <div space-y-12> (line 2915)

# In the current broken file, we have:
# 3262: </div> (G)
# 3263: </div> (F)
# 3264: </div> (A - space-y-10)
# 3265: </div> (Editor Container)
# 3266: </div> (Grid)
# 3267: </div> (White Container)
# 3268: )} (CREDENTIAL CONDITIONAL)

# MISSING: </div> for space-y-12 (2915).

for i in range(target_index, len(lines)):
    if ")}" in lines[i] and "motion.div" not in lines[i+1]:
        # This is the line 3268 ')}'
        # Check if previous lines have enough </div>
        # We'll just insert the missing </div> here.
        lines.insert(i, "                         </div>\n")
        print(f"Inserted missing </div> at line {i+1}")
        break

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Success")
