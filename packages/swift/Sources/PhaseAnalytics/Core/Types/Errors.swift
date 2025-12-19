import Foundation

/// Errors that can occur during Phase SDK operations
///
/// ## Common Errors
/// - `invalidAPIKey`: API key is missing or doesn't start with "phase_"
/// - `notInitialized`: SDK methods called before `initialize()`
/// - `validationFailed`: Event name or params don't meet requirements
public enum PhaseError: Error, Sendable {
    case invalidAPIKey
    case notInitialized
    case validationFailed(String)
    case networkError(String)
    case httpError(statusCode: Int, message: String)
    case storageError(String)
    case encodingError
    case decodingError

    public var localizedDescription: String {
        switch self {
        case .invalidAPIKey:
            return "Invalid API key format. API key must start with 'phase_'"
        case .notInitialized:
            return "SDK not initialized. Call initialize() first."
        case .validationFailed(let message):
            return "Validation failed: \(message)"
        case .networkError(let message):
            return "Network error: \(message)"
        case .httpError(let statusCode, let message):
            return "HTTP error (\(statusCode)): \(message)"
        case .storageError(let message):
            return "Storage error: \(message)"
        case .encodingError:
            return "Failed to encode data"
        case .decodingError:
            return "Failed to decode data"
        }
    }
}

public final class HTTPError: Error, Sendable {
    public let statusCode: Int
    public let message: String

    public init(statusCode: Int, message: String) {
        self.statusCode = statusCode
        self.message = message
    }

    public func isRetryable() -> Bool {
        return statusCode >= 500 && statusCode < 600
    }
}
