import express from 'express';
import cors from 'cors';
import { UserSchema } from '@brighte/shared';
import { Creation, Insertion, retrieval, filterType, RetrievalOne, UpdateLead, DeleteLead } from './database.js';

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
