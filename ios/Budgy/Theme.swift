import SwiftUI
import UIKit

extension Palette {
    /// The theme's accent, lighter in dark mode.
    var color: Color {
        let light = UIColor(hex: self.light)
        let dark = UIColor(hex: self.dark)
        return Color(UIColor { traits in traits.userInterfaceStyle == .dark ? dark : light })
    }
}

extension Appearance {
    /// The color scheme the app forces, or nil to follow the iPhone.
    var colorScheme: ColorScheme? {
        switch self {
        case .automatic: nil
        case .light: .light
        case .dark: .dark
        }
    }
}

extension UIColor {
    /// A color from "#rrggbb".
    convenience init(hex: String) {
        let parts = Palette.components(hex)
        self.init(red: parts.red, green: parts.green, blue: parts.blue, alpha: 1)
    }
}

extension View {
    /// A rounded card of Liquid Glass, as every card in the app is.
    func card(padding: CGFloat = 18) -> some View {
        self.padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .glassEffect(.regular, in: RoundedRectangle(cornerRadius: 24, style: .continuous))
    }

    /// The one prominent button of a screen: Liquid Glass in the theme's color.
    func prominentButton() -> some View {
        buttonStyle(.glassProminent)
    }

    /// A capsule of Liquid Glass.
    func glassCapsule() -> some View {
        glassEffect(.regular, in: Capsule())
    }

    /// The background of every screen, under the bars too.
    func screenBackground() -> some View {
        background(Color(.systemGroupedBackground).ignoresSafeArea())
    }
}

#if DEBUG
/// The screens the build photographs in the simulator (ios/scripts/screenshots.sh): `-screenshot settings`.
enum Screenshot: String {
    case report, history, portfolio, calendar, settings, add

    static let current: Screenshot? = {
        let arguments = ProcessInfo.processInfo.arguments
        guard let index = arguments.firstIndex(of: "-screenshot"), index + 1 < arguments.count else { return nil }
        return Screenshot(rawValue: arguments[index + 1])
    }()
}
#endif
