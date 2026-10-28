import SwiftUI

/// The history: the assets over time, the portfolio's makeup, year against year, and the annual summary.
struct HistoryView: View {
    var body: some View {
        ContentUnavailableView {
            Label("היסטוריה", systemImage: "chart.line.uptrend.xyaxis")
        } description: {
            Text("המגמה לאורך זמן, הרכב התיק, שנה מול שנה והסיכום השנתי.")
        }
        .screenBackground()
        .navigationTitle("היסטוריה")
    }
}
