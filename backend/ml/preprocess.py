"""
Text Preprocessing Module for SpamSentinel AI.
Cleans raw text while carefully preserving critical spam signals such as currency symbols,
exclamation marks, promotional keywords, and URLs.
"""

import re
from typing import Optional

def clean_text(text: Optional[str]) -> str:
    """
    Preprocess raw input text:
    - Normalizes lowercase
    - Normalizes URLs to 'http_url' token so the model recognizes link presence
    - Normalizes currency symbols (£, $, €) to 'currency_symbol' token
    - Normalizes phone numbers / numeric codes to 'num_code' token
    - Collapses consecutive whitespace
    """
    if not text or not isinstance(text, str):
        return ""

    # Convert to string and lowercase
    cleaned = text.lower().strip()

    # Normalize URLs
    cleaned = re.sub(r'https?://\S+|www\.\S+', ' http_url ', cleaned)

    # Normalize email addresses
    cleaned = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', ' email_addr ', cleaned)

    # Normalize currency indicators (crucial for financial prize spam)
    cleaned = re.sub(r'[\$£€₹]', ' currency_symbol ', cleaned)

    # Normalize phone numbers / long numeric codes (e.g., 0906121, 87121)
    cleaned = re.sub(r'\b\d{4,14}\b', ' num_code ', cleaned)

    # Replace multiple spaces/newlines with single space
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    return cleaned

