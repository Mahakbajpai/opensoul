package ai.opensoul.android.ui

import androidx.compose.runtime.Composable
import ai.opensoul.android.MainViewModel
import ai.opensoul.android.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
