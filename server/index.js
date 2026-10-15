import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: "100kb" }));

let listings = [
  { id: "s1", name: "Community Gardening", category: "Environment", type: "Offer", location: "Kochi, Kerala", description: "Help neighbours grow vegetables and maintain shared green spaces.", contact: "community@example.org", createdAt: new Date().toISOString() },
  { id: "s2", name: "Basic Computer Lessons", category: "Education", type: "Offer", location: "Ernakulam, Kerala", description: "Volunteer-led computer and internet basics for learners.", contact: "learn@example.org", createdAt: new Date().toISOString() },
  { id: "s3", name: "Repair Help Needed", category: "Skilled Work", type: "Request", location: "Aluva, Kerala", description: "Looking for a volunteer who can help repair community-centre furniture.", contact: "help@example.org", createdAt: new Date().toISOString() },
  { id: "s4", name: "Translation & Forms Support", category: "Community Support", type: "Offer", location: "Thrippunithura, Kerala", description: "Help residents understand and complete everyday forms.", contact: "support@example.org", createdAt: new Date().toISOString() }
];
let volunteers = [];

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "Shramdaan Connect API" }));

app.get("/api/listings", (req, res) => {
  const q = String(req.query.q || "").toLowerCase().trim();
  const category = String(req.query.category || "").trim();
  const type = String(req.query.type || "").trim();
  const items = listings.filter((item) => {
    const text = `${item.name} ${item.description} ${item.location} ${item.category}`.toLowerCase();
    return (!q || text.includes(q)) && (!category || item.category === category) && (!type || item.type === type);
  });
  res.json(items);
});

app.post("/api/listings", (req, res) => {
  const { name, category, type, location, description, contact } = req.body || {};
  if (![name, category, type, location, description, contact].every((v) => typeof v === "string" && v.trim())) {
    return res.status(400).json({ error: "Please complete every field." });
  }
  if (!["Offer", "Request"].includes(type)) return res.status(400).json({ error: "Type must be Offer or Request." });
  const item = {
    id: randomUUID(), name: name.trim().slice(0, 100), category, type,
    location: location.trim().slice(0, 120), description: description.trim().slice(0, 600),
    contact: contact.trim().slice(0, 160), createdAt: new Date().toISOString()
  };
  listings = [item, ...listings];
  res.status(201).json(item);
});

app.post("/api/volunteers", (req, res) => {
  const { name, email, interest, location } = req.body || {};
  if (![name, email, interest, location].every((v) => typeof v === "string" && v.trim())) {
    return res.status(400).json({ error: "Please complete every field." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  const volunteer = { id: randomUUID(), name: name.trim().slice(0, 100), email: email.trim().slice(0, 160), interest: interest.trim().slice(0, 200), location: location.trim().slice(0, 120), createdAt: new Date().toISOString() };
  volunteers.push(volunteer);
  res.status(201).json({ message: "Thanks for volunteering! Your demo registration has been received.", id: volunteer.id });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(PORT, () => console.log(`Shramdaan Connect API running at http://localhost:${PORT}`));
