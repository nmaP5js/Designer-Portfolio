import os
import shutil

DOWNLOADS_PATH = "/Users/nma/Downloads"

CATEGORIES = {
    "Images": "Images",
    "Documents": "Documents",
    "Polices (Fonts)": "Polices (Fonts)",
    "3D & Modèles": "3D & Modèles",
    "Projets & Code": "Projets & Code",
    "Jeux & ROMs": "Jeux & ROMs",
    "Vidéos & Audio": "Vidéos & Audio",
    "Applications": "Applications",
    "Livres (E-books)": "Livres (E-books)",
    "Archives": "Archives"
}

def get_category(item, path):
    item_lower = item.lower()
    
    # Skip if it is one of the category directories
    if item in CATEGORIES.values():
        return None
        
    # Check if it's a directory
    if os.path.isdir(path):
        # App bundles
        if item_lower.endswith(".app"):
            return "Applications"
            
        # Font directories
        if any(x in item_lower for x in ["font", "family", "grotesk", "myeongjo", "regular", "master", "gabarit", "montserrat", "inter", "syne", "degheest", "gotico", "murmure", "sligoil", "trellick"]):
            # Special check to make sure it's not a web project that happens to have "master"
            if "website" in item_lower or "site" in item_lower or "portfolio" in item_lower:
                return "Projets & Code"
            return "Polices (Fonts)"
            
        # Code/Web Projects
        if any(x in item_lower for x in ["site", "web", "portfolio", "git", "main", "starter", "explorer", "localstorage", "blenderkit", "meshes"]):
            return "Projets & Code"
            
        # Games / ROMs
        if "mario" in item_lower or "contra" in item_lower:
            return "Jeux & ROMs"
            
        # Images / Photos / Assets folders
        if any(x in item_lower for x in ["image", "stickers", "objet", "pages to jpg", "photo"]):
            return "Images"
            
        # Default for other directories
        return "Documents"
        
    # Check for files
    else:
        ext = os.path.splitext(item)[1].lower()
        
        # Images
        if ext in [".jpg", ".jpeg", ".png", ".heic", ".webp", ".svg", ".dng", ".gif", ".jpg_large"]:
            return "Images"
            
        # Documents
        if ext in [".pdf", ".docx", ".doc", ".odt", ".rtf", ".md", ".xlsx", ".xls", ".csv", ".txt", ".mobileconfig"]:
            return "Documents"
            
        # 3D / CAD
        if ext in [".blend", ".3mf", ".stl", ".usdz", ".fbx", ".obj"]:
            return "3D & Modèles"
            
        # ROMs / Games
        if ext in [".nds", ".sfc", ".gb", ".gbc", ".gba", ".nes", ".snes"]:
            return "Jeux & ROMs"
            
        # Videos
        if ext in [".mov", ".mp4", ".avi", ".mkv", ".webm"]:
            return "Vidéos & Audio"
            
        # E-books
        if ext in [".epub", ".pdf_epub", ".mobi", ".azw3"]:
            return "Livres (E-books)"
            
        # Applications / Installers
        if ext in [".app", ".dmg", ".pkg", ".exe", ".msi"]:
            return "Applications"
            
        # Fonts (single files)
        if ext in [".ttf", ".otf", ".woff", ".woff2", ".eot"]:
            return "Polices (Fonts)"
            
        # HTML files (web projects or document guides)
        if ext in [".html", ".htm", ".js", ".css"]:
            return "Projets & Code"
            
        # Archives (only if not caught elsewhere)
        if ext in [".zip", ".tar", ".gz", ".rar", ".7z", ".tbz2"]:
            # Check zip name to see if it's a project, font, etc.
            if any(x in item_lower for x in ["font", "family", "grotesk", "myeongjo", "regular", "master", "gabarit", "montserrat", "inter", "syne", "outfit"]):
                return "Polices (Fonts)"
            if any(x in item_lower for x in ["site", "web", "portfolio", "main", "starter"]):
                return "Projets & Code"
            if "stickers" in item_lower:
                return "Images"
            if "blenderkit" in item_lower or "objet" in item_lower or "pages to jpg" in item_lower:
                return "Projets & Code" if "blenderkit" in item_lower else "Images"
            return "Archives"
            
        # Default fallback
        return "Documents"

def organize():
    print("Organizing downloads folder...")
    
    # Create target directories if they don't exist
    for dir_name in CATEGORIES.values():
        path = os.path.join(DOWNLOADS_PATH, dir_name)
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Created folder: {dir_name}")

    # List all files and directories on the desktop
    items = os.listdir(DOWNLOADS_PATH)
    
    for item in items:
        # Skip hidden files
        if item.startswith('.'):
            continue
            
        item_path = os.path.join(DOWNLOADS_PATH, item)
        dest_dir = get_category(item, item_path)
        
        if dest_dir:
            dest_path = os.path.join(DOWNLOADS_PATH, dest_dir, item)
            # Handle naming collision
            if os.path.exists(dest_path):
                # Append a number if it exists
                base, ext = os.path.splitext(item)
                counter = 1
                while os.path.exists(os.path.join(DOWNLOADS_PATH, dest_dir, f"{base}_{counter}{ext}")):
                    counter += 1
                dest_path = os.path.join(DOWNLOADS_PATH, dest_dir, f"{base}_{counter}{ext}")
            
            try:
                shutil.move(item_path, dest_path)
                print(f"Moved: {item} -> {dest_dir}/")
            except Exception as e:
                print(f"Error moving {item}: {e}")

if __name__ == "__main__":
    organize()
