# Native UI, WPF, pyRevit and Revit

Translation resources, text direction and host layout are independent. In WPF use `FlowDirection="RightToLeft"` at the intended container and `Span FlowDirection="LeftToRight"` for complete technical runs. Alignment/mirroring can interact: verify the physical leading edge instead of mechanically setting both RTL and `TextAlignment=Right`. In the supplied offscreen WPF fixture, `TextAlignment=Left` under RTL produced the intended physical right alignment; the opposite setting visibly moved lines left. Preserve this as a tested fixture result, not a universal API rule.

Revit ribbon, task dialogs, WinForms, WPF windows and pyRevit HTML output do not share one direction API. For pyRevit HTML reports use the web adapter; for WPF use native flow; for host-owned dialogs inspect exposed APIs and behavior. The historical pyRevit localization investigation found that translated strings alone did not enable layout flow. Offscreen WPF testing does not establish ribbon/dialog behavior or authorize model changes.

WinForms uses `RightToLeft` and, for some containers, `RightToLeftLayout`; these are distinct. Other UI frameworks (Qt, Flutter, SwiftUI, Android/Compose, etc.) likewise need their documented layout/text direction and run mechanisms. Look up the installed version and run the common corpus; do not claim validation from conceptual equivalence.

[Primary API reference](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/advanced/bidirectional-features-in-wpf-overview). Use installed APIs or browse only if the actual version/behavior is unresolved.
