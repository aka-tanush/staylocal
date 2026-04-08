$ErrorActionPreference = "Stop"

# Use installed JDK if JAVA_HOME is not set.
if (-not $env:JAVA_HOME) {
    if (Test-Path "C:\Program Files\Java\jdk-21") {
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
    } elseif (Test-Path "C:\Program Files\Java\jdk-17") {
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
    } else {
        throw "JAVA_HOME is not set and no JDK found in C:\Program Files\Java."
    }
}

$javaExe = Join-Path $env:JAVA_HOME "bin\java.exe"
if (-not (Test-Path $javaExe)) {
    throw "java.exe not found at $javaExe"
}

& $javaExe "-Dmaven.multiModuleProjectDirectory=$PSScriptRoot" -classpath "$PSScriptRoot\.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain spring-boot:run
