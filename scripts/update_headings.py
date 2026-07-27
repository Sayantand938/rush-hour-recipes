#!/usr/bin/env python3
"""
Temporary script to increment heading levels in recipe markdown files.
Converts:
  #  -> ##
  ## -> ###
Leaves ### and deeper unchanged.
"""
import os
import re
from pathlib import Path

# Directory containing the .md files
RECIPES_DIR = Path(__file__).parent.parent / "public" / "recipes"

def process_file(filepath):
    """Read, modify, and write back the file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    modified = False
    new_lines = []
    for line in lines:
        # Match headings at start of line (no leading whitespace)
        # Convert #  -> ##, ## -> ###
        if re.match(r'^#\s', line):          # exactly one '#'
            new_line = re.sub(r'^#\s', '## ', line)
            modified = True
        elif re.match(r'^##\s', line):       # exactly two '#'
            new_line = re.sub(r'^##\s', '### ', line)
            modified = True
        else:
            new_line = line
        new_lines.append(new_line)

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"✅ Updated: {filepath.name}")
    else:
        print(f"⏭️  No changes: {filepath.name}")

def main():
    if not RECIPES_DIR.exists():
        print(f"❌ Directory not found: {RECIPES_DIR}")
        return

    md_files = list(RECIPES_DIR.glob("*.md"))
    if not md_files:
        print(f"⚠️  No .md files found in {RECIPES_DIR}")
        return

    print(f"Processing {len(md_files)} markdown files...")
    for filepath in md_files:
        process_file(filepath)

if __name__ == "__main__":
    main()