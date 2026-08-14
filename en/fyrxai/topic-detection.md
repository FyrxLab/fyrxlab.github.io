# Topic Detection

When a message comes in, FyrxAI decides *whether* to answer and *which* documented topic (wiki) it's about, in three layers — cheapest and most certain first.

## 1. Exact match

If a wiki's name appears literally in the message, that's the topic. No AI call spent here.

## 2. Fuzzy match

Edit-distance (Levenshtein) matching, tolerant of spacing and pluralization differences ("conditional event" still matches a wiki named `conditionalevents`) and typos in the *name itself*. This is plain string matching, not AI — embedding models aren't built to be typo-tolerant, so this layer exists specifically to cover what they miss.

## 3. Local semantic model

For messages that describe a problem without naming the wiki at all, FyrxAI falls back to a small offline embedding model (`Xenova/paraphrase-MiniLM-L3-v2`, no API key or network call needed). Reference vectors come from the wiki's name and description, plus every keyword extracted from the crawl — both the automatic regex-based pass (headers, inline code, `/commands`, `%placeholders%`, always available) and the AI-generated pass (if a provider is configured). A match needs to both clear a similarity threshold and beat the runner-up topic by a margin, cutting down on confident-but-wrong guesses.

## Single-topic servers

If only one wiki is configured, there's nothing to disambiguate — any reasonably question-shaped message in the support channel is treated as being about it, without needing to name it. Greetings and small talk ("hey, what's up") are filtered out separately so they don't trigger a response.

## Guaranteed answers

@mentioning the bot skips all three layers and answers directly (still subject to the per-user cooldown) — see [Configuration](/en/fyrxai/configuration#getting-an-answer-directly).

## Rate limiting

Answering costs "attention," which regenerates over time per user — a burst of questions gets throttled progressively instead of everyone sharing one flat cooldown. Exempt specific users or roles (e.g. moderators) with `/fyrxai exempt`.
