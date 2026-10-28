import SwiftUI

/// The dates deposits mature and funds open, with what each holds.
struct CalendarView: View {
    var body: some View {
        ContentUnavailableView {
            Label("לוח שנה", systemImage: "calendar")
        } description: {
            Text("מועדי הנזילות של הפיקדונות והקרנות.")
        }
        .screenBackground()
        .navigationTitle("לוח שנה")
    }
}
