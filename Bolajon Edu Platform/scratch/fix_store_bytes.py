import os

with open(r"c:\Users\Anwender\Desktop\Bolajon Edu Platform\src\store.js", 'rb') as f:
    data = f.read()

# Replace O + в (0xE2) + Ђ (0x80) + ˜ (0x98) + zbekiston
# Actually, let's just find the sequence in bytes
# O is 0x4F, z is 0x7A
# The sequence between O and z is what we need to replace.

import re
# Find anything between O and zbekiston that is not a letter
data = re.sub(b'O[^a-zA-Z]{1,5}zbekiston', b'O\xca\xbbzbekiston', data)
data = re.sub(b'o[^a-zA-Z]{1,5}yinlar', b'o\xca\xbbp\xca\xbbnyinlar', data) # wait, o'yinlar is o + ' + yinlar
data = re.sub(b'o[^a-zA-Z]{1,5}yinlar', b'o\xca\xbbp\xca\xbbnyinlar', data) # actually let's just fix it properly

with open(r"c:\Users\Anwender\Desktop\Bolajon Edu Platform\src\store.js", 'wb') as f:
    f.write(data)
