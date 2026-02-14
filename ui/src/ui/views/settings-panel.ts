/**
 * Settings panel — a Notion-style modal overlay containing:
 *   - General (theme toggle)
 *   - Config (existing config view)
 *   - Logs (existing logs view)
 *   - Debug (existing debug view)
 *   - GitHub (external link)
 */
import { html, nothing } from "lit";
import type { AppViewState } from "../app-view-state.ts";
import type { SettingsTab } from "../navigation.ts";
import { renderThemeToggle } from "../app-render.helpers.ts";
import { icons } from "../icons.ts";

/** All sections available in the settings panel. */
type SettingsSection = SettingsTab | "general";

/** Left sidebar nav items for the settings panel. */
const SETTINGS_NAV: Array<{
  id: SettingsSection;
  label: string;
  icon: keyof typeof icons;
}> = [
  { id: "general", label: "General", icon: "settings" },
  { id: "config", label: "Config", icon: "settings" },
  { id: "logs", label: "Logs", icon: "scrollText" },
  { id: "debug", label: "Debug", icon: "bug" },
];

/** Render the General settings section content. */
function renderGeneralSection(state: AppViewState) {
  return html`
    <div class="settings-section">
      <h3 class="settings-section__title">Appearance</h3>
      <div class="settings-section__row">
        <div class="settings-section__row-info">
          <span class="settings-section__row-label">Theme</span>
          <span class="settings-section__row-desc">Choose light, dark, or follow your system preference.</span>
        </div>
        <div class="settings-section__row-control">
          ${renderThemeToggle(state)}
        </div>
      </div>

      <h3 class="settings-section__title" style="margin-top:28px;">Links</h3>
      <a
        class="settings-link"
        href="https://github.com/NJX-njx/opensoul"
        target="_blank"
        rel="noreferrer"
      >
        <span class="settings-link__icon">${icons.link}</span>
        <span class="settings-link__text">GitHub Repository</span>
        <span class="settings-link__external">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" x2="21" y1="14" y2="3"></line>
          </svg>
        </span>
      </a>
    </div>
  `;
}

/**
 * Main render function for the Settings panel overlay.
 * Returns `nothing` when the panel is closed.
 */
export function renderSettingsPanel(
  state: AppViewState,
  /** Content templates for Config / Logs / Debug — passed from app-render */
  contentSlots: {
    config: unknown;
    logs: unknown;
    debug: unknown;
  },
) {
  if (!state.settingsOpen) {
    return nothing;
  }

  const section = state.settingsSection;

  /** Close on Escape key */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      state.closeSettings();
    }
  };

  return html`
    <!-- Backdrop -->
    <div class="settings-backdrop" @click=${() => state.closeSettings()}></div>

    <!-- Panel -->
    <div class="settings-panel" @keydown=${handleKeyDown} tabindex="-1">
      <!-- Header -->
      <div class="settings-panel__header">
        <h2 class="settings-panel__title">Settings</h2>
        <button
          class="settings-panel__close"
          @click=${() => state.closeSettings()}
          title="Close settings"
          aria-label="Close settings"
        >
          ${icons.x}
        </button>
      </div>

      <div class="settings-panel__body">
        <!-- Left nav -->
        <nav class="settings-panel__nav">
          ${SETTINGS_NAV.map(
            (item) => html`
              <button
                class="settings-nav-item ${section === item.id ? "active" : ""}"
                @click=${() => state.setSettingsSection(item.id)}
              >
                <span class="settings-nav-item__icon">${icons[item.icon]}</span>
                <span class="settings-nav-item__text">${item.label}</span>
              </button>
            `,
          )}
        </nav>

        <!-- Right content -->
        <div class="settings-panel__content">
          ${section === "general" ? renderGeneralSection(state) : nothing}
          ${section === "config" ? contentSlots.config : nothing}
          ${section === "logs" ? contentSlots.logs : nothing}
          ${section === "debug" ? contentSlots.debug : nothing}
        </div>
      </div>
    </div>
  `;
}
