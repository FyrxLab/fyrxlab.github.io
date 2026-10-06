# Fyrx — Your AI Assistant

Fyrx is the AI-powered brain of AbsoluteSolver. It acts as an always-on server administrator that monitors your Minecraft server, intercepts errors, and provides clear, human-readable diagnostics automatically.

## What is Fyrx?

When your server encounters a problem — whether it's a plugin exception, a crash, or a lag spike — Fyrx:

1. **Captures** the full error context (stack trace, thread state, log history)
2. **Sends** it to Google Gemini (or your configured AI provider)
3. **Returns** a structured, formatted diagnostic report directly in your console

You get a plain-English explanation of what happened, which plugin caused it, and what you should do next — without having to read a single line of Java.

## Supported AI Providers

Fyrx is provider-agnostic. You can use any of the following:

| Provider | Models | Notes |
|----------|--------|-------|
| **Anthropic** | Sonnet, Haiku, Opus | Default provider as of this release. High-quality reasoning. |
| **Google Gemini** | Pro, Flash | Free tier available. |
| **OpenAI / Compatible** | `gpt-4o`, `gpt-4-turbo`, etc. | Works with any OpenAI-compatible endpoint, including local models (Ollama, LM Studio): set `other-url` to the local endpoint and leave `other-key` empty. |

## Response Format

Fyrx formats its responses using native Minecraft color codes directly in your server console:

```
╔══════════════════════════════════════════════════════════╗
║       ANALYSIS REPORT — FYRX                            ║
╚══════════════════════════════════════════════════════════╝

### 1. Root Cause
The error is a NullPointerException thrown in PluginX's
PlayerJoinEvent handler at PlayerListener.java:47.

### 2. Most Likely Cause
PluginX is trying to access player data before it has been
loaded from the database.

### 3. Recommended Action
Update PluginX to version 2.3.1+ which fixes this race condition.
If no update is available, disable PluginX temporarily.
════════════════════════════════════════════════════════════
```

## System Prompt & Rules

Fyrx operates under a strict system prompt that ensures:

- It **never** suggests removing AbsoluteSolver itself
- It provides **actionable** solutions, not vague advice
- It always identifies the **root cause** before giving recommendations
- It considers **multiple plugins** as potential causes

## Performance Impact

Fyrx is designed to have **zero impact on server TPS**. All AI requests are made on background threads using `CompletableFuture`. Your server will never pause, stutter, or slow down while Fyrx is analyzing an error.
