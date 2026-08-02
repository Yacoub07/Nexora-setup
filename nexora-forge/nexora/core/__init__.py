"""
Core module initialization.
"""

from nexora.core.config import NexoraConfig, WorkspaceMetadata, WORKSPACE_MARKERS
from nexora.core.exceptions import (
    NexoraException,
    WorkspaceException,
    WorkspaceNotFoundError,
    WorkspaceInvalidError,
    DoctorException,
    ConfigurationError
)
from nexora.core.logging import get_logger, setup_logger
from nexora.core.version import VERSION, CODENAME, APP_NAME

__all__ = [
    "NexoraConfig",
    "WorkspaceMetadata",
    "WORKSPACE_MARKERS",
    "NexoraException",
    "WorkspaceException",
    "WorkspaceNotFoundError",
    "WorkspaceInvalidError",
    "DoctorException",
    "ConfigurationError",
    "get_logger",
    "setup_logger",
    "VERSION",
    "CODENAME",
    "APP_NAME",
]
