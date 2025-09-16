import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import fs from 'node:fs';
import path from 'node:path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const app = express();
const PORT = process.env.PORT || 4242;

// allow your static site origin
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5500', credentials: true }));
app.use(express.json({ limit: '1mb' })); // don't use for webhook route

// tiny JSON "db"
const DB_FILE = path.join(process.cwd(), 'demo-db.json');
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeDB = (d) => fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2));

app.get('/api/needs', (_req, res) => res.json(readDB().needs));

app.post('/api/donate/create-intent', async (req, res) => {
  try {
    const { needId, amount_cents, email } = req.body;
    const db = readDB();
    const need = db.needs.find(n => n.id === needId);
    if (!need) return res.status(404).json({ error: 'Need not found' });

    const shelter = db.shelters.find(s => s.id === need.shelter_id);
    const dest = shelter?.stripe_account_id || null;

    const intent = await stripe.paymentIntents.create({
      amount: amount_cents,
      currency: 'cad',
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      ...(dest ? { on_behalf_of: dest, transfer_data: { destination: dest }, application_fee_amount: Math.round(amount_cents*0.03) } : {}),
      metadata: { need_id: need.id, shelter_id: need.shelter_id }
    });

    res.json({ client_secret: intent.client_secret });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

// webhook: raw body
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const db = readDB();
      const need = db.needs.find(n => n.id === pi.metadata?.need_id);
      if (need && !db.donations.find(d => d.stripe_payment_intent_id === pi.id)) {
        db.donations.push({ stripe_payment_intent_id: pi.id, need_id: need.id, amount_cents: pi.amount_received, created: new Date().toISOString() });
        need.raised_cents = (need.raised_cents || 0) + pi.amount_received;
        writeDB(db);
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook verify failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
