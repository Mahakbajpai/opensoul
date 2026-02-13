// swift-tools-version: 6.2
// Package manifest for the OpenSoul macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "OpenSoul",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "OpenSoulIPC", targets: ["OpenSoulIPC"]),
        .library(name: "OpenSoulDiscovery", targets: ["OpenSoulDiscovery"]),
        .executable(name: "OpenSoul", targets: ["OpenSoul"]),
        .executable(name: "opensoul-mac", targets: ["OpenSoulMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/OpenSoulKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "OpenSoulIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OpenSoulDiscovery",
            dependencies: [
                .product(name: "OpenSoulKit", package: "OpenSoulKit"),
            ],
            path: "Sources/OpenSoulDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "OpenSoul",
            dependencies: [
                "OpenSoulIPC",
                "OpenSoulDiscovery",
                .product(name: "OpenSoulKit", package: "OpenSoulKit"),
                .product(name: "OpenSoulChatUI", package: "OpenSoulKit"),
                .product(name: "OpenSoulProtocol", package: "OpenSoulKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/OpenSoul.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "OpenSoulMacCLI",
            dependencies: [
                "OpenSoulDiscovery",
                .product(name: "OpenSoulKit", package: "OpenSoulKit"),
                .product(name: "OpenSoulProtocol", package: "OpenSoulKit"),
            ],
            path: "Sources/OpenSoulMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "OpenSoulIPCTests",
            dependencies: [
                "OpenSoulIPC",
                "OpenSoul",
                "OpenSoulDiscovery",
                .product(name: "OpenSoulProtocol", package: "OpenSoulKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
