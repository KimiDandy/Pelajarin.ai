"""
Input validation utilities for preventing prompt injection attacks.

This module provides functions to validate and sanitize user input
before it reaches the AI agents, preventing prompt injection attacks.
"""

import re
from typing import List, Tuple
from belajaryuk_api.schemas.course_schema import CourseCreate


class InputValidationError(Exception):
    """Raised when input validation fails."""
    pass


class InputValidator:
    """Validates user input to prevent prompt injection and ensure quality."""

    # --- Configuration ---
    MAX_TOPIC_LENGTH = 200
    MAX_GOAL_LENGTH = 500
    MAX_DESCRIPTION_LENGTH = 1000

    # --- Security & Filtering Keywords (English & Indonesian) ---
    FORBIDDEN_KEYWORDS = {
        # Prompt Injection
        "ignore previous instructions", "disregard previous instructions", "forget everything before this",
        "override previous instructions", "forget previous instructions", "system prompt", "system message",
        "admin prompt", "developer mode", "debug mode", "test mode", "simulation mode",
        "abaikan instruksi sebelumnya", "lupakan instruksi", "prompt sistem", "pesan sistem",
        "mode pengembang", "mode debug", "mode tes", "mode simulasi",

        # System Information Access
        "system information", "system details", "environment variables", "api keys", "database",
        "password", "secret", "confidential",
        "informasi sistem", "detail sistem", "variabel lingkungan", "kunci api", "database",
        "kata sandi", "sandi", "rahasia",

        # Malicious Commands
        "delete all", "drop table", "rm -rf", "exec(", "eval(", "import os", "subprocess", "shell",
        "hapus semua", "hapus tabel", "jalankan(", "evaluasi(", "impor os",

        # Restriction Bypass
        "bypass", "override", "disable security", "remove restrictions", "unrestricted", "unfiltered",
        "lewati", "nonaktifkan keamanan", "hapus batasan", "tanpa batas", "tanpa filter",

        # HTML/JS Injection
        "<script>", "javascript:", "data:", "vbscript:", "onload=", "onerror=", "onclick=",
    }

    SUSPICIOUS_PATTERNS = [
        r'<script[^>]*>.*?</script>', r'javascript:', r'data:', r'vbscript:', r'on\w+\s*=',
        r'<iframe[^>]*>', r'<object[^>]*>', r'<embed[^>]*>', r'<link[^>]*>', r'<meta[^>]*>',
        r'<style[^>]*>.*?</style>', r'expression\s*\(', r'eval\s*\(', r'exec\s*\(',
        r'import\s+(os|subprocess|sys)', r'shell\s*=', r'__import__', r'globals', r'locals',
        r'\{\{.*\}\}', r'\$\{.*\}', r'(.)\1{4,}'  # Repetitive chars like 'aaaaa'
    ]

    GENERAL_TOPICS = {
        'matematika', 'fisika', 'kimia', 'biologi', 'sejarah', 'geografi', 'ekonomi', 'sosiologi',
        'bahasa indonesia', 'bahasa inggris', 'bahasa jepang', 'bahasa mandarin', 'pemrograman',
        'ilmu komputer', 'teknologi informasi', 'desain grafis', 'seni musik', 'olahraga',
        'kesehatan', 'psikologi', 'filsafat', 'bisnis', 'pemasaran', 'akuntansi', 'manajemen',
        'hukum', 'politik', 'pemerintahan', 'agama', 'kewarganegaraan',
    }

    @classmethod
    def validate_course_input(cls, topic: str, goal: str = "", description: str = "") -> Tuple[bool, List[str]]:
        """
        Validates course creation input for security and quality.
        Returns a tuple of (is_valid, list_of_errors).
        """
        errors = []
        combined_text = f"{topic} {goal} {description}".lower()

        # 1. Basic Checks (Emptiness & Length)
        if not topic or not topic.strip():
            return False, ["Topik pembelajaran tidak boleh kosong."]
        if len(topic) > cls.MAX_TOPIC_LENGTH:
            errors.append(f"Topik terlalu panjang (maksimal {cls.MAX_TOPIC_LENGTH} karakter).")
        if len(goal) > cls.MAX_GOAL_LENGTH:
            errors.append(f"Tujuan terlalu panjang (maksimal {cls.MAX_GOAL_LENGTH} karakter).")
        if len(description) > cls.MAX_DESCRIPTION_LENGTH:
            errors.append(f"Deskripsi terlalu panjang (maksimal {cls.MAX_DESCRIPTION_LENGTH} karakter).")

        # 2. Quality Checks
        topic_clean = topic.strip()
        if len(topic_clean) < 5:
            errors.append("Topik terlalu pendek. Harap berikan judul yang lebih deskriptif (minimal 5 karakter).")
        
        is_general = any(gen_topic in topic_clean.lower() for gen_topic in cls.GENERAL_TOPICS)
        if len(topic_clean.split()) <= 2 and is_general:
            errors.append("Topik terlalu umum. Coba buat lebih spesifik, contoh: 'Dasar-dasar Kalkulus untuk Pemula' bukan hanya 'Matematika'.")

        # 3. Security Checks (Forbidden Keywords & Patterns)
        if any(keyword in combined_text for keyword in cls.FORBIDDEN_KEYWORDS):
            errors.append("Input mengandung kata-kata yang tidak diizinkan. Harap periksa kembali.")

        if any(re.search(pattern, combined_text, re.IGNORECASE) for pattern in cls.SUSPICIOUS_PATTERNS):
            errors.append("Input mengandung pola atau karakter yang mencurigakan.")

        if errors:
            return False, list(set(errors))  # Return unique errors

        return True, []
    
    @classmethod
    def sanitize_input(cls, text: str) -> str:
        """
        Sanitizes input by removing potentially harmful characters.
        
        Args:
            text: The input text to sanitize
            
        Returns:
            Sanitized text
        """
        if not text:
            return text
            
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        
        # Remove script tags and content
        text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
        
        # Remove potential SQL injection attempts
        text = re.sub(r'(union|select|insert|update|delete|drop|create|alter|exec|execute)\s', 
                     '', text, flags=re.IGNORECASE)
        
        # Remove excessive special characters
        text = re.sub(r'[^\w\s\-.,!?;:()\[\]{}"\'\u00C0-\u024F\u1E00-\u1EFF]', '', text)
        
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    @classmethod
    def _contains_suspicious_patterns(cls, text: str) -> bool:
        """
        Checks for suspicious patterns that might indicate prompt injection.
        
        Args:
            text: The text to check
            
        Returns:
            True if suspicious patterns are found
        """
        # Check for excessive special characters
        special_char_ratio = len(re.findall(r'[^\w\s]', text)) / max(len(text), 1)
        if special_char_ratio > 0.3:
            return True
            
        # Check for repeated patterns
        if re.search(r'(\b\w+\b)\s+\1\s+\1', text):
            return True
            
        # Check for very long words (potential encoding attempts)
        if re.search(r'\b\w{50,}\b', text):
            return True
            
        # Check for excessive use of quotes or brackets
        if text.count('"') > 10 or text.count('(') > 10:
            return True
            
        return False
    
    @classmethod
    def validate_and_sanitize(cls, topic: str, goal: str = "", description: str = "") -> Tuple[str, str, str, List[str]]:
        """
        Validates and sanitizes all input fields.
        
        Args:
            topic: The course topic
            goal: The learning goal
            description: The course description
            
        Returns:
            Tuple of (sanitized_topic, sanitized_goal, sanitized_description, errors)
        """
        # Sanitize inputs
        sanitized_topic = cls.sanitize_input(topic)
        sanitized_goal = cls.sanitize_input(goal)
        sanitized_description = cls.sanitize_input(description)
        
        # Validate sanitized inputs
        is_valid, errors = cls.validate_course_input(
            sanitized_topic, 
            sanitized_goal, 
            sanitized_description
        )
        
        if not is_valid:
            raise InputValidationError("; ".join(errors))
            
        return sanitized_topic, sanitized_goal, sanitized_description, errors


def validate_course_creation_input(course_create_data: CourseCreate) -> Tuple[str, str, str]:
    """
    Convenience function for validating course creation input.
    
    Args:
        course_create_data: The course creation data
        description: The course description
        
    Returns:
        Tuple of (sanitized_topic, sanitized_goal, sanitized_description)
        
    Raises:
        InputValidationError: If validation fails
    """
    sanitized_topic, sanitized_goal, _, _ = InputValidator.validate_and_sanitize(
        topic=course_create_data.topic, 
        goal=course_create_data.goal, 
        description=""  # CourseCreate doesn't have description field
    )
    return sanitized_topic, sanitized_goal, ""
