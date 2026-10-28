import Foundation

/// A color theme of the app, as the web app's COLOR_THEMES: the accent in light mode, and the lighter
/// one of the same hue that stands out on dark backgrounds.
struct Palette: Identifiable, Hashable {
    let id: String
    let name: String
    let light: String
    let dark: String

    static let all: [Palette] = [
        Palette(id: "green", name: "ירוק", light: "#0e9e7e", dark: "#13b891"),
        Palette(id: "blue", name: "כחול", light: "#3b82f6", dark: "#60a5fa"),
        Palette(id: "purple", name: "סגול", light: "#8b5cf6", dark: "#a78bfa"),
        Palette(id: "rose", name: "ורוד", light: "#f43f5e", dark: "#fb7185"),
        Palette(id: "amber", name: "זהב", light: "#f59e0b", dark: "#fbbf24"),
        Palette(id: "mocha", name: "מוקה", light: "#9c6b4e", dark: "#b5856a"),
        Palette(id: "sand", name: "חול", light: "#c8a26a", dark: "#d9bb8e"),
        Palette(id: "slate", name: "פלדה", light: "#6c8eae", dark: "#8aaac8"),
        Palette(id: "terracotta", name: "טרקוטה", light: "#c0614a", dark: "#d4806c"),
        Palette(id: "sage", name: "מרווה", light: "#6a9e78", dark: "#88b894"),
        Palette(id: "midnight", name: "חצות", light: "#5c6bc0", dark: "#7986cb"),
        Palette(id: "rosegold", name: "זהב ורדרד", light: "#c27080", dark: "#d4909e"),
        Palette(id: "olive", name: "זית", light: "#7d9240", dark: "#97ac5a"),
    ]

    /// The theme with this id; green for an id that is not one of them.
    static func named(_ id: String) -> Palette {
        all.first { $0.id == id } ?? all[0]
    }

    /// The red, green and blue of "#rrggbb", each from 0 to 1.
    static func components(_ hex: String) -> (red: Double, green: Double, blue: Double) {
        let value = Int(hex.dropFirst(), radix: 16) ?? 0
        return (Double((value >> 16) & 0xFF) / 255, Double((value >> 8) & 0xFF) / 255, Double(value & 0xFF) / 255)
    }
}

/// Light, dark, or as the iPhone is set.
enum Appearance: String, CaseIterable, Identifiable {
    case automatic, light, dark

    var id: String { rawValue }

    var name: String {
        switch self {
        case .automatic: "אוטומטי"
        case .light: "בהיר"
        case .dark: "כהה"
        }
    }
}
