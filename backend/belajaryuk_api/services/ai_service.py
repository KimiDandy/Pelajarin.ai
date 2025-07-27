# backend/belajaryuk_api/services/ai_service.py

import json
import google.generativeai as genai
from fastapi import HTTPException, status
from google.api_core.exceptions import ResourceExhausted
import logging

from belajaryuk_api.core.model_config import AI_MODELS
from belajaryuk_api.prompts.gatekeeper_prompt import create_gatekeeper_prompt
from belajaryuk_api.prompts.architect_prompt import create_architect_prompt
from belajaryuk_api.core.api_key_manager import api_key_manager


def _call_gemini(model_name: str, prompt: str) -> str:
    """A helper function to call the Gemini API with key rotation."""
    num_keys = len(api_key_manager.keys)
    for attempt in range(num_keys):
        current_key = api_key_manager.get_key()
        if not current_key:
            raise HTTPException(status_code=500, detail="No API keys available.")

        try:
            genai.configure(api_key=current_key)
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            cleaned_response = response.text.strip().replace('```json', '').replace('```', '').strip()
            return cleaned_response
        except ResourceExhausted as e:
            logging.warning(f"API key ending in '...{current_key[-4:]}' hit a rate limit. Rotating key.")
            api_key_manager.rotate_key()
            if attempt == num_keys - 1:
                logging.error("All API keys are rate-limited.")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="All available AI service keys are currently rate-limited. Please try again later."
                ) from e
        except Exception as e:
            logging.error(f"An unexpected error occurred with Gemini API: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="An unexpected error occurred with the AI service."
            ) from e
    # This part should not be reachable if there's at least one key
    raise HTTPException(status_code=500, detail="Failed to get a response from AI service after trying all keys.")

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

# --- Milestone 2: Experience Generator --- #

import logging
from typing import Dict, Any, Optional
from google.generativeai.types import GenerationConfig
from ..prompts.experience_generator_prompt import create_experience_generator_prompt

async def _call_gemini_async(
    model_name: str, 
    prompt: str, 
    expect_json: bool = False
) -> str:
    """An async helper function to call the Gemini API with key rotation."""
    num_keys = len(api_key_manager.keys)
    for attempt in range(num_keys):
        current_key = api_key_manager.get_key()
        if not current_key:
            raise HTTPException(status_code=500, detail="No API keys available.")

        try:
            genai.configure(api_key=current_key)
            model = genai.GenerativeModel(model_name)
            generation_config = GenerationConfig(response_mime_type="application/json") if expect_json else None
            response = await model.generate_content_async(prompt, generation_config=generation_config)
            return response.text
        except ResourceExhausted as e:
            logging.warning(f"API key ending in '...{current_key[-4:]}' hit a rate limit. Rotating key.")
            api_key_manager.rotate_key()
            if attempt == num_keys - 1:
                logging.error("All API keys are rate-limited.")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="All available AI service keys are currently rate-limited. Please try again later."
                ) from e
        except Exception as e:
            logging.error(f"An unexpected error occurred with Gemini API asynchronously: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="An unexpected error occurred with the AI service."
            ) from e

    raise HTTPException(status_code=500, detail="Failed to get a response from AI service after trying all keys.")

async def generate_experience_for_sub_topic(
    course_title: str,
    course_description: str,
    module_title: str,
    current_sub_topic_title: str,
    next_sub_topic_title: Optional[str],
    previous_sub_topic_summary: Optional[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Generates the full learning experience content for a single sub-topic.
    """
    logger = logging.getLogger(__name__)
    logger.info(f"Generating experience for sub-topic: {current_sub_topic_title}")

    try:
        # 1. Create the full prompt using the existing helper
        prompt = create_experience_generator_prompt(
            course_title=course_title,
            course_description=course_description,
            module_title=module_title,
            current_sub_topic_title=current_sub_topic_title,
            next_sub_topic_title=next_sub_topic_title,
            previous_sub_topic_summary=previous_sub_topic_summary
        )

        # 2. Call the Gemini API, expecting a JSON response
        raw_response = await _call_gemini_async(
            AI_MODELS["EXPERIENCE_GENERATOR"], 
            prompt, 
            expect_json=True
        )

        # 3. Safely parse the JSON
        generated_content = json.loads(raw_response)

        logger.info(f"Successfully generated and parsed content for: {current_sub_topic_title}")
        return generated_content

    except json.JSONDecodeError as e:
        logger.error(f"Failed to decode JSON from AI response for sub-topic '{current_sub_topic_title}': {e}")
        raise ValueError("AI response was not valid JSON.")
    except Exception as e:
        logger.error(f"An unexpected error occurred in AI service for sub-topic '{current_sub_topic_title}': {e}", exc_info=True)
        raise


def generate_experience_for_sub_topic(
    course_title: str,
    course_description: str,
    difficulty_level: str,
    module_title: str,
    current_sub_topic_title: str,
    subtopic_order: int,
    total_subtopics: int,
    next_sub_topic_title: Optional[str],
    previous_sub_topic_summary: Optional[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Synchronous version: Generates the full learning experience content for a single sub-topic.
    """
    logger = logging.getLogger(__name__)
    logger.info(f"Generating experience for sub-topic: {current_sub_topic_title}")

    try:
        # 1. Create the full prompt using the existing helper
        prompt = create_experience_generator_prompt(
            course_title=course_title,
            course_description=course_description,
            difficulty_level=difficulty_level,
            current_module_title=module_title,  # Fix: Rename to match prompt function
            current_subtopic_title=current_sub_topic_title,
            subtopic_order=subtopic_order,
            total_subtopics=total_subtopics,
            context_from_previous=json.dumps(previous_sub_topic_summary) if previous_sub_topic_summary else "",
            next_subtopic_preview=next_sub_topic_title or ""
        )

        # 2. Call the Gemini API, expecting a JSON response
        raw_response = _call_gemini(
            AI_MODELS["EXPERIENCE_GENERATOR"], 
            prompt
        )

        # 3. Safely parse the JSON
        generated_content = json.loads(raw_response)

        logger.info(f"Successfully generated and parsed content for: {current_sub_topic_title}")
        return generated_content

    except json.JSONDecodeError as e:
        logger.error(f"Failed to decode JSON from AI response for sub-topic '{current_sub_topic_title}': {e}")
        raise ValueError("AI response was not valid JSON.")
    except Exception as e:
        logger.error(f"An unexpected error occurred in AI service for sub-topic '{current_sub_topic_title}': {e}", exc_info=True)
        raise
