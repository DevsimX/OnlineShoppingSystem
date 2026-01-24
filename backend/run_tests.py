#!/usr/bin/env python
"""
Auto-discover and run all Django tests.
This script finds all test_*.py files in apps/*/tests/ directories
and passes them to Django's test command.
"""
import os
import subprocess
import sys
from pathlib import Path

def discover_test_modules():
    """Discover all test modules in apps/*/tests/ directories."""
    base_dir = Path(__file__).parent
    apps_dir = base_dir / 'apps'
    
    test_modules = []
    
    if not apps_dir.exists():
        print(f"Error: apps directory not found at {apps_dir}")
        return []
    
    # Find all apps with tests/ subdirectories
    for app_dir in apps_dir.iterdir():
        if not app_dir.is_dir():
            continue
        
        tests_dir = app_dir / 'tests'
        if not tests_dir.exists() or not tests_dir.is_dir():
            continue
        
        # Find all test_*.py files in the tests directory
        for test_file in tests_dir.glob('test_*.py'):
            # Convert to module path: apps.authentication.tests.test_views
            module_name = test_file.stem  # e.g., 'test_views'
            module_path = f"apps.{app_dir.name}.tests.{module_name}"
            test_modules.append(module_path)
    
    return sorted(test_modules)

def main():
    """Run Django tests with auto-discovered test modules."""
    test_modules = discover_test_modules()
    
    if not test_modules:
        print("No test modules found!")
        sys.exit(1)
    
    print(f"Discovered {len(test_modules)} test module(s):")
    for module in test_modules:
        print(f"  - {module}")
    print()
    
    # Build the test command
    cmd = ['python', 'manage.py', 'test', '--verbosity=2'] + test_modules
    
    # Run the tests
    result = subprocess.run(cmd)
    sys.exit(result.returncode)

if __name__ == '__main__':
    main()
