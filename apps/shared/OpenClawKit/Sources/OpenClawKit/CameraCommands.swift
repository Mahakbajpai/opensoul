import Foundation

public enum OpenSoulCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum OpenSoulCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum OpenSoulCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum OpenSoulCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct OpenSoulCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: OpenSoulCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: OpenSoulCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: OpenSoulCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: OpenSoulCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct OpenSoulCameraClipParams: Codable, Sendable, Equatable {
    public var facing: OpenSoulCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: OpenSoulCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: OpenSoulCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: OpenSoulCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
