# backend/belajaryuk_api/services/ai_service.py

import os
import json
import google.generativeai as genai
from fastapi import HTTPException, status

from belajaryuk_api.core.config import settings
from belajaryuk_api.core.model_config import AI_MODELS
from belajaryuk_api.prompts.gatekeeper_prompt import create_gatekeeper_prompt
from belajaryuk_api.prompts.architect_prompt import create_architect_prompt

# Configure the Gemini API key
try:
    genai.configure(api_key=settings.GOOGLE_API_KEY)
except AttributeError as e:
    raise RuntimeError("GOOGLE_API_KEY not found in settings. Please check your .env file.") from e

def _call_gemini(model_name: str, prompt: str) -> str:
    """A helper function to call the Gemini API and get the response text."""
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        # Clean the response to extract pure JSON
        cleaned_response = response.text.strip().replace('```json', '').replace('```', '').strip()
        return cleaned_response
    except Exception as e:
        # Broad exception to catch potential API errors (e.g., connection, auth)
        print(f"Error calling Gemini API: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI service is currently unavailable. Please try again later."
        )

def run_course_creation_flow(topic: str, difficulty: str, goal: str) -> dict:
    """
    Orchestrates the full AI workflow for creating a course blueprint.

    1. Calls the Gatekeeper agent to validate and refine the topic.
    2. If viable, calls the Architect agent to generate the course blueprint.

    Returns:
        A dictionary containing the structured course blueprint.

    Raises:
        HTTPException: If the topic is not viable or if there's an AI service error.
    """
    # Step 1: Call Gatekeeper Agent
    gatekeeper_prompt = create_gatekeeper_prompt(topic, difficulty, goal)
    
    print("\n--- [AI Service Log] --- ")
    print("\n[Gatekeeper] Mengirim prompt:")
    print(gatekeeper_prompt)
    print("-------------------------")

    gatekeeper_response_str = _call_gemini(AI_MODELS["GATEKEEPER"], gatekeeper_prompt)
    
    print("\n[Gatekeeper] Menerima respons mentah:")
    print(gatekeeper_response_str)
    print("-------------------------")

    # Step 2: Validate Gatekeeper Response
    try:
        gatekeeper_data = json.loads(gatekeeper_response_str)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI Gatekeeper returned an invalid format."
        )

    if not gatekeeper_data.get("is_viable"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "Topic is not viable for a course.",
                "reason": gatekeeper_data.get("reason", "No reason provided."),
                "suggestion": gatekeeper_data.get("suggestion", "No suggestion provided.")
            }
        )

    refined_topic = gatekeeper_data.get("refined_topic", topic)

    # Step 3: Call Architect Agent
    architect_prompt = create_architect_prompt(refined_topic, difficulty, goal)

    print("\n[Architect] Mengirim prompt:")
    print(architect_prompt)
    print("-------------------------")

    architect_response_str = _call_gemini(AI_MODELS["ARCHITECT"], architect_prompt)

    print("\n[Architect] Menerima respons mentah:")
    print(architect_response_str)
    print("--- [AI Service Log Selesai] ---\n")

    # Step 4: Validate Architect Response
    try:
        architect_data = json.loads(architect_response_str)
        # Basic validation for key structure
        if "course_title" not in architect_data or "modules" not in architect_data:
            raise ValueError("Missing required keys in architect response.")
        return architect_data
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Architect response parsing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI Architect failed to generate a valid course structure."
        )
