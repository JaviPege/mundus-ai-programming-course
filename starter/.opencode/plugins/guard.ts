// Fleet guard — an OpenCode PLUGIN that blocks dangerous shell commands.
//
// Plugins are middleware: OpenCode calls them around every tool
// execution, so we can inspect what the model is about to do and
// stop it before it happens.
//
// The "tool.execute.before" hook runs BEFORE any tool executes:
//   - input.tool  → the name of the tool about to run (e.g. "bash")
//   - output.args → the arguments the model gave it
// Throwing an Error cancels the execution and the model sees the
// error message instead of the result.

export const FleetGuard = async () => {
  // Command fragments we never want the model to run in a shell,
  // workshop or not. The list covers BOTH Unix and Windows shells
  // (matching is case-insensitive — the command is lowercased first).
  // Students: feel free to add more patterns here!
  const BLOCKED = [
    "rm -r",       // Unix: recursive delete (covers rm -r, rm -rf, rm -rfv…)
    "rmdir ",      // Unix: remove directory (trailing space on purpose)
    "del /s",      // Windows cmd: recursive delete
    "rmdir /s",    // Windows cmd: recursive directory delete
    "remove-item", // Windows PowerShell: delete files/folders
    "format ",     // Windows cmd: format a drive (trailing space on purpose)
    "drop table",  // SQL: destroy a database table
  ];

  return {
    "tool.execute.before": async (input, output) => {
      // TODO (Module 2): implement the guard.
      // 1. Only inspect the "bash" tool (input.tool) — for any other
      //    tool, just return.
      // 2. Read the shell command from output.args.command and lowercase
      //    it (String(...).toLowerCase()) so matching ignores case.
      // 3. Loop over BLOCKED: if the command contains a pattern
      //    (command.includes(bad)), throw:
      //      new Error(`Blocked by fleet guard: the command contains "${bad}".`)
      // 4. Anything else passes through untouched (do nothing).
      //
      // NOTE: throwing happens BEFORE the command ever runs — that is why
      // the demo command "rm -rf /tmp/whatever" is safe to try on any OS,
      // including Windows: the guard intercepts it before execution.
    },
  };
};
