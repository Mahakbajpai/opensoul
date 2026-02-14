using System.IO.Pipes;
using Microsoft.Extensions.Logging;
using Microsoft.Win32;

namespace OpenSoul.Services;

/// <summary>
/// Manages the opensoul:// deep link protocol.
///
/// Handles:
/// - Protocol registration (opensoul:// → this application)
/// - Parsing incoming deep links
/// - Single-instance coordination via named pipe
///
/// Supported URL formats:
/// - opensoul://chat                  → navigate to chat
/// - opensoul://chat?session=myKey    → open chat with specific session
/// - opensoul://devices               → navigate to devices
/// - opensoul://overview              → navigate to overview
/// - opensoul://settings              → open settings
/// - opensoul://connect?url=ws://...  → connect to a remote gateway
/// </summary>
public sealed class DeepLinkService : IDisposable
{
    private const string PROTOCOL_SCHEME = "opensoul";
    private const string PIPE_NAME = "OpenSoul.DeepLink";

    private readonly ILogger<DeepLinkService> _logger;
    private CancellationTokenSource? _pipeCts;
    private bool _disposed;

    /// <summary>Fired when a deep link navigation is received.</summary>
    public event Action<DeepLinkAction>? LinkReceived;

    public DeepLinkService(ILogger<DeepLinkService> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Register the opensoul:// protocol in the Windows registry.
    /// Must be run with appropriate permissions (per-user registration doesn't need admin).
    /// </summary>
    public void RegisterProtocol()
    {
        try
        {
            var exePath = Environment.ProcessPath;
            if (string.IsNullOrEmpty(exePath))
            {
                _logger.LogWarning("Cannot register protocol: process path unknown");
                return;
            }

            // Register under HKCU\Software\Classes\opensoul (per-user, no admin needed)
            using var key = Registry.CurrentUser.CreateSubKey($@"Software\Classes\{PROTOCOL_SCHEME}");
            if (key is null) return;

            key.SetValue("", $"URL:{PROTOCOL_SCHEME} Protocol");
            key.SetValue("URL Protocol", "");

            using var iconKey = key.CreateSubKey("DefaultIcon");
            iconKey?.SetValue("", $"\"{exePath}\",0");

            using var cmdKey = key.CreateSubKey(@"shell\open\command");
            cmdKey?.SetValue("", $"\"{exePath}\" --deeplink \"%1\"");

            _logger.LogInformation("Registered opensoul:// protocol handler");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to register protocol handler");
        }
    }

    /// <summary>
    /// Try to send a deep link to an already-running instance via named pipe.
    /// Returns true if another instance handled the link.
    /// </summary>
    public static bool TrySendToRunningInstance(string uri)
    {
        try
        {
            using var client = new NamedPipeClientStream(".", PIPE_NAME, PipeDirection.Out);
            client.Connect(timeout: 1000);

            using var writer = new System.IO.StreamWriter(client) { AutoFlush = true };
            writer.WriteLine(uri);
            return true;
        }
        catch
        {
            // No running instance — we are the first
            return false;
        }
    }

    /// <summary>
    /// Start listening for deep links from other instances via named pipe.
    /// Call this from the main (first) instance.
    /// </summary>
    public void StartListening()
    {
        _pipeCts = new CancellationTokenSource();
        _ = ListenForPipeMessages(_pipeCts.Token);
    }

    /// <summary>Parse a deep link URI and fire the LinkReceived event.</summary>
    public void HandleUri(string uri)
    {
        try
        {
            var action = ParseUri(uri);
            if (action is not null)
            {
                _logger.LogInformation("Deep link: {Action} ({Param})", action.Type, action.Parameter ?? "");
                LinkReceived?.Invoke(action);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse deep link: {Uri}", uri);
        }
    }

    /// <summary>Parse a opensoul:// URI into a structured action.</summary>
    private static DeepLinkAction? ParseUri(string rawUri)
    {
        if (string.IsNullOrWhiteSpace(rawUri)) return null;

        // Handle format: opensoul://path?query
        if (!Uri.TryCreate(rawUri, UriKind.Absolute, out var uri)) return null;
        if (!string.Equals(uri.Scheme, PROTOCOL_SCHEME, StringComparison.OrdinalIgnoreCase))
            return null;

        var path = uri.Host.ToLowerInvariant();
        var query = System.Web.HttpUtility.ParseQueryString(uri.Query);

        return path switch
        {
            "chat" => new DeepLinkAction(DeepLinkType.Navigate, "chat", query["session"]),
            "overview" or "dashboard" => new DeepLinkAction(DeepLinkType.Navigate, "overview"),
            "devices" => new DeepLinkAction(DeepLinkType.Navigate, "devices"),
            "config" or "settings" => new DeepLinkAction(DeepLinkType.OpenSettings),
            "connect" => new DeepLinkAction(DeepLinkType.Connect, query["url"]),
            _ => new DeepLinkAction(DeepLinkType.Navigate, path),
        };
    }

    /// <summary>Listen for incoming deep links from other instances via named pipe.</summary>
    private async Task ListenForPipeMessages(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                using var server = new NamedPipeServerStream(
                    PIPE_NAME, PipeDirection.In, 1, PipeTransmissionMode.Byte,
                    System.IO.Pipes.PipeOptions.Asynchronous);

                await server.WaitForConnectionAsync(ct);

                using var reader = new System.IO.StreamReader(server);
                var line = await reader.ReadLineAsync(ct);

                if (!string.IsNullOrWhiteSpace(line))
                {
                    HandleUri(line);
                }
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error in deep link pipe listener");
                // Brief backoff before retrying
                await Task.Delay(500, ct);
            }
        }
    }

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        _pipeCts?.Cancel();
        _pipeCts?.Dispose();
    }
}

/// <summary>Parsed deep link action.</summary>
public sealed class DeepLinkAction
{
    public DeepLinkType Type { get; }
    public string? Parameter { get; }
    public string? Extra { get; }

    public DeepLinkAction(DeepLinkType type, string? parameter = null, string? extra = null)
    {
        Type = type;
        Parameter = parameter;
        Extra = extra;
    }
}

/// <summary>Deep link action types.</summary>
public enum DeepLinkType
{
    /// <summary>Navigate to a tab (parameter = tab name).</summary>
    Navigate,
    /// <summary>Open the native settings window.</summary>
    OpenSettings,
    /// <summary>Connect to a remote gateway (parameter = URL).</summary>
    Connect,
}
