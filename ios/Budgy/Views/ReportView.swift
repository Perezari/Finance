import SwiftUI

/// The current report: the latest month's total, its change, the categories and the health score.
struct ReportView: View {
    var body: some View {
        ContentUnavailableView {
            Label("עדיין אין נתונים", systemImage: "chart.bar")
        } description: {
            Text("בשלב הבא הנתונים מהאתר ייובאו לכאן, פעם אחת.")
        }
        .screenBackground()
        .navigationTitle("דוח נוכחי")
    }
}
