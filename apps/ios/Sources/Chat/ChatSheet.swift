import OpenSoulChatUI
import OpenSoulKit
import SwiftUI

struct ChatSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var viewModel: OpenSoulChatViewModel
    private let userAccent: Color?

    init(gateway: GatewayNodeSession, sessionKey: String, userAccent: Color? = nil) {
        let transport = IOSGatewayChatTransport(gateway: gateway)
        self._viewModel = State(
            initialValue: OpenSoulChatViewModel(
                sessionKey: sessionKey,
                transport: transport))
        self.userAccent = userAccent
    }

    var body: some View {
        NavigationStack {
            OpenSoulChatView(
                viewModel: self.viewModel,
                showsSessionSwitcher: true,
                userAccent: self.userAccent)
                .navigationTitle("Chat")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button {
                            self.dismiss()
                        } label: {
                            Image(systemName: "xmark")
                        }
                        .accessibilityLabel("Close")
                    }
                }
        }
    }
}
