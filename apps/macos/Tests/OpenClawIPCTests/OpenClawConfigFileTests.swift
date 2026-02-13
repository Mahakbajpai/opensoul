import Foundation
import Testing
@testable import OpenSoul

@Suite(.serialized)
struct OpenSoulConfigFileTests {
    @Test
    func configPathRespectsEnvOverride() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("opensoul-config-\(UUID().uuidString)")
            .appendingPathComponent("opensoul.json")
            .path

        await TestIsolation.withEnvValues(["OPENSOUL_CONFIG_PATH": override]) {
            #expect(OpenSoulConfigFile.url().path == override)
        }
    }

    @MainActor
    @Test
    func remoteGatewayPortParsesAndMatchesHost() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("opensoul-config-\(UUID().uuidString)")
            .appendingPathComponent("opensoul.json")
            .path

        await TestIsolation.withEnvValues(["OPENSOUL_CONFIG_PATH": override]) {
            OpenSoulConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "ws://gateway.ts.net:19999",
                    ],
                ],
            ])
            #expect(OpenSoulConfigFile.remoteGatewayPort() == 19999)
            #expect(OpenSoulConfigFile.remoteGatewayPort(matchingHost: "gateway.ts.net") == 19999)
            #expect(OpenSoulConfigFile.remoteGatewayPort(matchingHost: "gateway") == 19999)
            #expect(OpenSoulConfigFile.remoteGatewayPort(matchingHost: "other.ts.net") == nil)
        }
    }

    @MainActor
    @Test
    func setRemoteGatewayUrlPreservesScheme() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("opensoul-config-\(UUID().uuidString)")
            .appendingPathComponent("opensoul.json")
            .path

        await TestIsolation.withEnvValues(["OPENSOUL_CONFIG_PATH": override]) {
            OpenSoulConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "wss://old-host:111",
                    ],
                ],
            ])
            OpenSoulConfigFile.setRemoteGatewayUrl(host: "new-host", port: 2222)
            let root = OpenSoulConfigFile.loadDict()
            let url = ((root["gateway"] as? [String: Any])?["remote"] as? [String: Any])?["url"] as? String
            #expect(url == "wss://new-host:2222")
        }
    }

    @Test
    func stateDirOverrideSetsConfigPath() async {
        let dir = FileManager().temporaryDirectory
            .appendingPathComponent("opensoul-state-\(UUID().uuidString)", isDirectory: true)
            .path

        await TestIsolation.withEnvValues([
            "OPENSOUL_CONFIG_PATH": nil,
            "OPENSOUL_STATE_DIR": dir,
        ]) {
            #expect(OpenSoulConfigFile.stateDirURL().path == dir)
            #expect(OpenSoulConfigFile.url().path == "\(dir)/opensoul.json")
        }
    }
}
