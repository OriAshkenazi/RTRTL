param([Parameter(Mandatory=$true)][string]$InputDirectory)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName PresentationFramework,PresentationCore,WindowsBase
$fixtureRoot=(Resolve-Path -LiteralPath $InputDirectory).Path
$fixtureData=Get-Content -LiteralPath (Join-Path $fixtureRoot 'fixtures.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$stack=New-Object Windows.Controls.StackPanel
$stack.FlowDirection=[Windows.FlowDirection]::RightToLeft
$stack.Width=840;$stack.Margin=New-Object Windows.Thickness(30)
foreach($case in $fixtureData.cases){
    $block=New-Object Windows.Controls.TextBlock
    $block.FontFamily=New-Object Windows.Media.FontFamily($fixtureData.font_requested)
    $block.FontSize=24;$block.LineHeight=36;$block.TextWrapping='Wrap';$block.Margin=New-Object Windows.Thickness(0,0,0,16)
    $block.Width=840
    $block.FlowDirection=[Windows.FlowDirection]::RightToLeft
    # In this WPF FlowDirection context Left is the logical leading alignment.
    # The rendered fixture verifies the resulting physical right edge.
    $block.TextAlignment=[Windows.TextAlignment]::Left
    foreach($run in $case.runs){
        $span=New-Object Windows.Documents.Span
        $span.FlowDirection=if($run[1] -eq 'ltr'){[Windows.FlowDirection]::LeftToRight}else{[Windows.FlowDirection]::RightToLeft}
        $span.Inlines.Add((New-Object Windows.Documents.Run([string]$run[0])))
        $block.Inlines.Add($span)
    }
    [void]$stack.Children.Add($block)
}
$border=New-Object Windows.Controls.Border;$border.FlowDirection=[Windows.FlowDirection]::RightToLeft;$border.Background=[Windows.Media.Brushes]::White;$border.Child=$stack
$rootVisual=New-Object Windows.Controls.Grid
$rootVisual.FlowDirection=[Windows.FlowDirection]::LeftToRight
[void]$rootVisual.Children.Add($border)
$rootVisual.Measure((New-Object Windows.Size(900,[double]::PositiveInfinity)))
$size=$rootVisual.DesiredSize;$rootVisual.Arrange((New-Object Windows.Rect(0,0,$size.Width,$size.Height)));$rootVisual.UpdateLayout()
$bitmap=New-Object Windows.Media.Imaging.RenderTargetBitmap([int]$size.Width,[int]$size.Height,96,96,[Windows.Media.PixelFormats]::Pbgra32)
$bitmap.Render($rootVisual)
$encoder=New-Object Windows.Media.Imaging.PngBitmapEncoder
$encoder.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
$stream=[IO.File]::Open((Join-Path $fixtureRoot 'wpf.png'),[IO.FileMode]::Create)
try{$encoder.Save($stream)}finally{$stream.Dispose()}
@{renderer='WPF RenderTargetBitmap';framework=[Environment]::Version.ToString();width=$size.Width;height=$size.Height;paragraphs=$fixtureData.cases.Count;blocks=@($stack.Children | ForEach-Object {@{width=$_.ActualWidth;direction=$_.FlowDirection.ToString();alignment=$_.TextAlignment.ToString()}});visualReview='pending';scope='offscreen WPF text; not Revit ribbon or dialogs'} | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $fixtureRoot 'wpf-results.json') -Encoding utf8
Write-Output 'Rendered offscreen WPF fixture'
