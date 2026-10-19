param(
 [Parameter(Mandatory=$true)][string]$InputDirectory,
 [Parameter(Mandatory=$true)][ValidateSet('docx','pptx','xlsx')][string]$Format
)
# Use only generated synthetic fixture files. No model or production document is opened.
$ErrorActionPreference='Stop'
$fixtureRoot=(Resolve-Path -LiteralPath $InputDirectory).Path
$source=Join-Path $fixtureRoot "fixture.$Format"
if(-not(Test-Path -LiteralPath (Join-Path $fixtureRoot 'fixtures.json'))){throw 'Missing synthetic fixture manifest'}
if(-not(Test-Path -LiteralPath $source)){throw 'Missing fixture'}
$fixtureManifest=Get-Content -LiteralPath (Join-Path $fixtureRoot 'fixtures.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$expectedHash=$fixtureManifest.sha256."fixture.$Format"
$inputHash=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLower()
if(-not $expectedHash -or $expectedHash -ne $inputHash){throw 'Fixture hash does not match its generated manifest'}
$app=$null;$doc=$null;$result=@{format=$Format;sourceSha256=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLower();visualReview='pending'}
$priorSecurity=$null
try {
 Write-Output "Opening synthetic $Format fixture"
 switch($Format){
  'docx' {
   $app=New-Object -ComObject Word.Application;$app.Visible=$false;$app.DisplayAlerts=0;$priorSecurity=$app.AutomationSecurity;$app.AutomationSecurity=3
   $doc=$app.Documents.Open($source,$false,$true)
   $doc.ExportAsFixedFormat((Join-Path $fixtureRoot 'word.pdf'),17)
   $result.renderer='Microsoft Word'
  }
  'pptx' {
   $app=New-Object -ComObject PowerPoint.Application;$priorSecurity=$app.AutomationSecurity;$app.AutomationSecurity=3
   $doc=$app.Presentations.Open($source,$true,$false,$false)
   $doc.SaveAs((Join-Path $fixtureRoot 'powerpoint.pdf'),32)
   $result.renderer='Microsoft PowerPoint'
  }
  'xlsx' {
   $app=New-Object -ComObject Excel.Application;$app.Visible=$false;$app.DisplayAlerts=$false;$priorSecurity=$app.AutomationSecurity;$app.AutomationSecurity=3
   $doc=$app.Workbooks.Open($source,0,$true)
   $doc.ExportAsFixedFormat(0,(Join-Path $fixtureRoot 'excel.pdf'))
   $result.renderer='Microsoft Excel'
  }
 }
 $result.version=$app.Version;$result.status='exported'
} catch {$result.status='failed';$result.error=$_.Exception.Message}
finally {
 if($doc){
  switch($Format){'docx'{$doc.Close(0)} 'pptx'{$doc.Close()} 'xlsx'{$doc.Close($false)}}
  [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($doc)
 }
 if($app){
  if($null -ne $priorSecurity){$app.AutomationSecurity=$priorSecurity}
  $remaining=switch($Format){'docx'{$app.Documents.Count} 'pptx'{$app.Presentations.Count} 'xlsx'{$app.Workbooks.Count}}
  if($remaining -eq 0){$app.Quit()}
  [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($app)
 }
}
$result | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $fixtureRoot "office-$Format-results.json") -Encoding utf8
$result | ConvertTo-Json -Depth 5
if($result.status -ne 'exported'){exit 1}
