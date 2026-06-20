import { DatabaseSync } from 'node:sqlite';
import type { Schema } from '@brighte/shared';


//Single input file
//initialize the client
const db = new DatabaseSync("leads.db");

// 1. Make sure the table exists
function Creation() {
    db.exec(`
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  postcode TEXT NOT NULL,
  service TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)
`);
}

//input to the database
function Insertion(user: Schema) {
    const insertLead = db.prepare(
        "INSERT INTO leads (name, email, mobile, postcode, service) VALUES (?, ?, ?, ?, ?)"
    );
    insertLead.run(
        user.name, user.email, user.mobile, user.postcode,
        JSON.stringify(user.service)
    );
}

//Outputs from the database

//Retrival of the code 
function retrieval() {
    const rows = db.prepare("SELECT * FROM leads").all();
    return rows.map((r: any) => ({ ...r, service: JSON.parse(r.service) }));
}

// Service type filters based on delivery,pickup,payment
function filterType(serviceType: string) {
    const filter = db.prepare("Select * from leads where service Like ?").all(`%"${serviceType}"%`);
    return filter.map((r: any) => ({ ...r, service: JSON.parse(r.service) }));
}

// Single Lead Retrieval
function RetrievalOne(id: number) {
    const row = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
    if (!row) return null;
    return { ...(row as any), service: JSON.parse((row as any).service) };
}

// Update Lead
function UpdateLead(id: number, user: Schema) {
    const stmt = db.prepare(
        "UPDATE leads SET name = ?, email = ?, mobile = ?, postcode = ?, service = ? WHERE id = ?"
    );
    const result = stmt.run(
        user.name, user.email, user.mobile, user.postcode,
        JSON.stringify(user.service), id
    );
    return result.changes > 0;
}

// Delete Lead
function DeleteLead(id: number) {
    const result = db.prepare("DELETE FROM leads WHERE id = ?").run(id);
    return result.changes > 0;
}

export { Creation, Insertion, retrieval, filterType, RetrievalOne, UpdateLead, DeleteLead };
