package ai.opensoul.android.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class OpenSoulProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", OpenSoulCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", OpenSoulCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", OpenSoulCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", OpenSoulCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", OpenSoulCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", OpenSoulCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", OpenSoulCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", OpenSoulCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", OpenSoulCapability.Canvas.rawValue)
    assertEquals("camera", OpenSoulCapability.Camera.rawValue)
    assertEquals("screen", OpenSoulCapability.Screen.rawValue)
    assertEquals("voiceWake", OpenSoulCapability.VoiceWake.rawValue)
  }

  @Test
  fun screenCommandsUseStableStrings() {
    assertEquals("screen.record", OpenSoulScreenCommand.Record.rawValue)
  }
}
