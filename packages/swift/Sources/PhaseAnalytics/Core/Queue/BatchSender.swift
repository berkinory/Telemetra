import Foundation

internal actor BatchSender {
    private let httpClient: HTTPClient
    private let offlineQueue: OfflineQueue
    private var isFlushing = false

    private static let maxRetryCount = 5

    init(httpClient: HTTPClient, offlineQueue: OfflineQueue) {
        self.httpClient = httpClient
        self.offlineQueue = offlineQueue
    }

    func flush() async {
        guard !isFlushing else {
            logger.warn("Flush already in progress. Skipping duplicate flush.")
            return
        }

        isFlushing = true
        defer { isFlushing = false }

        let items = await offlineQueue.dequeueAll()
        guard !items.isEmpty else {
            return
        }

        let deduplicatedItems = deduplicateByTimestamp(items)
        let batches = splitIntoBatches(deduplicatedItems)

        for batch in batches {
            let result = await sendBatch(batch)

            if case .failure(let error) = result {
                logger.error("Batch request failed. Will retry.", error)
                await requeue(batch)
            }
        }
    }

    private func sendBatch(_ items: [BatchItem]) async -> Result<BatchResponse, PhaseError> {
        let request = BatchRequest(items: items)
        let result = await httpClient.sendBatch(request)

        if case .success(let response) = result {
            if response.failed > 0 {
                let total = (response.processed ?? 0) + response.failed
                logger.error("Batch partially failed: \(response.failed)/\(total) items")

                var failedItems: [BatchItem] = []

                for error in response.errors {
                    guard let clientOrder = error.clientOrder else {
                        logger.error("Error missing clientOrder. Cannot re-enqueue.")
                        continue
                    }

                    if let failedItem = items.first(where: { $0.clientOrder == clientOrder }) {
                        failedItems.append(failedItem)
                    }
                }

                if !failedItems.isEmpty {
                    await requeue(failedItems)
                }
            }
        }

        return result
    }

    private func requeue(_ items: [BatchItem]) async {
        await withTaskGroup(of: Void.self) { group in
            for item in items {
                group.addTask {
                    let retryCount = (item.retryCount ?? 0) + 1

                    guard retryCount <= Self.maxRetryCount else {
                        logger.error("Max retries exceeded. Dropping item.")
                        return
                    }

                    let newItem: BatchItem
                    switch item {
                    case .device(let payload, let order, _):
                        newItem = .device(payload: payload, clientOrder: order, retryCount: retryCount)
                    case .session(let payload, let order, _):
                        newItem = .session(payload: payload, clientOrder: order, retryCount: retryCount)
                    case .event(let payload, let order, _):
                        newItem = .event(payload: payload, clientOrder: order, retryCount: retryCount)
                    case .ping(let payload, let order, _):
                        newItem = .ping(payload: payload, clientOrder: order, retryCount: retryCount)
                    }

                    await self.offlineQueue.enqueue(newItem)
                }
            }
        }
    }

    private func deduplicateByTimestamp(_ items: [BatchItem]) -> [BatchItem] {
        var seenEvents: [String: Date] = [:]
        var dedupedItems: [BatchItem] = []
        let dedupWindow: TimeInterval = 0.05

        let iso8601Formatter = ISO8601DateFormatter()
        iso8601Formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

        for item in items {
            if case .event(let payload, _, _) = item {
                let key = createEventKey(name: payload.name, params: payload.params)

                guard let timestamp = iso8601Formatter.date(from: payload.timestamp) else {
                    logger.warn("Invalid timestamp format. Including event anyway.")
                    dedupedItems.append(item)
                    continue
                }

                if let lastTime = seenEvents[key], timestamp.timeIntervalSince(lastTime) < dedupWindow {
                    logger.warn("Duplicate event in batch detected. Dropping event: \(payload.name)")
                    continue
                }

                seenEvents[key] = timestamp
                dedupedItems.append(item)
            } else {
                dedupedItems.append(item)
            }
        }

        let droppedCount = items.count - dedupedItems.count
        if droppedCount > 0 {
            logger.info("Dropped \(droppedCount) duplicate event(s) from batch based on timestamp.")
        }

        return dedupedItems
    }

    private func createEventKey(name: String, params: [String: AnyCodable]?) -> String {
        guard let params = params else {
            return name
        }

        let sortedParams = params.sorted { $0.key < $1.key }
        if let jsonData = try? JSONSerialization.data(
            withJSONObject: sortedParams.reduce(into: [String: Any]()) { dict, pair in
                dict[pair.key] = pair.value.value
            },
            options: [.sortedKeys]
        ),
            let jsonString = String(data: jsonData, encoding: .utf8)
        {
            return "\(name):\(jsonString)"
        }

        return name
    }

    private func splitIntoBatches(_ items: [BatchItem]) -> [[BatchItem]] {
        let maxSize = ValidationConstants.Batch.maxSize
        var batches: [[BatchItem]] = []

        for i in stride(from: 0, to: items.count, by: maxSize) {
            let endIndex = min(i + maxSize, items.count)
            batches.append(Array(items[i..<endIndex]))
        }

        return batches
    }
}
