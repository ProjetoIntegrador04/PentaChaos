param(
  [string]$JdkHome = "C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.8.9-hotspot"
)

if (-not (Test-Path $JdkHome)) {
  Write-Error "JDK 21 não encontrado em $JdkHome. Ajuste o parâmetro -JdkHome."
  exit 1
}

$env:JAVA_HOME = $JdkHome
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Output "JAVA_HOME=$env:JAVA_HOME"
java -version

& .\mvnw.cmd -pl app spring-boot:run


