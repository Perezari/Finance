import SwiftUI

@main
struct BudgyApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(\.layoutDirection, .rightToLeft)
                .environment(\.locale, Locale(identifier: "he_IL"))
        }
    }
}

enum AppTab: Hashable {
    case report, history, portfolio, calendar, settings
}

/// The tabs, as the web app's screens: the current report, the history (with the annual summary), the
/// portfolio (with retirement), the calendar of liquidity dates, and settings. Adding a month sits over
/// all of them, as the "+" in the middle of the web app's bottom bar.
struct RootView: View {
    @AppStorage("theme") private var theme = Palette.all[0].id
    @AppStorage("appearance") private var appearance: Appearance = .automatic
    @State private var tab: AppTab = .report
    @State private var adding = false

    var body: some View {
        TabView(selection: $tab) {
            Tab("נוכחי", systemImage: "chart.bar", value: AppTab.report) {
                NavigationStack { ReportView() }
            }
            Tab("היסטוריה", systemImage: "chart.line.uptrend.xyaxis", value: AppTab.history) {
                NavigationStack { HistoryView() }
            }
            Tab("תיק", systemImage: "chart.pie", value: AppTab.portfolio) {
                NavigationStack { PortfolioView() }
            }
            Tab("לוח שנה", systemImage: "calendar", value: AppTab.calendar) {
                NavigationStack { CalendarView() }
            }
            Tab("הגדרות", systemImage: "gearshape", value: AppTab.settings) {
                NavigationStack { SettingsView() }
            }
        }
        .tabBarMinimizeBehavior(.onScrollDown)
        .tabViewBottomAccessory {
            AddMonthBar { adding = true }
        }
        .sheet(isPresented: $adding) {
            AddMonthSheet()
                .tint(Palette.named(theme).color)
                .preferredColorScheme(appearance.colorScheme)
                .environment(\.layoutDirection, .rightToLeft)
        }
        .tint(Palette.named(theme).color)
        .preferredColorScheme(appearance.colorScheme)
        .onAppear {
            #if DEBUG
            showScreenshot()
            #endif
        }
    }

    #if DEBUG
    /// Opens the screen the simulator photographs.
    private func showScreenshot() {
        switch Screenshot.current {
        case .history: tab = .history
        case .portfolio: tab = .portfolio
        case .calendar: tab = .calendar
        case .settings: tab = .settings
        case .add: adding = true
        case .report, nil: break
        }
    }
    #endif
}

/// The bar over the tabs that opens a new month.
struct AddMonthBar: View {
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Label("הוספת חודש", systemImage: "plus")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.tint)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

/// A new month: the web app's wizard, which comes with the data.
struct AddMonthSheet: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ContentUnavailableView {
                Label("חודש חדש", systemImage: "calendar.badge.plus")
            } description: {
                Text("כאן ייפתח אשף הוספת החודש, אחרי ייבוא הנתונים.")
            }
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark")
                    }
                    .accessibilityLabel("סגירה")
                }
            }
        }
        .presentationDetents([.medium, .large])
    }
}
