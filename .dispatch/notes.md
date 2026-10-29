# Channel values: partner hostnames as the channel key (game)

Repo: `fielddaylab/jowilder`. Base branch here is **`master`** (not `main`);
base commit `13dcd02` (the m3.5 production commit). One runtime file changed:
`iframe.html` (repo root — this repo's `iframe.html` IS the file served at
`cdn.vaultlearninggames.org/fieldday/jowilder/iframe.html`; there is no
`ci/production/` directory in this tree).

## Baseline confirmed before editing

    git remote get-url origin   -> github.com/fielddaylab/jowilder.git
    wc -c iframe.html           -> 10530        (matches MEASURED STATE)
    grep -c "'pbswi'"           -> 2            (map value x2, lines 51-52; the
                                                 card said 1 — it is the same
                                                 single logical value, present
                                                 on both the bare-host and www.
                                                 origin keys)

## What changed in `iframe.html`

1. `VAULT_CHANNELS` values -> hostnames. All eight origin **keys** untouched
   (including every `www.` variant); only the values changed:
   `pbswi`->`pbswisconsineducation.org`, `pbskids`->`pbskids.org`,
   `pbslm`->`pbslearningmedia.org`,
   `sciencegamecenter`->`sciencegamecenter.org`.
2. Added `VAULT_CHANNEL_ALIASES` (short key -> hostname) and
   `VAULT_PARTNER_CHANNELS` (its values, for the medium test).
3. THE TRAP: the alias is applied to the **raw `vault_ch` read**, not to the
   `VAULT_CHANNELS` fallback. The channel/medium resolution moved into a pure
   `vaultResolveChannel(rawCh, source, embedded)` bracketed by
   `/* VAULT_CHANNEL_LOGIC_START */` / `/* VAULT_CHANNEL_LOGIC_END */` so it is
   testable with no browser. The alias lookup is the first thing it does, before
   the two existing fallbacks and before any `utm_source` / `dimension1` write.
   PBS's hardcoded `?vault_ch=pbswi` therefore now reports
   `pbswisconsineducation.org` with no change asked of PBS.
4. `utm_medium` is `referral` when the resolved channel is a partner hostname,
   and stays `vault-player` for `vault` / `other` / direct / anything
   unrecognised (line 101 uses `resolved.medium` instead of the literal).
5. `ga('set','dimension1', channel)` unchanged. The `if (channel)` guard, the
   `try/catch`, the referrer block, the bare `new URL(...)` inside the existing
   try/catch, and the `UA-72694027-9` tag are all unchanged. ES5 `var` style
   kept. Header comment updated to explain the hostname choice.

`vault` is NOT renamed. Old short keys are NOT dropped — they live on in
`VAULT_CHANNEL_ALIASES` so inbound partner links keep working forever.

## Acceptance

    grep -c "'pbswi'" iframe.html                 -> 0     (required 0)
    grep -c "pbswisconsineducation.org" iframe.html -> 4   (required >= 2)
    node --check on the extracted logic block      -> OK
    node --check on the whole inline <script>      -> OK

`npx tsc --noEmit` and `npm test` are **not applicable** in this repo: there is
no `package.json`, no `tsconfig.json` and no `.ts` file anywhere (vanilla ES5
browser JS built by a makefile; CI runs only `make build` then publishes
`dist/`). In their place the change was verified with `node --check` on both the
extracted logic block and the whole inline `<script>`, the 14-case behaviour
matrix, and the real-browser run below.

`make build` could not run **in this sandbox**: the makefile's only build step
is `rsync -a ... ./ dist/` and `rsync` is not installed here (`command -v rsync`
-> exit 127). Verified this is environmental and NOT caused by my change: with
the change stashed, baseline `make build` fails identically with
`make: rsync: No such file or directory`. CI's `ubuntu-latest` has rsync, so
`make build` is green there. Equivalence check instead: reproduced the rsync
copy with `git ls-files | tar` and confirmed the built `iframe.html` carries the
new values (`pbswisconsineducation.org` x4, `'pbswi'` x0). `dist/` is
gitignored; nothing was committed from it.

## Evidence — browser run (utm_source / utm_medium / cd1, both journeys)

`/opt/data/vault_audit/prod_e2e.py` targets **production**, which still serves
m3.5 (`cdn...iframe.html` is 10,530 bytes). My branch preview at
`builds.vaultlearninggames.org/fieldday/jowilder/<branch>/iframe.html` **404s**
— the preview is published by CI on push, and this run does not push (the engine
pushes). So the prod harness run below is the BEFORE picture, and the branch was
verified with the same instrumentation (`/opt/data/.venv-pw/bin/python`, the
same Chromium at `/opt/data/.cache/ms-playwright/chromium-1234/...`) against the
actual edited file served over localhost, in a real embedded iframe.

### BEFORE — `/opt/data/.venv-pw/bin/python /opt/data/vault_audit/prod_e2e.py` (production, m3.5)

    == PBS Wisconsin journey (production)
       UA-73811270-1 pageview
       G-B3747MQP9Q page_view
       G-1KJ4W2B81F page_view
       G-B3747MQP9Q pageview
       G-1KJ4W2B81F play_start source_channel=pbswi
       G-1KJ4W2B81F play_heartbeat source_channel=pbswi
       UA-72694027-9 pageview cd1=pbswi utm_source=pbswi
       G-4JW7HRZEM0 page_view utm_source=pbswi
    == Vault-native journey (production)
       G-1KJ4W2B81F page_view
       G-1KJ4W2B81F play_start
       G-1KJ4W2B81F play_heartbeat
       UA-72694027-9 pageview cd1=vault utm_source=vault
       G-4JW7HRZEM0 page_view utm_source=vault

(One session added to each GA row — expected. The `pbswi` strings above are
exactly what this card fixes; the Site/Portal cards own the `G-1KJ4W2B81F`
`source_channel=pbswi` rows.)

### AFTER — this branch's `iframe.html`, headless Chromium, embedded in an iframe

Served from a localhost static server, `ga()` stubbed before analytics.js so the
real `set location` / `set dimension1` calls are read directly
(google-analytics.com is unreachable from the sandbox):

    == PBS Wisconsin journey (partner link hardcoding the old short key)
       iframe.html?vault_ch=pbswi&vault_src=https%3A%2F%2Fpbswisconsineducation.org  (embedded=True)
       utm_source=pbswisconsineducation.org
       utm_medium=referral
       cd1=pbswisconsineducation.org
       ga tag: UA-72694027-9
    == Vault-native journey (player embed, no vault_ch)
       iframe.html  (embedded=True)
       utm_source=vault
       utm_medium=vault-player
       cd1=vault
       ga tag: UA-72694027-9
    == PBS Wisconsin journey via source fallback (no vault_ch)
       iframe.html?vault_src=https%3A%2F%2Fwww.pbswisconsineducation.org  (embedded=True)
       utm_source=pbswisconsineducation.org
       utm_medium=referral
       cd1=pbswisconsineducation.org
       ga tag: UA-72694027-9

    ALL EXPECTED VALUES MATCH

This is the proof the alias hits the RAW `vault_ch` read: journey 1 passes
`vault_ch=pbswi` explicitly and never reaches the `VAULT_CHANNELS` fallback, yet
reports the hostname. A map-values-only diff would still have emitted `pbswi`
there. `UA-72694027-9` still fires.

### Behaviour matrix (pure-function check, no browser)

The logic block was extracted on its own `/* VAULT_CHANNEL_LOGIC_* */` markers
and exercised in node — all 14 cases pass:

    vault_ch=pbswi                     -> pbswisconsineducation.org / referral
    vault_ch=pbskids                   -> pbskids.org               / referral
    vault_ch=pbslm                     -> pbslearningmedia.org      / referral
    vault_ch=sciencegamecenter         -> sciencegamecenter.org     / referral
    vault_ch=pbswisconsineducation.org -> pbswisconsineducation.org / referral  (idempotent)
    vault_ch=vault                     -> vault                     / vault-player
    vault_ch=other                     -> other                     / vault-player
    vault_ch=somethingnew              -> somethingnew              / vault-player
    vault_ch=hasOwnProperty            -> hasOwnProperty            / vault-player  (no proto bleed)
    src=https://pbswisconsineducation.org (no vault_ch) -> pbswisconsineducation.org / referral
    src=https://www.pbskids.org           (no vault_ch) -> pbskids.org               / referral
    src=https://example.com               (no vault_ch) -> other                     / vault-player
    no vault_ch, no src, embedded                       -> vault                     / vault-player
    no vault_ch, no src, top-level                      -> '' (no utm/cd1 written)   / vault-player

Per the instructions for this phase I wrote no test file into the repo — the
matrix above ran from `/tmp` and the test agent owns `test/channel-check.mjs`
(the markers are in place for it to import).

## Canonical values now shipped by the game (Site + Portal cards must match)

    pbswi             -> pbswisconsineducation.org
    pbskids           -> pbskids.org
    pbslm             -> pbslearningmedia.org
    sciencegamecenter -> sciencegamecenter.org
    vault             -> vault            (UNCHANGED)
    other / direct    -> unchanged

## RELEASE — for Hermes, do NOT re-point an existing version

Production needs a **NEW** version number cut from the merge commit. Do not
promote `master` and do not re-release or re-point m3.5 (that is the 2026-10-28
mistake: a release is a frozen snapshot, so promoting a branch re-shipped an old
build and production did not change).

* Cut release: **m3.6**
* From: the **merge commit SHA** of this card's branch into `master`
  (branch head at hand-off is recorded in the engine's commit; m3.5 =
  `13dcd02` is the base, and m3.6 must be strictly newer than it).
* Verify after release: `cdn.vaultlearninggames.org/fieldday/jowilder/iframe.html`
  is NO LONGER 10,530 bytes and `grep -c "'pbswi'"` on it returns 0.
* Nothing here is deployed. `fielddaylab.wisc.edu/play/jowilder/*` 404ing and
  `.../ci/production/iframe.html` 301ing to the Vault page are EXPECTED — probe
  the CDN, not wisc.edu.
