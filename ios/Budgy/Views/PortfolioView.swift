import SwiftUI

/// The portfolio by kind of asset, and the retirement forecast.
struct PortfolioView: View {
    var body: some View {
        ContentUnavailableView {
            Label("תיק השקעות", systemImage: "chart.pie")
        } description: {
            Text("פילוח התיק לפי סוג, ותחזית הפרישה.")
        }
        .screenBackground()
        .navigationTitle("תיק השקעות")
    }
}
