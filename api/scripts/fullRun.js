import { spawn } from "child_process";

const TEST_PORT = 3002;

function run(cmd, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      stdio: "inherit",
      shell: true,
      ...options,
    });
    proc.on("close", (code) => (code === 0 ? resolve() : reject(code)));
    proc.on("error", reject);
  });
}

async function main() {
  let apiProcess;
  try {
    console.log("Starting API in test mode...");
    apiProcess = spawn("node", ["src/index.js"], {
      env: { ...process.env, NODE_ENV: "test", PORT: TEST_PORT },
      stdio: "inherit",
      shell: true,
    });

    // Wait a bit for the server to start
    await new Promise((r) => setTimeout(r, 3000));

    console.log("Running tests...");
    await run("npx", ["mocha", "src/*.test.js"]);

    console.log("Tests passed, shutting down test server...");
    apiProcess.kill();

    const env = process.env.NODE_ENV || "prod";
    console.log(`Starting API in ${env} mode...`);
    if (env === "dev") {
      await run("npm", ["run", "dev"]);
    } else {
      await run("npm", ["run", "start"]);
    }
  } catch (err) {
    if (apiProcess) apiProcess.kill();
    console.error("Pipeline failed:", err);
    process.exit(1);
  }
}

main();
