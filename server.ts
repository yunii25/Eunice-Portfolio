import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// On Vercel, we must use /tmp for writable files, but note that it's not persistent.
// For real persistence on Vercel, consider using a remote DB like Supabase or Vercel Postgres.
const dbPath = process.env.VERCEL ? path.join("/tmp", "portfolio.db") : path.join(__dirname, "portfolio.db");
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    data TEXT
  )
`);

const initialData = {
  hero: {
    name: "Eunice Roxas",
    role: "Mid-level Full Stack Developer",
    description: "specializing in architecting robust ERP & Business Systems that drive operational excellence."
  },
  about: {
    text1: "Full Stack PHP Developer with hands-on experience delivering end-to-end internal business systems for an Australian company, from database design to production deployment.",
    text2: "I specialize in PHP (CodeIgniter 3), MySQL, and frontend development using JavaScript, jQuery, and Bootstrap. I have a proven track record of building ERP, cashflow, CRM, and reporting modules that support real-world business operations.",
    text3: "My work includes designing database schemas, developing backend logic, implementing responsive UIs, and integrating third-party services like Google Maps and Microsoft Graph."
  },
  solutions: [
    {
      id: "1",
      title: "Construction Management System",
      description: "A centralized web-based platform designed to manage end-to-end solar construction projects, from planning to installation. Supports compliance, project tracking, inventory management, and financial forecasting. Built on CodeIgniter 3 for fast processing."
    },
    {
      id: "2",
      title: "Lead & Pipeline Management",
      description: "Streamlines sales with automatic lead capture from Facebook/Websites via API. Features proposal creation, contract tracking with digital signatures, and seamless integration with the Construction Management System."
    },
    {
      id: "3",
      title: "M365 & Google Workspace Migration",
      description: "Seamless, zero-downtime migrations from legacy servers. Includes custom domain setup, professional alias management, and critical DNS hardening (SPF, DKIM, DMARC) for 100% deliverability."
    }
  ],
  experience: [
    {
      id: "1",
      period: "2024 - Present",
      title: "Mid Full Stack Developer",
      company: "Confidential (Australian-based Company)",
      points: [
        "Maintain and enhance the company’s ERP system using PHP and CodeIgniter, delivering new features based on stakeholder requirements.",
        "Collaborate with business teams to translate requirements into functional ERP modules and process improvements.",
        "Utilize Git for version control, ensuring efficient code management and team collaboration.",
        "Create user documentation and training manuals, and conduct end-user sessions for new ERP modules.",
        "Provide technical support and troubleshooting for ERP system errors, account management, and basic networking tasks."
      ]
    },
    {
      id: "2",
      period: "Jan - May 2024",
      title: "Web Developer Intern",
      company: "Baytech BPO Corporation",
      points: [
        "Maintained and enhanced client web applications using PHP and the Laravel framework.",
        "Acquired foundational knowledge in React.js and Vue.js for frontend development.",
        "Optimized PostgreSQL database management using HeidiSQL for improved data handling.",
        "Developed and integrated a JSON data retrieval API to fetch data from AWS S3 buckets.",
        "Created and maintained documentation of web development processes, improving team productivity."
      ]
    }
  ],
  skills: [
    "PHP", "JavaScript", "HTML", "CSS", "Node.js", "AJAX", "Apache", "Atlassian", "VS Code", 
    "Microsoft 365", "Google Workspace", "Bootstrap 4/5", "CodeIgniter", "jQuery", "Laravel", 
    "React", "MySQL", "PostgreSQL", "Supabase", "Git", "Digital Ocean", "MS Admin"
  ]
};

// Seed initial data if empty
const row = db.prepare("SELECT * FROM content WHERE id = 'main'").get();
if (!row) {
  db.prepare("INSERT INTO content (id, data) VALUES (?, ?)").run("main", JSON.stringify(initialData));
}

const app = express();
app.use(express.json());

// API Routes
app.get("/api/content", (req, res) => {
  const row = db.prepare("SELECT data FROM content WHERE id = 'main'").get();
  res.json(JSON.parse(row.data));
});

app.post("/api/auth", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (password === adminPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/api/content", (req, res) => {
  const { data: newData, password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  if (password !== adminPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  db.prepare("UPDATE content SET data = ? WHERE id = 'main'").run(JSON.stringify(newData));
  res.json({ success: true });
});

async function setupServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }
}

// Start server if not running on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  setupServer().then(() => {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
