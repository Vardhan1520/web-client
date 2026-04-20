import express from "express";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import axios from "axios";
import path from "path";
import { DEPARTMENTS, EMPLOYEES } from "./src/constants.ts";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json());

// --- AUTOMATION LOGIC ---

/**
 * Calculates the number of younger employees in each department.
 * This is the implementation of the logic from the PDF challenge.
 */
function calculateYoungerEmployees() {
  return EMPLOYEES.map((emp) => {
    const dept = DEPARTMENTS.find((d) => d.DEPARTMENT_ID === emp.DEPARTMENT);
    const youngerCount = EMPLOYEES.filter((other) => 
      other.DEPARTMENT === emp.DEPARTMENT && 
      new Date(other.DOB) > new Date(emp.DOB)
    ).length;

    return {
      EMP_ID: emp.EMP_ID,
      FIRST_NAME: emp.FIRST_NAME,
      LAST_NAME: emp.LAST_NAME,
      DEPARTMENT_NAME: dept?.DEPARTMENT_NAME || "Unknown",
      YOUNGER_EMPLOYEES_COUNT: youngerCount,
    };
  }).sort((a, b) => b.EMP_ID - a.EMP_ID);
}

const SQL_QUERY = `
SELECT 
    e1.EMP_ID, 
    e1.FIRST_NAME, 
    e1.LAST_NAME, 
    d.DEPARTMENT_NAME,
    COUNT(e2.EMP_ID) AS YOUNGER_EMPLOYEES_COUNT
FROM EMPLOYEE e1
JOIN DEPARTMENT d ON e1.DEPARTMENT = d.DEPARTMENT_ID
LEFT JOIN EMPLOYEE e2 ON e1.DEPARTMENT = e2.DEPARTMENT 
                    AND e2.DOB > e1.DOB
GROUP BY e1.EMP_ID, e1.FIRST_NAME, e1.LAST_NAME, d.DEPARTMENT_NAME
ORDER BY e1.EMP_ID DESC;
`.trim();

let automationLog: string[] = [];

async function runAutomation() {
  console.log("Starting backend automation task...");
  automationLog.push(`[${new Date().toISOString()}] Starting automation...`);

  try {
    const results = calculateYoungerEmployees();
    automationLog.push(`[${new Date().toISOString()}] Calculated results for ${results.length} employees.`);

    const secret = process.env.JWT_SECRET || "default_secret";
    const audience = process.env.JWT_AUDIENCE || "default_audience";
    const webhookUrl = process.env.WEBHOOK_URL;

    // Generate JWT token including the results and SQL query
    const token = jwt.sign(
      { 
        results, 
        sql_query: SQL_QUERY,
        timestamp: new Date().toISOString() 
      }, 
      secret, 
      { 
        audience, 
        expiresIn: '1h' 
      }
    );

    automationLog.push(`[${new Date().toISOString()}] Generated JWT token.`);

    if (webhookUrl && webhookUrl !== "https://your-webhook-api.com/submit") {
      automationLog.push(`[${new Date().toISOString()}] Calling webhook: ${webhookUrl}`);
      const response = await axios.post(webhookUrl, {
        token: token,
        submission: {
            sql: SQL_QUERY,
            data: results
        }
      });
      automationLog.push(`[${new Date().toISOString()}] Webhook response: ${response.status} ${response.statusText}`);
      console.log("Webhook call successful.");
    } else {
      automationLog.push(`[${new Date().toISOString()}] SKIPPED Webhook: No valid WEBHOOK_URL configured in env.`);
      console.warn("No webhook URL configured. Skipping submission.");
    }
  } catch (error: any) {
    const msg = `Automation failed: ${error.message}`;
    console.error(msg);
    automationLog.push(`[${new Date().toISOString()}] ERROR: ${msg}`);
  }
}

// API endpoint to check automation status
app.get("/api/automation-status", (req, res) => {
  res.json({
    status: "online",
    logs: automationLog,
    sql_query: SQL_QUERY
  });
});

// --- VITE MIDDLEWARE SETUP ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Run automation immediately on startup
    runAutomation();
  });
}

startServer();
