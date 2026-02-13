import Foundation

public enum OpenSoulChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(OpenSoulChatEventPayload)
    case agent(OpenSoulAgentEventPayload)
    case seqGap
}

public protocol OpenSoulChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> OpenSoulChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [OpenSoulChatAttachmentPayload]) async throws -> OpenSoulChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> OpenSoulChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<OpenSoulChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension OpenSoulChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "OpenSoulChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> OpenSoulChatSessionsListResponse {
        throw NSError(
            domain: "OpenSoulChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
