import Foundation

internal final class Logger: Sendable {
    private let levelValue: ThreadSafeLock<Int>

    private let levels: [LogLevel: Int] = [
        .info: 0,
        .warn: 1,
        .error: 2,
        .none: 3,
    ]

    init() {
        self.levelValue = ThreadSafeLock(3)
    }

    func setLogLevel(_ level: LogLevel) {
        levelValue.withLock { $0 = levels[level] ?? 3 }
    }

    func info(_ message: String) {
        levelValue.withLock { currentLevel in
            guard currentLevel <= (levels[.info] ?? 0) else { return }
            print("[Phase] \(message)")
        }
    }

    func warn(_ message: String) {
        levelValue.withLock { currentLevel in
            guard currentLevel <= (levels[.warn] ?? 1) else { return }
            print("[Phase] \(message)")
        }
    }

    func error(_ message: String, _ error: Error? = nil) {
        levelValue.withLock { currentLevel in
            guard currentLevel <= (levels[.error] ?? 2) else { return }
            if let error = error {
                print("[Phase] \(message): \(error.localizedDescription)")
            } else {
                print("[Phase] \(message)")
            }
        }
    }
}

internal let logger = Logger()
