#!/usr/bin/env python3
"""
Test script to validate all regex patterns in InputValidator
"""

import re
import sys
import traceback
from input_validator import InputValidator

def test_regex_compilation():
    """Test compilation of all regex patterns"""
    print("Testing regex compilation...")
    
    # Test SUSPICIOUS_PATTERNS
    print("\n1. Testing SUSPICIOUS_PATTERNS:")
    for i, pattern in enumerate(InputValidator.SUSPICIOUS_PATTERNS):
        try:
            compiled = re.compile(pattern, re.IGNORECASE)
            print(f"   ✓ Pattern {i+1}: {pattern}")
        except re.error as e:
            print(f"   ✗ Pattern {i+1}: {pattern}")
            print(f"     Error: {e}")
            return False
    
    # Test patterns used in sanitize_input
    print("\n2. Testing sanitize_input patterns:")
    sanitize_patterns = [
        r'<[^>]+>',
        r'<script[^>]*>.*?</script>',
        r'(union|select|insert|update|delete|drop|create|alter|exec|execute)\s',
        r'[^\w\s\-.,!?;:()\[\]{}"\'\u00C0-\u024F\u1E00-\u1EFF]',
        r'\s+'
    ]
    
    for i, pattern in enumerate(sanitize_patterns):
        try:
            compiled = re.compile(pattern, re.IGNORECASE | re.DOTALL)
            print(f"   ✓ Sanitize pattern {i+1}: {pattern}")
        except re.error as e:
            print(f"   ✗ Sanitize pattern {i+1}: {pattern}")
            print(f"     Error: {e}")
            return False
    
    # Test patterns used in _contains_suspicious_patterns
    print("\n3. Testing _contains_suspicious_patterns patterns:")
    suspicious_patterns = [
        r'[^\w\s]',
        r'(\b\w+\b)\s+\1\s+\1',
        r'\b\w{50,}\b',
    ]
    
    for i, pattern in enumerate(suspicious_patterns):
        try:
            compiled = re.compile(pattern)
            print(f"   ✓ Suspicious pattern {i+1}: {pattern}")
        except re.error as e:
            print(f"   ✗ Suspicious pattern {i+1}: {pattern}")
            print(f"     Error: {e}")
            return False
    
    return True

def test_input_validation():
    """Test actual input validation with various inputs"""
    print("\n4. Testing input validation with sample inputs:")
    
    test_cases = [
        ("Matematika Dasar", "Belajar kalkulus", "Kursus untuk pemula"),
        ("<script>alert('xss')</script>", "test", "test"),
        ("Python Programming", "eval('malicious')", "test"),
        ("aaaaa", "test", "test"),  # Repetitive chars
        ("Valid Course", "Valid goal", "Valid description"),
    ]
    
    for topic, goal, desc in test_cases:
        try:
            result = InputValidator.validate_course_input(topic, goal, desc)
            print(f"   ✓ Input: '{topic[:30]}...' -> {result[0]}")
        except Exception as e:
            print(f"   ✗ Input: '{topic[:30]}...' -> Error: {e}")
            traceback.print_exc()
            return False
    
    return True

def main():
    """Main test function"""
    print("=" * 50)
    print("InputValidator Regex Test Suite")
    print("=" * 50)
    
    try:
        if test_regex_compilation() and test_input_validation():
            print("\n" + "=" * 50)
            print("✅ ALL TESTS PASSED - No regex compilation errors!")
            print("=" * 50)
            return 0
        else:
            print("\n" + "=" * 50)
            print("❌ TESTS FAILED - Regex compilation errors found!")
            print("=" * 50)
            return 1
    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {e}")
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
