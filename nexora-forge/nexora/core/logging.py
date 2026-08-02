"""
Reusable logging service for NEXORA Forge.
"""

import logging
import os
import sys
from typing import Optional

try:
    from rich.logging import RichHandler
    HAS_RICH = True
except ImportError:
    HAS_RICH = False

_loggers: dict[str, logging.Logger] = {}


def setup_logger(
    name: str = "nexora",
    level: Optional[str] = None,
    log_file: Optional[str] = None
) -> logging.Logger:
    """Configures and returns a structured logger."""
    if name in _loggers:
        return _loggers[name]

    logger = logging.getLogger(name)
    
    # Determine log level
    log_level_str = level or os.getenv("NEXORA_LOG_LEVEL", "INFO").upper()
    log_level = getattr(logging, log_level_str, logging.INFO)
    logger.setLevel(log_level)

    # Avoid adding handlers multiple times
    if not logger.handlers:
        if HAS_RICH and not os.getenv("NO_COLOR"):
            handler: logging.Handler = RichHandler(
                rich_tracebacks=True,
                markup=True,
                show_time=True,
                show_path=False
            )
            formatter = logging.Formatter("%(message)s")
        else:
            handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter(
                "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S"
            )

        handler.setFormatter(formatter)
        logger.addHandler(handler)

        if log_file:
            file_handler = logging.FileHandler(log_file)
            file_formatter = logging.Formatter(
                "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s"
            )
            file_handler.setFormatter(file_formatter)
            logger.addHandler(file_handler)

    _loggers[name] = logger
    return logger


def get_logger(name: str = "nexora") -> logging.Logger:
    """Retrieve or create a logger instance."""
    return setup_logger(name)
