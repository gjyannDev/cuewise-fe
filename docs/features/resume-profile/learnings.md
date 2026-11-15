# Learn: Résumé profile and résumé-aware interviews (frontend for Slices 8c and 8d)

Spec: `spec.md` · Plan: `plan.md` · Progress: `task.md` · Backend: `../cuewise-be/docs/features/resume-upload/` and `resume-aware-interview/`.

**Concepts:** shared server state between two screens, "not found" as a state rather than an error, unconfirmed writes, client pre-checks vs server authority, consent copy, opt-in flags on a strict API. **Status:** built and unit-tested 2026-11-15, uncommitted; the signed-in browser walk is **pending** (needs cuewise-be running).

## 1. Why it exists
cuewise-be can now turn a résumé into a small profile (skills, up to 4 roles, up to 3 projects) and use it to angle interview questions, but only when the interview opts in with `use_profile: true`. Before this slice the frontend had no way to upload a résumé, see what was understood, delete it, or opt in. Résumé text also goes to an AI provider, and nothing told the candidate so.

## 2. What it is
- **`/resume`** (sidebar: Résumé): upload a PDF or `.docx`, see the profile cuewise-be extracted, replace it, or delete it.
- **"Use my résumé"** on the interview setup form: off by default, disabled with a link to `/resume` when there is no profile.
- **"Résumé-aware"** badge in the interview title bar when the session used it.
- The same provider notice sits beside the upload and beside the toggle.

```
/resume ──upload──> POST /api/profile/resume ──forwarder──> cuewise-be /api/v1/profile/resume
   │                        (30 s budget)                     extracts, stores profile only
   └── useProfileQuery ◄── shared cache key ──► setup form toggle ──> POST /interviews {use_profile}
```

## 3. When to use it
| Do this | When | Why / limit |
|---|---|---|
| Return `null` from a service for a "not found" code | the absence is a normal state ("no résumé yet") | the UI renders an empty state, not an error; other errors still throw |
| Share one query between two screens | both show or depend on the same server data | the toggle and the page always agree, and the cache moves both at once |
| Pre-check a file by name and size in the browser | the mistake is obvious and cheap to catch | it is a hint only; the server decides by the file's bytes |
| Treat "no reply" as unconfirmed and refetch | the server may have finished the write | never tell the user it failed when it may have worked |

**I'd revisit this when** the list endpoint returns `use_profile` (a history badge becomes possible), or the backend allows editing the profile (the page would need a form instead of "delete and re-upload").

## 4. How it works
**Options considered** (from the plan):

| Choice | Picked | Why |
|---|---|---|
| Upload control: RHF + `zodResolver` + shared `FileField` vs raw `<input>` + `useState` | RHF | the repo's Forms rule; one schema checks the file |
| Toggle gating: container passes `resumeStatus` vs form calls the profile hook | container | presentational components never fetch |
| Toggle off when the profile vanishes: effect vs clamp at submit | effect | RHF owns the value, so it can't be derived; a disabled box must never stay checked |
| Replace control: in the profile view vs in the upload card | upload card | the spec says Replace reuses the upload control (logged deviation) |

**One upload, walked through the code:**
1. The candidate clicks the dropzone or drops a file on it. `FileField` (`src/shared/forms/FileField.tsx:117`) clears the native input's value, so picking the same file again still fires `change`, and hands the `File` to RHF.
2. `ResumeUploadCard` submits at once (`ResumeUploadCard.tsx:79`). The resolver runs `resumeFileSchema` (`src/modules/profile/schemas/profile.schema.ts:6`): not empty, ends in `.pdf`/`.docx`, at most 2 MB. A failure shows under the field and nothing is sent.
3. `ResumeContainer.handleUpload` (`src/app/(app)/resume/_components/ResumeContainer.tsx:37`) ignores a call while an upload or a delete is pending, clears the old alert and calls the mutation.
4. `profileService.upload` (`src/modules/profile/services/profile.services.ts:29`) builds a `FormData` with one `file` part and posts it through `apiClient` with a 35 s budget (`src/modules/profile/constants.ts:16`).
5. The catch-all forwarder gives `profile/resume` 30 s (`src/app/api/[...path]/route.ts:35`), less than the browser's 35 s, so if cuewise-be hangs, the forwarder's own 503 arrives first and the browser still gets a parsed reply.
6. Success: `useUploadResumeMutation` writes the reply into the cache in one step (`src/modules/profile/queries/profile.queries.ts:27`). The old profile stayed on screen until then, so nothing flickers to the empty state.
7. Failure: `getResumeUploadErrorResult` (`src/modules/profile/utils/resume.utils.ts:11`) checks "no reply" first (line 12), so the forwarder's 503 `SERVICE_UNAVAILABLE` becomes "unconfirmed" (refetch) and is not confused with cuewise-be's 503 `PROFILE_UNAVAILABLE`. A 429 becomes a toast through `useMutationCallbacks` (`ResumeContainer.tsx:50`); a refusal is an inline alert with cuewise-be's own message, which already ends with a next step; "unconfirmed" gets its own neutral alert, so it never claims the upload failed. A success shows a toast.

**One résumé-aware start:**
1. `InterviewsContainer` reads `useProfileQuery()` (`src/app/(app)/interviews/_components/InterviewsContainer.tsx:57`) and maps it to `checking | available | missing | error` (line 58).
2. The form's checkbox (`src/modules/interviews/components/setup/InterviewConfigForm.tsx:269`) is enabled only for `available`. The schema sends `use_profile` as a real boolean (`src/modules/interviews/schemas/interviews.schema.ts:54`), because cuewise-be's field is strict.
3. If the profile was deleted in another tab, cuewise-be answers 409 `PROFILE_REQUIRED`. `getStartErrorResult` puts it under the toggle (`src/modules/interviews/utils/interview.utils.ts:41`), the container marks the profile as missing in the cache (`InterviewsContainer.tsx:96`, via `useMarkProfileMissing` at `src/modules/profile/queries/profile.queries.ts:55`) instead of refetching, because the 409 is itself proof and a failed refetch would leave the toggle on (review finding R10). The status becomes `missing`, and the effect (`InterviewConfigForm.tsx:99`) turns the toggle off while the message stays.
4. The title bar shows the badge from `session.use_profile` (`src/modules/interviews/components/chat/InterviewTitleBar.tsx:71`), not from the current profile: deleting the résumé later doesn't rewrite what the interview was.

## 5. What can go wrong
| Failure | What the user sees | What the code does | Proof (test name) |
|---|---|---|---|
| Wrong file type or over 2 MB | message under the field | nothing is sent | `refuses %s by name, before any request (EC3, EC4)` |
| No résumé yet | empty state with the upload card | `get()` returns null on `PROFILE_NOT_FOUND` | `returns null for PROFILE_NOT_FOUND: no résumé yet is a state, not an error` |
| Scan, encrypted, too large, not a résumé | alert with cuewise-be's message; old profile stays | alert result, cache untouched | `a %i %s is an alert with the backend's message (EC5-EC9)` |
| Backend unreachable or slow | a neutral notice: "We couldn't confirm your upload. The upload may still have worked…" | unconfirmed result, profile refetched | `the forwarder's own 503 is unconfirmed, not PROFILE_UNAVAILABLE (EC11)` |
| Upload body wrong shape | n/a | exactly one `file` part, 35 s budget | `posts one multipart \`file\` part with the upload's own time budget…` |
| Start with a deleted résumé | message under the toggle; toggle turns off | 409 mapped to `use_profile`, profile refetched | `puts a 409 PROFILE_REQUIRED under the résumé toggle, not the question count` |
| `use_profile` sent as `"true"` | n/a (blocked in the form) | schema refuses non-booleans | `rejects a use_profile of %j: cuewise-be only takes a real boolean` |

## 6. Try it yourself
1. **Predict:** what does the browser send when you pick `resume.txt`? Run `npx vitest run tests/modules/profile/schemas` and read the `refuses %s by name` cases. (Nothing: the schema stops it.)
2. **Predict:** if the forwarder's budget were 40 s and the browser's 35 s, what would a hanging backend look like? (The browser would time out first with no response; the result is still "unconfirmed", but the forwarder keeps a dead request open for 5 more seconds.) Check the ordering in `src/modules/profile/constants.ts:16`.
3. With cuewise-be running: upload a résumé, then open `/interviews` in a second tab, delete the profile in the first tab, and press Start with the toggle on in the second. **Predict** what the toggle does. (**pending**: not yet walked.)

## 7. What surprised me
- `next build` failed on Next's own `/_global-error` page with `Cannot read properties of null (reading 'useContext')`. The cause was the shell's `NODE_ENV=development`, not the code; `NODE_ENV=production npm run build` was green (2026-11-15).
- Running `next dev` rewrote `AGENTS.md` with an "agent feedback" block that asks the agent to report to an outside service. The command was not run; it's the user's call.
- Adding a required `use_profile` to the session schema broke four test fixtures at once, which is the point of a strict schema: the tests now mirror what cuewise-be really sends.
- Real extraction time against the 30 s forwarder budget: **pending** (needs a signed-in upload against cuewise-be).

## 8. Check your understanding
1. **Why** does `profileService.get()` return `null` for one error code but throw for every other one?
2. **When** should a failed upload show "couldn't confirm" instead of "failed"?
3. **How** does the setup form's toggle learn that the résumé was deleted in another tab?
4. **What if** the browser's upload budget were shorter than the forwarder's?

<details>
<summary>Reference answers (write yours first)</summary>

1. "No résumé yet" is a normal state with its own screen (the empty state), so it's data, not an error. Anything else (a 500, a network drop) means we don't know, so it must reach the error state with a retry.
2. When no reply came back: no response at all, or the forwarder's own 503 `SERVICE_UNAVAILABLE`. The backend may have finished and stored the profile, so the page reloads it instead of claiming it failed.
3. Through the shared profile query. A background refetch (window focus) turns its data into `null`, or the 409 `PROFILE_REQUIRED` handler writes `null` into it directly; either way the container's `resumeStatus` becomes `missing` and the form's effect turns the checkbox off.
4. The browser would give up first with no response, so the forwarder's parsed 503 would never arrive and every slow upload would look like a network drop. Keeping the forwarder shorter gives the browser a real reply to show.
</details>

## 9. Go deeper / Still open
- **Pending:** signed-in browser walk of every UI edge case listed in `task.md` (Tests Pending), and the real extraction time.
- **Pending (backend):** Google AI Studio's data terms for résumé text; the notice copy (`src/modules/profile/constants.ts:31`) must match the answer before real users.
- Not in this slice: a history-table badge (the list rows' `use_profile` isn't confirmed), editing the profile field by field, and the 15 s default budget on `job-url`/`job-text` (noted in the spec).
- Related: `docs/features/interviews-job-import/` (the same forwarder, the same "backend message as is" rule), `docs/features/voice-answers/` (the multipart pass-through this upload relies on).
