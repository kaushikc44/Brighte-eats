import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { UserSchema } from '@brighte/shared';
import { Creation, Insertion, retrieval, filterType, RetrievalOne, UpdateLead, DeleteLead } from './database.js';

config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Ensure table exists on startup
Creation();

// POST /leads — Create a lead
app.post('/leads', (req, res) => {
    const result = UserSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }

    Insertion(result.data);
    return res.status(201).json({ message: "Lead created successfully" });
});

// GET /leads — List leads (optional ?service= filter)
app.get('/leads', (req, res) => {
    const serviceFilter = req.query.service as string | undefined;

    if (serviceFilter) {
        return res.json(filterType(serviceFilter));
    }

    return res.json(retrieval());
});

// GET /leads/:id — Get a single lead
app.get('/leads/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const lead = RetrievalOne(id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    return res.json(lead);
});

// PUT /leads/:id — Update a lead
app.put('/leads/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const existing = RetrievalOne(id);
    if (!existing) return res.status(404).json({ error: "Lead not found" });

    const result = UserSchema.partial().safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }

    UpdateLead(id, result.data);
    return res.json({ message: "Lead updated successfully" });
});

// POST /leads/:id/summary — AI summary of lead's interests via Gemini
app.post('/leads/:id/summary', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const lead = RetrievalOne(id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const services = lead.service?.join(', ') || 'none';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.json({ summary: `${lead.name} is interested in ${services}.` });
    }

    const prompt = `Write one short, natural sentence summarizing what services this user is interested in. Keep it under 20 words and friendly.

User name: ${lead.name}
Interested in: ${services}

Summary:`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.5, maxOutputTokens: 50 }
                })
            }
        );

        const data = await response.json();
        const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
            || `${lead.name} is interested in ${services}.`;
        return res.json({ summary });
    } catch {
        return res.json({ summary: `${lead.name} is interested in ${services}.` });
    }
});

// DELETE /leads/:id — Delete a lead
app.delete('/leads/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const lead = RetrievalOne(id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    DeleteLead(id);
    return res.json({ message: "Lead deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
