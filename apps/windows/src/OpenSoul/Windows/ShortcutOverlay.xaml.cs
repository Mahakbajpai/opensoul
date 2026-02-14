using System.Windows;
using System.Windows.Input;
using System.Windows.Media.Animation;

namespace OpenSoul.Windows;

/// <summary>
/// Keyboard shortcuts overlay — a floating panel that shows all available shortcuts.
/// Triggered by Ctrl+/ in the main window. Closes on Esc, Ctrl+/, or loss of focus.
/// </summary>
public partial class ShortcutOverlay : Window
{
    public ShortcutOverlay()
    {
        InitializeComponent();
    }

    /// <summary>Show the overlay with a fade-in animation.</summary>
    public void ShowAnimated()
    {
        Opacity = 0;
        Show();

        var fade = new DoubleAnimation(0, 1, TimeSpan.FromMilliseconds(150))
        {
            EasingFunction = new CubicEase { EasingMode = EasingMode.EaseOut },
        };
        BeginAnimation(OpacityProperty, fade);
    }

    /// <summary>Close with a fade-out animation.</summary>
    public void CloseAnimated()
    {
        var fade = new DoubleAnimation(1, 0, TimeSpan.FromMilliseconds(120))
        {
            EasingFunction = new CubicEase { EasingMode = EasingMode.EaseIn },
        };
        fade.Completed += (_, _) => Close();
        BeginAnimation(OpacityProperty, fade);
    }

    private void Window_KeyDown(object sender, KeyEventArgs e)
    {
        // Esc → close
        if (e.Key == Key.Escape)
        {
            CloseAnimated();
            e.Handled = true;
            return;
        }

        // Ctrl+/ → toggle (close since it's already open)
        if (e.Key == Key.Oem2 && Keyboard.Modifiers == ModifierKeys.Control)
        {
            CloseAnimated();
            e.Handled = true;
        }
    }

    private void Window_Deactivated(object? sender, EventArgs e)
    {
        // Close when window loses focus (clicked elsewhere)
        CloseAnimated();
    }
}
