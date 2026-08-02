"""
Centralized exception handling hierarchy for NEXORA Forge.
"""

class NexoraException(Exception):
    """Base exception class for all NEXORA Forge errors."""

    def __init__(self, message: str, exit_code: int = 1, details: str | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.exit_code = exit_code
        self.details = details

    def __str__(self) -> str:
        if self.details:
            return f"{self.message}\nDetails: {self.details}"
        return self.message


class WorkspaceException(NexoraException):
    """Base exception for workspace-related failures."""
    pass


class WorkspaceNotFoundError(WorkspaceException):
    """Raised when a NEXORA workspace manifest cannot be found."""

    def __init__(self, path: str) -> None:
        super().__init__(
            message=f"No valid NEXORA workspace detected at '{path}'.",
            exit_code=1,
            details="Ensure current directory contains 'nexora.yaml' or '.nexora/config.json'."
        )


class WorkspaceInvalidError(WorkspaceException):
    """Raised when workspace validation fails."""

    def __init__(self, errors: list[str]) -> None:
        formatted_errors = "\n".join([f" - {e}" for e in errors])
        super().__init__(
            message="NEXORA workspace validation failed with the following errors:",
            exit_code=1,
            details=formatted_errors
        )
        self.errors = errors


class DoctorException(NexoraException):
    """Raised when critical doctor diagnostic checks fail."""
    pass


class ConfigurationError(NexoraException):
    """Raised when configuration parsing or loading fails."""
    pass
