#!/usr/bin/env python3
"""
Project Structure Verification Script

Verifies that an Angular project follows the recommended structure and conventions.
Cross-platform compatible (Windows, Linux, macOS).

Usage:
    python verify-structure.py [project-path]

Examples:
    python verify-structure.py
    python verify-structure.py ./my-frontend-app
"""

import os
import sys
import json
from pathlib import Path
from typing import List, Dict, Tuple

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def colored(text: str, color: str) -> str:
    """Add color to text if terminal supports it"""
    if sys.platform == 'win32':
        # Windows may not support ANSI colors in all terminals
        return text
    return f"{color}{text}{Colors.RESET}"

class StructureVerifier:
    def __init__(self, project_path: str):
        self.project_path = Path(project_path).resolve()
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.success: List[str] = []
        
    def check_directory_exists(self, dir_path: str, description: str, critical: bool = True) -> bool:
        """Check if a directory exists"""
        full_path = self.project_path / dir_path
        if full_path.exists() and full_path.is_dir():
            self.success.append(f"✓ {description}: {dir_path}")
            return True
        else:
            msg = f"✗ Missing {description}: {dir_path}"
            if critical:
                self.errors.append(msg)
            else:
                self.warnings.append(msg)
            return False
    
    def check_file_exists(self, file_path: str, description: str, critical: bool = True) -> bool:
        """Check if a file exists"""
        full_path = self.project_path / file_path
        if full_path.exists() and full_path.is_file():
            self.success.append(f"✓ {description}: {file_path}")
            return True
        else:
            msg = f"✗ Missing {description}: {file_path}"
            if critical:
                self.errors.append(msg)
            else:
                self.warnings.append(msg)
            return False
    
    def check_angular_json(self) -> bool:
        """Verify angular.json exists and has correct structure"""
        angular_json_path = self.project_path / "angular.json"
        
        if not angular_json_path.exists():
            self.errors.append("✗ Missing angular.json")
            return False
        
        try:
            with open(angular_json_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            # Check for PrimeNG styles
            projects = config.get('projects', {})
            if not projects:
                self.warnings.append("⚠ No projects found in angular.json")
                return False
            
            project_name = list(projects.keys())[0]
            styles = projects[project_name].get('architect', {}).get('build', {}).get('options', {}).get('styles', [])
            
            primeng_styles = [
                'primeng/resources/themes',
                'primeng/resources/primeng',
                'primeicons/primeicons'
            ]
            
            missing_styles = []
            for style_pattern in primeng_styles:
                if not any(style_pattern in str(style) for style in styles):
                    missing_styles.append(style_pattern)
            
            if missing_styles:
                self.warnings.append(f"⚠ PrimeNG styles may not be configured: {', '.join(missing_styles)}")
            else:
                self.success.append("✓ PrimeNG styles configured in angular.json")
            
            return True
            
        except json.JSONDecodeError:
            self.errors.append("✗ angular.json is not valid JSON")
            return False
        except Exception as e:
            self.errors.append(f"✗ Error reading angular.json: {str(e)}")
            return False
    
    def check_package_json(self) -> bool:
        """Verify package.json and dependencies"""
        package_json_path = self.project_path / "package.json"
        
        if not package_json_path.exists():
            self.errors.append("✗ Missing package.json")
            return False
        
        try:
            with open(package_json_path, 'r', encoding='utf-8') as f:
                package = json.load(f)
            
            dependencies = package.get('dependencies', {})
            
            # Check for required dependencies
            required_deps = {
                '@angular/core': 'Angular',
                '@angular/router': 'Angular Router',
                'primeng': 'PrimeNG',
                'primeicons': 'PrimeIcons'
            }
            
            for dep, name in required_deps.items():
                if dep in dependencies:
                    self.success.append(f"✓ {name} dependency found")
                else:
                    self.warnings.append(f"⚠ {name} dependency not found ({dep})")
            
            return True
            
        except json.JSONDecodeError:
            self.errors.append("✗ package.json is not valid JSON")
            return False
        except Exception as e:
            self.errors.append(f"✗ Error reading package.json: {str(e)}")
            return False
    
    def verify_structure(self) -> Tuple[int, int, int]:
        """Main verification method"""
        print(f"\n{colored('🔍 Verifying Angular Project Structure', Colors.BOLD)}")
        print(f"Project: {self.project_path}\n")
        
        # Check core Angular files
        print(f"{colored('Checking Core Files...', Colors.BLUE)}")
        self.check_file_exists("angular.json", "Angular configuration", critical=True)
        self.check_file_exists("package.json", "Package configuration", critical=True)
        self.check_file_exists("tsconfig.json", "TypeScript configuration", critical=True)
        
        # Detailed checks
        self.check_angular_json()
        self.check_package_json()
        
        # Check recommended directory structure
        print(f"\n{colored('Checking Directory Structure...', Colors.BLUE)}")
        
        directories = [
            ("src/app", "App directory", True),
            ("src/app/components", "Components directory", False),
            ("src/app/components/share", "Share components", False),
            ("src/app/components/block", "Block components", False),
            ("src/app/components/layout", "Layout components", False),
            ("src/app/services", "Services directory", False),
            ("src/app/utils", "Utilities directory", False),
            ("src/app/views", "Views directory", False),
            ("src/app/routes", "Routes directory", False),
            ("src/app/interceptors", "Interceptors directory", False),
            ("src/app/guard", "Guards directory", False),
            ("src/app/constant", "Constants directory", False),
            ("src/environments", "Environments directory", True),
            ("src/assets", "Assets directory", True),
        ]
        
        for dir_path, desc, critical in directories:
            self.check_directory_exists(dir_path, desc, critical)
        
        # Check API library structure (optional)
        if (self.project_path / "src/api-library").exists():
            print(f"\n{colored('Checking API Library Structure...', Colors.BLUE)}")
            api_dirs = [
                ("src/api-library/lib", "API library root", False),
                ("src/api-library/lib/api", "API services", False),
                ("src/api-library/lib/model", "API models", False),
                ("src/api-library/lib/util", "API utilities", False),
            ]
            
            for dir_path, desc, critical in api_dirs:
                self.check_directory_exists(dir_path, desc, critical)
        
        return len(self.success), len(self.warnings), len(self.errors)
    
    def print_report(self):
        """Print verification report"""
        print(f"\n{colored('═' * 60, Colors.BOLD)}")
        print(f"{colored('Verification Report', Colors.BOLD)}")
        print(f"{colored('═' * 60, Colors.BOLD)}\n")
        
        if self.success:
            print(f"{colored(f'✓ Passed Checks ({len(self.success)}):', Colors.GREEN)}")
            for msg in self.success[:5]:  # Show first 5
                print(f"  {msg}")
            if len(self.success) > 5:
                print(f"  ... and {len(self.success) - 5} more")
            print()
        
        if self.warnings:
            print(f"{colored(f'⚠ Warnings ({len(self.warnings)}):', Colors.YELLOW)}")
            for msg in self.warnings:
                print(f"  {msg}")
            print()
        
        if self.errors:
            print(f"{colored(f'✗ Errors ({len(self.errors)}):', Colors.RED)}")
            for msg in self.errors:
                print(f"  {msg}")
            print()
        
        # Summary
        total = len(self.success) + len(self.warnings) + len(self.errors)
        print(f"{colored('Summary:', Colors.BOLD)}")
        print(f"  Total Checks: {total}")
        print(f"  {colored(f'Passed: {len(self.success)}', Colors.GREEN)}")
        print(f"  {colored(f'Warnings: {len(self.warnings)}', Colors.YELLOW)}")
        print(f"  {colored(f'Errors: {len(self.errors)}', Colors.RED)}")
        print()
        
        if self.errors:
            print(f"{colored('⚠ Project has critical errors that should be fixed', Colors.RED)}")
            return 1
        elif self.warnings:
            print(f"{colored('✓ Project structure is acceptable with some warnings', Colors.YELLOW)}")
            return 0
        else:
            print(f"{colored('✓ Project structure is excellent!', Colors.GREEN)}")
            return 0

def main():
    # Get project path from arguments or use current directory
    project_path = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    if not os.path.exists(project_path):
        print(f"❌ Error: Project path does not exist: {project_path}")
        sys.exit(1)
    
    verifier = StructureVerifier(project_path)
    success, warnings, errors = verifier.verify_structure()
    exit_code = verifier.print_report()
    
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
