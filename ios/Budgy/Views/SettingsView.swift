import SwiftUI

/// Settings: light or dark, the color of the app, and its version.
struct SettingsView: View {
    @AppStorage("theme") private var theme = Palette.all[0].id
    @AppStorage("appearance") private var appearance: Appearance = .automatic

    private var version: String {
        let info = Bundle.main.infoDictionary
        let short = info?["CFBundleShortVersionString"] as? String ?? ""
        let build = info?["CFBundleVersion"] as? String ?? ""
        return "\(short) (\(build))"
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 26) {
                SettingsSection(title: "מראה") {
                    Picker("מראה", selection: $appearance) {
                        ForEach(Appearance.allCases) { Text($0.name).tag($0) }
                    }
                    .pickerStyle(.segmented)
                    .padding(.vertical, 14)
                }

                SettingsSection(title: "צבע", note: Text(Palette.named(theme).name)) {
                    ThemePicker(selection: $theme)
                        .padding(.vertical, 16)
                }

                SettingsSection(title: nil) {
                    HStack {
                        Text("גרסה")
                        Spacer()
                        Text(version)
                            .foregroundStyle(.secondary)
                    }
                    .settingsRow()
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 4)
            .padding(.bottom, 24)
        }
        .screenBackground()
        .navigationTitle("הגדרות")
    }
}

/// The thirteen colors of the app, as circles; the chosen one is marked.
struct ThemePicker: View {
    @Binding var selection: String
    private let columns = [GridItem(.adaptive(minimum: 42), spacing: 10)]

    var body: some View {
        LazyVGrid(columns: columns, spacing: 12) {
            ForEach(Palette.all) { palette in
                Button {
                    selection = palette.id
                } label: {
                    swatch(palette)
                }
                .buttonStyle(.plain)
                .accessibilityLabel(palette.name)
                .accessibilityAddTraits(palette.id == selection ? .isSelected : [])
            }
        }
    }

    private func swatch(_ palette: Palette) -> some View {
        let chosen = palette.id == selection
        return Circle()
            .fill(palette.color)
            .frame(width: 32, height: 32)
            .overlay {
                if chosen {
                    Image(systemName: "checkmark")
                        .font(.caption.weight(.bold))
                        .foregroundStyle(.white)
                }
            }
            .padding(4)
            .overlay {
                Circle().strokeBorder(chosen ? palette.color : .clear, lineWidth: 2)
            }
    }
}

/// A section of the settings: a small title over a glass card of rows, as every card in the app is,
/// and a note under it.
struct SettingsSection<Content: View>: View {
    let title: String?
    var note: Text?
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let title {
                Text(title)
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 16)
            }
            VStack(spacing: 0) {
                content
            }
            .padding(.horizontal, 16)
            .card(padding: 0)
            if let note {
                note
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 16)
            }
        }
    }
}

extension View {
    /// A row of a settings card: as tall as a list's row, its contents from the start.
    func settingsRow() -> some View {
        frame(maxWidth: .infinity, minHeight: 50, alignment: .leading)
            .padding(.vertical, 2)
    }
}
