// A script to fix the missing yoga.wasm file error
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

async function fixOpenApiCodegen() {
  try {
    // Path to the source wasm file (may need adjustment based on your setup)
    const sourceWasmPath = path.resolve(
      __dirname,
      "node_modules",
      "@swc",
      "core-win32-x64-msvc",
      "yoga.wasm",
    );

    // Target directory where the file should be
    const targetDir = path.resolve(
      __dirname,
      "node_modules",
      "@openapi-codegen",
      "cli",
      "lib",
    );

    // Target path for the wasm file
    const targetWasmPath = path.join(targetDir, "yoga.wasm");

    if (fs.existsSync(sourceWasmPath)) {
      console.log(`Found source WebAssembly file at: ${sourceWasmPath}`);

      // Create directory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        await mkdir(targetDir, { recursive: true });
      }

      // Copy the wasm file
      await copyFile(sourceWasmPath, targetWasmPath);
      console.log(`Successfully copied WebAssembly file to: ${targetWasmPath}`);
    } else {
      console.error("Source WebAssembly file not found");

      // Try to find any other yoga.wasm file in the node_modules
      console.log("Searching for yoga.wasm in node_modules...");
      const foundFiles = findWasmFiles(path.resolve(__dirname, "node_modules"));

      if (foundFiles.length > 0) {
        console.log(`Found ${foundFiles.length} potential WebAssembly files:`);
        foundFiles.forEach((file) => console.log(`- ${file}`));

        // Copy the first found file
        await copyFile(foundFiles[0], targetWasmPath);
        console.log(`Copied ${foundFiles[0]} to ${targetWasmPath}`);
      } else {
        console.error("No yoga.wasm files found in node_modules");
      }
    }
  } catch (error) {
    console.error("Error fixing OpenAPI codegen:", error);
  }
}

// Helper function to recursively find wasm files
function findWasmFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules within node_modules to avoid deep recursion
      if (dir.includes("node_modules") && file === "node_modules") continue;
      findWasmFiles(filePath, results);
    } else if (file === "yoga.wasm") {
      results.push(filePath);
    }
  }

  return results;
}

// Run the function
fixOpenApiCodegen();
