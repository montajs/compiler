# Tests
The tests in the `tests/` directory should only test the rendered output of the
functions exposed by the compiler module. They should only import values exported
from `src/index.ts`.

Use `*.spec.ts` tests in the `src/` directory to test for internal correctness.

## Snapshots
The output tests use the [snapshot testing](https://jestjs.io/docs/en/snapshot-testing)
feature in Jest to verify that the output hasn't changed between internal changes.
