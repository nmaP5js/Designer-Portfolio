import os
import shutil

DESKTOP_PATH = "/Users/nma/Desktop"
CURRENT_DIR_NAME = "Designer-Portfolio-main"

# Define destination directories
DIRS = {
    "Captures d'écran": [],
    "Images & Fonds d'écran": [],
    "Documents": [],
    "Projets Web": [],
    "Personnel": [],
    "Archives": []
}

def organize():
    print("Organizing desktop...")
    
    # Create target directories if they don't exist
    for dir_name in DIRS.keys():
        path = os.path.join(DESKTOP_PATH, dir_name)
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Created folder: {dir_name}")

    # List all files and directories on the desktop
    items = os.listdir(DESKTOP_PATH)
    
    for item in items:
        # Skip hidden files
        if item.startswith('.'):
            continue
            
        # Skip this project folder
        if item == CURRENT_DIR_NAME:
            continue
            
        # Skip the destination directories themselves
        if item in DIRS.keys():
            continue
            
        item_path = os.path.join(DESKTOP_PATH, item)
        
        # Decide where to move the file/directory
        dest_dir = None
        
        # Lowercase for check
        item_lower = item.lower()
        
        if os.path.isdir(item_path):
            # Check directory types
            if "site" in item_lower or "web" in item_lower:
                dest_dir = "Projets Web"
            elif "appartement" in item_lower or "personnel" in item_lower:
                dest_dir = "Personnel"
            else:
                # Default for other directories
                dest_dir = "Personnel"
        else:
            # File extensions or prefixes
            if item.startswith("Capture"):
                dest_dir = "Captures d'écran"
            elif item_lower.endswith((".png", ".jpg", ".jpeg", ".gif", ".svg")):
                dest_dir = "Images & Fonds d'écran"
            elif item_lower.endswith((".pdf", ".md", ".docx", ".doc", ".txt", ".af")) or "lock" in item_lower or item.startswith("~$"):
                dest_dir = "Documents"
            elif item_lower.endswith((".zip", ".tar.gz", ".tar", ".rar", ".7z")):
                dest_dir = "Archives"
            else:
                dest_dir = "Documents" # Default fallback
                
        if dest_dir:
            dest_path = os.path.join(DESKTOP_PATH, dest_dir, item)
            # Handle naming collision
            if os.path.exists(dest_path):
                # Append a number if it exists
                base, ext = os.path.splitext(item)
                counter = 1
                while os.path.exists(os.path.join(DESKTOP_PATH, dest_dir, f"{base}_{counter}{ext}")):
                    counter += 1
                dest_path = os.path.join(DESKTOP_PATH, dest_dir, f"{base}_{counter}{ext}")
            
            try:
                shutil.move(item_path, dest_path)
                print(f"Moved: {item} -> {dest_dir}/")
            except Exception as e:
                print(f"Error moving {item}: {e}")

if __name__ == "__main__":
    organize()
