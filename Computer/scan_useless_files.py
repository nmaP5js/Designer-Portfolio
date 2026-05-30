import os
import hashlib
from collections import defaultdict

DESKTOP_PATH = "/Users/nma/Desktop"
DOWNLOADS_PATH = "/Users/nma/Downloads"
PROJECT_DIR_NAME = "Designer-Portfolio-main"

def get_md5(file_path):
    """Calculate MD5 hash of a file in chunks."""
    hasher = hashlib.md5()
    try:
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(8192), b""):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception as e:
        return None

def is_empty_dir(dir_path):
    """Check if directory is empty (contains no files, or only empty dirs)."""
    try:
        items = os.listdir(dir_path)
        if not items:
            return True
        for item in items:
            item_path = os.path.join(dir_path, item)
            if os.path.isdir(item_path):
                if not is_empty_dir(item_path):
                    return False
            else:
                return False
        return True
    except Exception:
        return False

def scan():
    print("Starting scan of Desktop and Downloads...")
    
    # Categories of findings
    duplicates = defaultdict(list)  # hash -> list of file paths
    temp_files = []                # list of (path, reason, size)
    empty_files = []               # list of path
    empty_dirs = []                # list of path
    redundant_archives = []        # list of (zip_path, folder_path, size)
    installers = []                # list of (path, size)
    
    # We will track file sizes for duplicate checking first by size, then hash to be fast
    size_to_paths = defaultdict(list)
    
    # Directories to scan
    scan_paths = [DESKTOP_PATH, DOWNLOADS_PATH]
    
    # Helper to check if path is inside our project folder
    def in_project(path):
        return PROJECT_DIR_NAME in path.split(os.sep)

    for root_dir in scan_paths:
        if not os.path.exists(root_dir):
            continue
            
        for root, dirs, files in os.walk(root_dir):
            # Skip project directory
            if in_project(root):
                continue
                
            # Check for empty directories
            # (Only list directories that are empty at this level)
            for d in dirs:
                dir_path = os.path.join(root, d)
                if in_project(dir_path):
                    continue
                if is_empty_dir(dir_path):
                    empty_dirs.append(dir_path)
            
            # Check files
            for file in files:
                file_path = os.path.join(root, file)
                
                # Get file size
                try:
                    size = os.path.getsize(file_path)
                except Exception:
                    continue
                
                # 1. Check for temporary/cache/system junk
                file_lower = file.lower()
                is_junk = False
                reason = ""
                
                if file.startswith("~$"):
                    is_junk = True
                    reason = "Office lock file"
                elif file_lower.endswith(('.tmp', '.temp', '.bak', '.log', '.swp')):
                    is_junk = True
                    reason = f"Temporary/log extension ({os.path.splitext(file)[1]})"
                elif ".ipynb_checkpoints" in file_path:
                    is_junk = True
                    reason = "Jupyter Notebook checkpoint file"
                elif "__pycache__" in file_path or file_lower.endswith('.pyc'):
                    is_junk = True
                    reason = "Python cache file"
                elif file == ".DS_Store":
                    is_junk = True
                    reason = "macOS folder metadata file"
                
                if is_junk:
                    temp_files.append((file_path, reason, size))
                    continue
                
                # 2. Check for empty files
                if size == 0:
                    if file != ".localized":  # skip system file
                        empty_files.append(file_path)
                    continue
                
                # 3. Check for installers in Downloads
                if root.startswith(DOWNLOADS_PATH):
                    if file_lower.endswith(('.dmg', '.pkg')):
                        installers.append((file_path, size))
                
                # 4. Check for potential duplicate (populate size index)
                size_to_paths[size].append(file_path)
                
                # 5. Check for redundant archives
                # If it's a zip and there is a folder of the same name in the same root
                if file_lower.endswith(('.zip', '.tar.gz', '.tgz', '.tar', '.rar', '.7z')):
                    # e.g. "Archive.zip" -> "Archive"
                    base_name = os.path.splitext(file)[0]
                    # handle double extension .tar.gz
                    if file_lower.endswith('.tar.gz'):
                        base_name = os.path.splitext(base_name)[0]
                        
                    folder_path = os.path.join(root, base_name)
                    if os.path.exists(folder_path) and os.path.isdir(folder_path):
                        redundant_archives.append((file_path, folder_path, size))

    # Calculate hashes only for files that have the same size (to optimize speed)
    print("Calculating hashes to check for duplicates...")
    for size, paths in size_to_paths.items():
        if len(paths) < 2:
            continue
        # Hash them
        hash_to_files = defaultdict(list)
        for p in paths:
            h = get_md5(p)
            if h:
                hash_to_files[h].append(p)
        
        for h, hashed_paths in hash_to_files.items():
            if len(hashed_paths) > 1:
                # We found duplicates!
                # Group by hash and store
                duplicates[h] = hashed_paths

    # Generate Markdown Report
    report_path = "/Users/nma/.gemini/antigravity/brain/dad5ebe6-83c1-4f43-b836-193ceecae439/useless_files_report.md"
    print(f"Writing report to {report_path}...")
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Rapport des fichiers inutiles sur l'ordinateur\n\n")
        f.write("Ce rapport présente les fichiers temporaires, doublons, dossiers vides et autres éléments potentiellement inutiles détectés sur votre Bureau et dans vos Téléchargements.\n\n")
        
        f.write("> [!IMPORTANT]\n")
        f.write("> Aucun fichier n'a été supprimé. Vous pouvez examiner cette liste et décider de nettoyer ces fichiers manuellement ou de me demander de le faire pour vous.\n\n")
        
        # 1. Duplicates
        f.write("## 1. Fichiers Doublons\n")
        f.write("Ces fichiers ont exactement le même contenu. Vous pouvez conserver un exemplaire et supprimer les autres.\n\n")
        if not duplicates:
            f.write("Aucun fichier doublon détecté.\n\n")
        else:
            for h, paths in duplicates.items():
                f.write(f"### Doublon (Hash: `{h[:8]}...`)\n")
                # get file size from first file
                sz = os.path.getsize(paths[0])
                sz_str = format_size(sz)
                f.write(f"Taille : {sz_str}\n\n")
                for i, p in enumerate(paths):
                    role = "Original" if i == 0 else "Doublon"
                    f.write(f"- **{role}** : [{os.path.basename(p)}](file://{p}) (dans `{os.path.dirname(p)}`)\n")
                f.write("\n")
        
        # 2. Temp and Cache files
        f.write("## 2. Fichiers Temporaires et Caches\n")
        f.write("Fichiers de cache de programmation, checkpoints, logs, ou fichiers temporaires Office.\n\n")
        if not temp_files:
            f.write("Aucun fichier temporaire ou de cache détecté.\n\n")
        else:
            f.write("| Fichier | Dossier | Raison | Taille |\n")
            f.write("| --- | --- | --- | --- |\n")
            for path, reason, sz in temp_files:
                name = os.path.basename(path)
                parent = os.path.dirname(path)
                f.write(f"| [{name}](file://{path}) | `{parent}` | {reason} | {format_size(sz)} |\n")
            f.write("\n")
            
        # 3. Redundant Archives
        f.write("## 3. Archives Redondantes (Décompressées)\n")
        f.write("Fichiers archives (ex: `.zip`) qui ont déjà été décompressés dans le même dossier (un dossier du même nom existe).\n\n")
        if not redundant_archives:
            f.write("Aucune archive redondante détectée.\n\n")
        else:
            f.write("| Archive | Dossier extrait | Taille de l'archive |\n")
            f.write("| --- | --- | --- |\n")
            for zip_path, folder_path, sz in redundant_archives:
                zip_name = os.path.basename(zip_path)
                folder_name = os.path.basename(folder_path)
                f.write(f"| [{zip_name}](file://{zip_path}) | [{folder_name}](file://{folder_path}) | {format_size(sz)} |\n")
            f.write("\n")
            
        # 4. Installers in Downloads
        f.write("## 4. Fichiers d'installation (Downloads)\n")
        f.write("Fichiers `.dmg` ou `.pkg` présents dans le dossier Téléchargements. Ils ne sont généralement plus nécessaires après l'installation de l'application.\n\n")
        if not installers:
            f.write("Aucun fichier d'installation détecté.\n\n")
        else:
            f.write("| Fichier | Dossier | Taille |\n")
            f.write("| --- | --- | --- |\n")
            for path, sz in installers:
                name = os.path.basename(path)
                parent = os.path.dirname(path)
                f.write(f"| [{name}](file://{path}) | `{parent}` | {format_size(sz)} |\n")
            f.write("\n")
            
        # 5. Empty Files
        f.write("## 5. Fichiers Vides (0 octets)\n")
        f.write("Fichiers ne contenant aucune donnée.\n\n")
        if not empty_files:
            f.write("Aucun fichier vide détecté.\n\n")
        else:
            for p in empty_files:
                f.write(f"- [{os.path.basename(p)}](file://{p}) dans `{os.path.dirname(p)}`\n")
            f.write("\n")
            
        # 6. Empty Folders
        f.write("## 6. Dossiers Vides\n")
        f.write("Dossiers ne contenant aucun fichier ni sous-dossier contenant des fichiers.\n\n")
        if not empty_dirs:
            f.write("Aucun dossier vide détecté.\n\n")
        else:
            for p in empty_dirs:
                f.write(f"- [{os.path.basename(p)}](file://{p})\n")
            f.write("\n")

def format_size(bytes):
    if bytes < 1024:
        return f"{bytes} octets"
    elif bytes < 1024 * 1024:
        return f"{bytes/1024:.2f} Ko"
    elif bytes < 1024 * 1024 * 1024:
        return f"{bytes/(1024*1024):.2f} Mo"
    else:
        return f"{bytes/(1024*1024*1024):.2f} Go"

if __name__ == "__main__":
    scan()
