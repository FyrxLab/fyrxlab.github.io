# Console Monitor

The Console Monitor is a real-time error interceptor injected directly into the server's **Log4j** logging engine. It captures errors the instant they are written to the console — before they even appear in the log file.

## How It Works

AbsoluteSolver registers a custom `Log4j Appender` at startup. This appender listens to every log event and filters for:

- Lines at `ERROR` or `FATAL` level
- Lines at `WARN` level that have an attached Java exception (`Throwable`)

When an error is detected, it is added to an internal buffer. After a configurable **batch window** (default: 10 seconds), the buffered errors are sent together to Fyrx for analysis. This prevents spamming the AI with individual errors during a cascade failure.

## Configuration

```yaml
monitor-console: true           # Enable/disable the monitor
error-cooldown-minutes: 10      # Minimum minutes between analyses
```

## Filtering

The monitor intelligently ignores:
- `INFO` and `DEBUG` messages (only errors are captured)
- Errors from AbsoluteSolver itself (to prevent feedback loops)
- Errors during the initial startup window (handled separately by Early Startup Detection)

## Batch Analysis

Instead of sending each error individually (which would quickly exhaust your API quota), the Console Monitor uses a **batch system**:

1. Errors accumulate in a queue (max 100 entries)
2. After 10 seconds of inactivity, the last 50 errors are bundled into a single prompt
3. Fyrx analyzes the entire batch at once and identifies patterns across multiple errors

This approach is especially effective during plugin cascade failures, where many plugins throw errors simultaneously due to a single root cause.

## Cooldown

To protect against rate limits on free API tiers, a global cooldown is enforced between analyses. The default is **10 minutes**. You can adjust this in `config.yml`:

```yaml
error-cooldown-minutes: 10  # Set to 0 to disable (not recommended)
```

## Early Startup Errors

A separate system handles errors that occur *before* AbsoluteSolver finishes loading. See [Early Startup Detection](/en/solver/crash-analysis#early-startup-detection) for details.
