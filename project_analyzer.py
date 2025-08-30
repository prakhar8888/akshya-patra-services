import os
import argparse

# --- Configuration ---
# Directories to completely ignore during the scan
EXCLUDED_DIRS = {
    'node_modules',
    '.git',
    '.vscode',
    'dist',
    'build',
    '__pycache__',
    '.next',
    'public', # Often contains static assets not relevant to logic
    'assets'
}

# File extensions to analyze for imports and content
ANALYZABLE_EXTENSIONS = {
    '.js', '.jsx', '.ts', '.tsx', # JavaScript/React/TypeScript
    '.py',                          # Python
    '.html', '.css',                # Web
    '.json',                        # Config files
    '.md'                           # Markdown/Documentation
}

# --- Main Logic ---

def create_directory_tree(start_path, output_file):
    """Walks through the directory and builds a visual tree structure."""
    output_file.write("## 📂 Project Directory Tree\n\n")
    output_file.write("```\n")
    for root, dirs, files in os.walk(start_path):
        # Exclude specified directories
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]

        level = root.replace(start_path, '').count(os.sep)
        indent = ' ' * 4 * level
        output_file.write(f"{indent}📂 {os.path.basename(root)}/\n")
        sub_indent = ' ' * 4 * (level + 1)
        for f in sorted(files):
            output_file.write(f"{sub_indent}📄 {f}\n")
    output_file.write("```\n\n")

def analyze_file_content(file_path):
    """Analyzes a single file to find imports and get a content preview."""
    imports = []
    content_preview = []
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
            # Get first 25 lines for preview
            content_preview = lines[:25]
            # Simple check for import/require statements
            for line in lines:
                stripped_line = line.strip()
                if (stripped_line.startswith('import ') or
                    stripped_line.startswith('from ') or
                    'require(' in stripped_line):
                    imports.append(stripped_line)
    except Exception as e:
        return [f"Error reading file: {e}"], []
    return imports, content_preview

def analyze_project(start_path, output_file):
    """Analyzes all relevant files in the project."""
    output_file.write("## 📄 Detailed File Analysis\n\n")
    for root, dirs, files in os.walk(start_path):
        # Exclude specified directories from analysis
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]

        for file_name in sorted(files):
            file_path = os.path.join(root, file_name)
            relative_path = os.path.relpath(file_path, start_path)
            _, extension = os.path.splitext(file_name)

            if extension in ANALYZABLE_EXTENSIONS:
                output_file.write(f"### File: `{relative_path}`\n\n")

                imports, content_preview = analyze_file_content(file_path)

                # Write detected imports
                if imports:
                    output_file.write("**Detected Imports:**\n")
                    output_file.write("```\n")
                    for imp in imports:
                        output_file.write(f"{imp}\n")
                    output_file.write("```\n\n")
                else:
                    output_file.write("**Detected Imports:** None\n\n")

                # Write content preview
                if content_preview:
                    output_file.write("**Content Preview (first 25 lines):**\n")
                    output_file.write("```" + extension.replace('.', '') + "\n")
                    for line in content_preview:
                        output_file.write(line)
                    output_file.write("\n```\n\n")
                
                output_file.write("---\n\n")


def main():
    """Main function to run the script."""
    parser = argparse.ArgumentParser(description="Analyze a project directory and create a summary document.")
    parser.add_argument('directory', type=str, nargs='?', default='.', help="The root directory of the project to analyze. Defaults to the current directory.")
    args = parser.parse_args()

    project_path = os.path.abspath(args.directory)
    output_filename = "project_analysis.md"

    print(f"Starting analysis of project at: {project_path}")
    print(f"Output will be written to: {output_filename}")

    with open(output_filename, 'w', encoding='utf-8') as f:
        f.write(f"# Project Analysis for: {os.path.basename(project_path)}\n\n")
        create_directory_tree(project_path, f)
        analyze_project(project_path, f)

    print("\nAnalysis complete!")
    print(f"Please open the '{output_filename}' file, copy its contents, and paste them in our chat.")

if __name__ == "__main__":
    main()
