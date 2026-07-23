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
    "rm -rf",      // Unix: recursive force delete
    "del /s",      // Windows cmd: recursive delete
    "rmdir /s",    // Windows cmd: recursive directory delete
    "remove-item", // Windows PowerShell: delete files/folders
    "format ",     // Windows cmd: format a drive (trailing space on purpose)
    "drop table",  // SQL: destroy a database table
  ];

  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "bash") return; // only inspect shell commands

      const command = String(output.args?.command ?? "").toLowerCase();
      for (const bad of BLOCKED) {
        if (command.includes(bad)) {
          throw new Error(
            `Blocked by fleet guard: the command contains "${bad}". ` +
              `Dangerous shell commands are not allowed in this workshop.`
          );
        }
      }
      // Anything else passes through untouched.
      // NOTE: the throw happens BEFORE the command ever runs — the demo
      // command "rm -rf /tmp/whatever" is intercepted on any OS, so it is
      // completely safe even on Windows (where it would not work anyway).
    },
  };
};
