# Learn: Showing a slow, stored AI result (the interview feedback screen)

**Concepts:** synchronous long requests and recovery, polling a stored row, one pure selector for many screens, one-shot URL flags, rendering untrusted AI text. **Status:** built and unit-tested 2026-11-06 (522 tests green, build green). Manual run against a real cuewise-be: **pending**.

## 1. Why it exists
cuewise-be scores a finished interview with two LLM calls (3-7 s in its eval runs, up to a 60 s budget). The web app showed nothing after the last answer, and its `/api` forwarder and browser both gave up after 15 s, so any slow generation would have looked like a failure even though the backend finished and stored the result.

## 2. What it is
A page at `/interviews/<id>/feedback` that reads the stored feedback, generates it when the user asks (the closing card's **Get feedback**, or a button on the page), and shows one of ten screens: loading, none yet, generating, stalled, the result, not enough answers, failed, unavailable, not finished, not found, or a generic error.

```
closing card ──?start=1──▶ page ──GET──▶ null? ──POST (≤75 s)──▶ result
                             │                     │ no reply / 409
                             │                     └──▶ GET ──▶ generating? ──poll every 3 s──▶ result
                             └── History > View (no flag): GET ──▶ result, or "Get feedback"
```

## 3. When to use it
| Do this | When | Why / limit |
|---|---|---|
| Recover a lost reply by reading the stored row | The server stores the result whatever happens to the request | No duplicate work, no false "failed"; needs a GET that tells "none" from "error" |
| Poll only while the stored status says "running" | A long job with a status field | Stops on its own; no timer to manage |
| One pure function for "which screen" | More than three states plus errors | Every case is a plain unit test, no DOM needed |
| A one-shot URL flag removed on arrival | One click should act on another page, but a reload must not | No storage; `history.replaceState` keeps the router in sync |
| Background jobs and a 202 instead | Work regularly exceeds a minute, or hosting caps request time | Needs a backend change (out of scope here) |

**I'd revisit this when** generation regularly takes more than about 60 s, or the host cuts route handlers before about 75 s: then a 202 + polling design on the backend beats a long synchronous POST.

## 4. How it works
| Option | Chosen? | Why |
|---|---|---|
| Longer timeouts per request (forwarder 70 s < browser 75 s) | Yes | The forwarder ends first with a clean 503 the page understands; other routes keep 15 s |
| Recover by GET after no reply or 409 in progress | Yes | The backend keeps one row per interview and finishes regardless |
| Auto-generate when the page opens | No | Spends two LLM calls on any visit, link or reload |
| Session-storage marker for "generate on arrival" | No | Fails silently when storage is blocked; the URL flag needs nothing |
| Component render tests | No | No DOM test setup in the repo; the logic lives in tested pure functions |

**One click walked through the code:**

```
components/chat/InterviewClosingCard.tsx  completed card links to feedbackStartRoute(id)  (?start=1)
app/(app)/interviews/[id]/feedback/page.tsx   validates the id, reads the flag, keys the container by id
use-interview-feedback.ts:15              useInterviewFeedback: query + mutation + timers
interviews.queries.ts:207,211             useFeedbackQuery: GET; polls every 3 s only while status is "generating"
interviews.services.ts:133                getFeedback: FEEDBACK_NOT_FOUND becomes null ("none yet"), other 404s throw
use-interview-feedback.ts:39              handleArrival (useEffectEvent): clean the URL, then POST if nothing stored
interviews.queries.ts:232                 mutationFn: POST; on no reply or 409 read the stored row instead
interviews.services.ts:149                generateFeedback: POST with the 75 s browser timeout
app/api/[...path]/route.ts:32             SLOW_POSTS: the forwarder waits 70 s for this path only
feedback.utils.ts:55                      getFeedbackErrorResult: poll / notCompleted / notFound / failed / unavailable / rateLimited / unknown
feedback.utils.ts:79,105                  getFeedbackView + storedView: the one place the screen is decided
use-interview-feedback.ts:80              "just generated" set during render (no effect): focus + announcement only then
```

All feedback helpers live in `utils/feedback.utils.ts` and the screens in `components/feedback/` (structure rules in `CLAUDE.md`).

## 5. What can go wrong
| Failure | What the user sees | What the code does | Proof (test name) |
|---|---|---|---|
| The POST gets no reply but the backend finished | The result | Reads the stored row | `reads the stored feedback after %s (AC7, EC10, EC12)` |
| No reply and nothing was stored | "We couldn't generate your feedback" + Try again | `FeedbackLostError` → failed | `maps a lost generation (no response, nothing stored) to the failed card (EC11)` |
| Another tab is already generating (409) | Generating, then the result | Reads the row and polls | same as above (409 FEEDBACK_IN_PROGRESS row) |
| Still `generating` after 90 s | "Taking longer than expected" + Try again | Stall timer, new POST takes the row over | `offers a new try once a generating row has stalled (EC13)` |
| 429 | A toast; the page stays | Ignored by the selector | `keeps the previous screen after a 429 (EC16)` |
| The backend adds a criterion | Generic error, never a half page | Strict zod enum rejects it | `rejects an unknown criterion in the scores or the evidence (EC20)` |
| Reload after arriving from the card | The stored result, no new POST | Flag only acts when nothing is stored, and is removed | `doesn't start with %s (AC3, EC6, EC7)` |
| A slow POST (20-60 s) | Generating, then the result | 70 s forwarder, 75 s browser | `gives %s %j a %i ms budget …` (feedback rows) |

## 6. Try it yourself
1. **Predict:** with cuewise-be stopped, what does the page show after clicking **Get feedback**? Then stop the backend and try. (Hint: the forwarder's 503 is "no reply", then the read fails too.)
2. **Predict:** what happens on a reload while generating? Start a generation, reload at once, and watch the Network tab for a second POST.
3. In `constants.ts`, set `FEEDBACK_TIMEOUT_MS` to 2000 temporarily. Predict the screen sequence on a normal generation, then run it. Put the value back.
4. Read `getFeedbackView` and predict its answer for `{ stored: null, generateError: { kind: "poll" } }`, then check the test that covers it.

## 7. What surprised me
- **Measured (2026-11-06):** `npm test` 522 passing in 37 files (baseline 448 in 33); `npx tsc --noEmit` and `npm run lint` clean; `npm run build` green with `NODE_ENV=production`.
- **Surprise:** `npm run build` failed on Next's own `/_global-error` page (`Cannot read properties of null (reading 'useContext')`) because this machine's shell and `.env` set `NODE_ENV=development`. Not caused by this feature; a production `NODE_ENV` builds cleanly with zero React key warnings.
- **Surprise:** zod 4's `z.record(z.enum(...), …)` requires every enum key; a question only has its category's four criteria, so `z.partialRecord` is the right tool (slice "accepts a question that only has its own category's four criteria").
- **Pending:** time from click to result against the real backend, the dropped-connection recovery in a real browser, and the backend still finishing after the tab closes (plan Step 0a).

## 8. Check your understanding
1. **Why** does the forwarder wait 70 s but the browser 75 s?
2. **When** does the page send a POST without the user clicking on the page itself?
3. **How** does the page tell "no feedback yet" from "this interview isn't yours", given both are 404s?
4. **What if** the POST times out in the browser while the backend is still writing the text?

<details>
<summary>Reference answers (write yours first)</summary>

1. So a slow request always ends at the forwarder with its clean 503 `SERVICE_UNAVAILABLE`, which the page classifies as "no reply" and recovers from, instead of a browser abort racing it.
2. Only on arrival from the closing card (`?start=1`) and only when the read found nothing stored; the flag is then removed from the URL.
3. By `error.code`: `FEEDBACK_NOT_FOUND` becomes `null` in `getFeedback`; any other 404 (`NOT_FOUND`) is thrown and shown as "Interview not found".
4. The mutation reads the stored row: `generating` → the page polls until it is generated; `generated` → the result shows; nothing stored → failed with Try again.

</details>

## 9. Go deeper / Still open
- Spec, plan, progress: `docs/features/interview-feedback/spec.md`, `plan.md`, `task.md`. Backend side: `cuewise-be/docs/features/interview-feedback/`.
- Unlocks next: scores in the History table and trends on the Progress page (both out of scope now).
- **Pending:** the manual EC run (plan Step 8), Step 0(a) disconnect check, Step 0(d) hosting duration limit.
