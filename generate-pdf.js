import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'project-docs.html');
const pdfPath = path.join(__dirname, 'ExpressinMusic-ProjectDocs.pdf');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>ExpressinMusic — Full Project Documentation</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --purple: #6C4DFF;
    --pink: #FF3B81;
    --cyan: #00D4FF;
    --dark: #0c0c0f;
    --card: #13131a;
    --border: #1e1e2e;
    --text: #e2e2f0;
    --muted: #8888aa;
    --green: #22c55e;
    --orange: #f97316;
    --yellow: #eab308;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', sans-serif;
    background: #ffffff;
    color: #1a1a2e;
    font-size: 10.5pt;
    line-height: 1.6;
  }

  /* ── Cover Page ── */
  .cover {
    background: linear-gradient(135deg, #0c0c0f 0%, #1a0a2e 50%, #0c1420 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 40px;
    page-break-after: always;
    color: white;
  }

  .cover-logo {
    width: 80px; height: 80px;
    background: linear-gradient(135deg, #6C4DFF, #FF3B81, #00D4FF);
    border-radius: 24px;
    margin: 0 auto 32px;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px;
  }

  .cover h1 {
    font-size: 42pt;
    font-weight: 800;
    background: linear-gradient(90deg, #A78BFA, #FF3B81, #00D4FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
  }

  .cover .tagline {
    font-size: 16pt;
    color: rgba(255,255,255,0.6);
    margin-bottom: 48px;
  }

  .cover-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    max-width: 700px;
    margin: 0 auto 48px;
  }

  .cover-stat {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 20px 16px;
  }

  .cover-stat .num { font-size: 22pt; font-weight: 800; color: #A78BFA; }
  .cover-stat .lbl { font-size: 9pt; color: rgba(255,255,255,0.5); margin-top: 4px; }

  .cover-meta {
    color: rgba(255,255,255,0.35);
    font-size: 9pt;
    margin-top: 40px;
  }

  /* ── TOC ── */
  .toc-page {
    padding: 60px 50px;
    page-break-after: always;
    background: #fafafa;
  }

  .toc-title {
    font-size: 24pt;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 32px;
    padding-bottom: 12px;
    border-bottom: 3px solid #6C4DFF;
  }

  .toc-section { margin-bottom: 8px; }
  .toc-section a {
    display: flex;
    justify-content: space-between;
    text-decoration: none;
    color: #1a1a2e;
    font-size: 10.5pt;
    padding: 6px 0;
    border-bottom: 1px dotted #ddd;
  }
  .toc-section a:hover { color: #6C4DFF; }
  .toc-section .toc-num { color: #888; font-size: 9pt; }
  .toc-group { font-weight: 700; font-size: 11pt; color: #6C4DFF; margin-top: 18px; margin-bottom: 4px; }

  /* ── Sections ── */
  .section {
    padding: 50px 50px 40px;
    page-break-before: always;
  }

  .section:first-child { page-break-before: auto; }

  .section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
  }

  .section-num {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #6C4DFF, #FF3B81);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 800; font-size: 13pt;
    flex-shrink: 0;
  }

  .section-title { font-size: 22pt; font-weight: 800; color: #1a1a2e; }
  .section-subtitle { font-size: 10pt; color: #888; margin-top: 2px; }

  h2 { font-size: 15pt; font-weight: 700; color: #1a1a2e; margin: 28px 0 12px; }
  h3 { font-size: 12pt; font-weight: 600; color: #2a2a4e; margin: 20px 0 8px; }
  h4 { font-size: 10.5pt; font-weight: 600; color: #6C4DFF; margin: 14px 0 6px; }

  p { margin-bottom: 10px; color: #2a2a4e; }

  /* ── Cards ── */
  .card {
    background: #f8f8fc;
    border: 1px solid #e8e8f0;
    border-radius: 12px;
    padding: 18px 20px;
    margin-bottom: 14px;
  }

  .card-purple { border-left: 4px solid #6C4DFF; }
  .card-pink   { border-left: 4px solid #FF3B81; }
  .card-cyan   { border-left: 4px solid #00D4FF; }
  .card-green  { border-left: 4px solid #22c55e; }
  .card-orange { border-left: 4px solid #f97316; }

  /* ── Tables ── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 20px;
    font-size: 9.5pt;
  }

  th {
    background: linear-gradient(135deg, #6C4DFF, #8B5CF6);
    color: white;
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
  }

  td {
    padding: 9px 14px;
    border-bottom: 1px solid #f0f0f0;
    color: #2a2a4e;
    vertical-align: top;
  }

  tr:nth-child(even) td { background: #f8f8fc; }
  tr:hover td { background: #f0f0ff; }

  /* ── Code blocks ── */
  .code-block {
    background: #1a1a2e;
    border-radius: 10px;
    padding: 16px 20px;
    margin: 12px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    color: #c9d1d9;
    overflow: hidden;
    page-break-inside: avoid;
    line-height: 1.7;
  }

  .code-block .kw { color: #ff79c6; }
  .code-block .str { color: #f1fa8c; }
  .code-block .comment { color: #6272a4; font-style: italic; }
  .code-block .fn { color: #50fa7b; }
  .code-block .const { color: #bd93f9; }
  .code-block .url { color: #00D4FF; }

  /* ── Badges ── */
  .badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 8pt;
    font-weight: 600;
    margin: 2px 3px;
  }
  .badge-purple { background: rgba(108,77,255,0.15); color: #6C4DFF; }
  .badge-pink   { background: rgba(255,59,129,0.15); color: #FF3B81; }
  .badge-green  { background: rgba(34,197,94,0.15);  color: #16a34a; }
  .badge-cyan   { background: rgba(0,212,255,0.15);  color: #0891b2; }
  .badge-orange { background: rgba(249,115,22,0.15); color: #ea580c; }
  .badge-gray   { background: rgba(100,100,150,0.1); color: #555; }

  /* ── API endpoint blocks ── */
  .endpoint {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 14px;
    background: #f8f8fc;
    border: 1px solid #e8e8f0;
    border-radius: 8px;
    margin-bottom: 8px;
    page-break-inside: avoid;
  }
  .method {
    padding: 3px 10px;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    font-weight: 700;
    flex-shrink: 0;
    min-width: 54px;
    text-align: center;
  }
  .GET    { background: rgba(34,197,94,0.15);  color: #16a34a; }
  .POST   { background: rgba(108,77,255,0.15); color: #6C4DFF; }
  .PUT    { background: rgba(249,115,22,0.15); color: #ea580c; }
  .DELETE { background: rgba(255,59,129,0.15); color: #FF3B81; }
  .endpoint-path { font-family: 'JetBrains Mono', monospace; font-size: 9pt; color: #1a1a2e; font-weight: 500; }
  .endpoint-desc { font-size: 8.5pt; color: #666; margin-top: 2px; }

  /* ── Grid ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 14px 0; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin: 14px 0; }

  .mini-card {
    background: #f8f8fc;
    border: 1px solid #e8e8f0;
    border-radius: 10px;
    padding: 14px 16px;
  }
  .mini-card .icon { font-size: 20pt; margin-bottom: 8px; }
  .mini-card .label { font-size: 9pt; color: #888; }
  .mini-card .value { font-size: 12pt; font-weight: 700; color: #1a1a2e; }

  /* ── Flow diagram ── */
  .flow {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 16px 0;
    padding: 16px;
    background: #f8f8fc;
    border-radius: 12px;
  }
  .flow-step {
    background: white;
    border: 2px solid #6C4DFF;
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 9pt;
    font-weight: 600;
    color: #1a1a2e;
    text-align: center;
  }
  .flow-arrow { color: #6C4DFF; font-weight: 700; font-size: 14pt; }

  /* ── Role matrix ── */
  .check { color: #22c55e; font-weight: 700; }
  .cross { color: #ef4444; }

  ul { margin: 8px 0 10px 20px; }
  li { margin-bottom: 4px; color: #2a2a4e; }

  .divider {
    height: 3px;
    background: linear-gradient(90deg, #6C4DFF, #FF3B81, #00D4FF);
    border-radius: 2px;
    margin: 24px 0;
  }

  .highlight-box {
    background: linear-gradient(135deg, rgba(108,77,255,0.08), rgba(255,59,129,0.05));
    border: 1px solid rgba(108,77,255,0.2);
    border-radius: 12px;
    padding: 18px 20px;
    margin: 16px 0;
  }

  .env-box {
    background: #1a1a2e;
    border-radius: 10px;
    padding: 16px 20px;
    margin: 12px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    color: #e2e8f0;
    line-height: 1.9;
  }
  .env-key { color: #bd93f9; }
  .env-val { color: #f1fa8c; }
  .env-comment { color: #6272a4; font-style: italic; }

  @page {
    margin: 15mm 15mm 20mm;
    @bottom-center {
      content: "ExpressinMusic Platform Docs  •  Page " counter(page) " of " counter(pages);
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      color: #aaa;
    }
  }

  @media print {
    .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<!-- ══════════════════════════════════════════════════════════════ -->
<!-- COVER PAGE                                                      -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="cover">
  <div class="cover-logo">🎵</div>
  <h1>ExpressinMusic</h1>
  <p class="tagline">Custom Song Production Platform — Full Project Documentation</p>

  <div class="cover-grid">
    <div class="cover-stat"><div class="num">120+</div><div class="lbl">API Endpoints</div></div>
    <div class="cover-stat"><div class="num">18</div><div class="lbl">Route Modules</div></div>
    <div class="cover-stat"><div class="num">12</div><div class="lbl">Admin Tabs</div></div>
    <div class="cover-stat"><div class="num">7</div><div class="lbl">Staff Roles</div></div>
    <div class="cover-stat"><div class="num">15</div><div class="lbl">Data Models</div></div>
    <div class="cover-stat"><div class="num">13</div><div class="lbl">Frontend Pages</div></div>
  </div>

  <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-bottom:32px;">
    <span style="background:rgba(108,77,255,0.2);border:1px solid rgba(108,77,255,0.4);border-radius:20px;padding:6px 16px;font-size:9pt;color:#A78BFA;">Node.js + Express</span>
    <span style="background:rgba(108,77,255,0.2);border:1px solid rgba(108,77,255,0.4);border-radius:20px;padding:6px 16px;font-size:9pt;color:#A78BFA;">MongoDB Atlas</span>
    <span style="background:rgba(108,77,255,0.2);border:1px solid rgba(108,77,255,0.4);border-radius:20px;padding:6px 16px;font-size:9pt;color:#A78BFA;">React + TypeScript</span>
    <span style="background:rgba(108,77,255,0.2);border:1px solid rgba(108,77,255,0.4);border-radius:20px;padding:6px 16px;font-size:9pt;color:#A78BFA;">Tailwind CSS</span>
    <span style="background:rgba(108,77,255,0.2);border:1px solid rgba(108,77,255,0.4);border-radius:20px;padding:6px 16px;font-size:9pt;color:#A78BFA;">JWT Auth</span>
    <span style="background:rgba(255,59,129,0.2);border:1px solid rgba(255,59,129,0.4);border-radius:20px;padding:6px 16px;font-size:9pt;color:#FF3B81;">Razorpay</span>
  </div>

  <div class="cover-meta">Generated: ${new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })} &nbsp;•&nbsp; Version 1.0</div>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- TABLE OF CONTENTS                                               -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="toc-page">
  <div class="toc-title">Table of Contents</div>

  <div class="toc-group">Overview</div>
  <div class="toc-section"><a href="#s1"><span>1. Project Overview & Tech Stack</span><span class="toc-num">3</span></a></div>
  <div class="toc-section"><a href="#s2"><span>2. Project Structure</span><span class="toc-num">4</span></a></div>

  <div class="toc-group">Backend</div>
  <div class="toc-section"><a href="#s3"><span>3. Database Models</span><span class="toc-num">5</span></a></div>
  <div class="toc-section"><a href="#s4"><span>4. Authentication & Roles</span><span class="toc-num">7</span></a></div>
  <div class="toc-section"><a href="#s5"><span>5. Complete API Reference</span><span class="toc-num">8</span></a></div>
  <div class="toc-section"><a href="#s6"><span>6. Order Production Workflow</span><span class="toc-num">13</span></a></div>
  <div class="toc-section"><a href="#s7"><span>7. Payment Integration (Razorpay)</span><span class="toc-num">14</span></a></div>
  <div class="toc-section"><a href="#s8"><span>8. File Storage & Downloads</span><span class="toc-num">15</span></a></div>
  <div class="toc-section"><a href="#s9"><span>9. Notifications (Email & WhatsApp)</span><span class="toc-num">16</span></a></div>

  <div class="toc-group">Frontend</div>
  <div class="toc-section"><a href="#s10"><span>10. Frontend Pages</span><span class="toc-num">17</span></a></div>
  <div class="toc-section"><a href="#s11"><span>11. Create Song Page — Sales Funnel</span><span class="toc-num">18</span></a></div>
  <div class="toc-section"><a href="#s12"><span>12. Admin Dashboard (12 Tabs)</span><span class="toc-num">19</span></a></div>
  <div class="toc-section"><a href="#s13"><span>13. User Dashboard</span><span class="toc-num">21</span></a></div>

  <div class="toc-group">Deployment</div>
  <div class="toc-section"><a href="#s14"><span>14. Environment Variables</span><span class="toc-num">22</span></a></div>
  <div class="toc-section"><a href="#s15"><span>15. Running the Project</span><span class="toc-num">23</span></a></div>
  <div class="toc-section"><a href="#s16"><span>16. Sample Test Accounts</span><span class="toc-num">24</span></a></div>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 1 — PROJECT OVERVIEW                                    -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s1">
  <div class="section-header">
    <div class="section-num">1</div>
    <div>
      <div class="section-title">Project Overview & Tech Stack</div>
      <div class="section-subtitle">What this platform does and what it's built with</div>
    </div>
  </div>

  <div class="highlight-box">
    <strong>ExpressinMusic</strong> is a full-stack custom music production platform where customers order personalised songs (birthday dedications, brand anthems, campaign songs), and an internal team of lyricists, composers, QA reviewers and operators produces and delivers them. All traffic from ads lands on the <strong>Create Song</strong> sales funnel page.
  </div>

  <div class="grid-3">
    <div class="mini-card"><div class="icon">🎵</div><div class="label">Platform Type</div><div class="value" style="font-size:10pt">Music Production SaaS</div></div>
    <div class="mini-card"><div class="icon">👤</div><div class="label">User Types</div><div class="value" style="font-size:10pt">Customer + 6 Staff Roles</div></div>
    <div class="mini-card"><div class="icon">🎸</div><div class="label">Song Types</div><div class="value" style="font-size:10pt">Personal / Business / Campaign</div></div>
  </div>

  <h2>Tech Stack</h2>
  <table>
    <tr><th>Layer</th><th>Technology</th><th>Purpose</th></tr>
    <tr><td><strong>Frontend</strong></td><td>React 18 + TypeScript + Vite</td><td>Customer-facing UI and admin panel</td></tr>
    <tr><td><strong>Styling</strong></td><td>Tailwind CSS</td><td>Utility-first dark-themed UI</td></tr>
    <tr><td><strong>Routing</strong></td><td>React Router v6</td><td>Client-side page navigation</td></tr>
    <tr><td><strong>Backend</strong></td><td>Node.js + Express v5</td><td>REST API server</td></tr>
    <tr><td><strong>Database</strong></td><td>MongoDB Atlas + Mongoose v9</td><td>Document storage, ODM</td></tr>
    <tr><td><strong>Auth</strong></td><td>JWT (jsonwebtoken)</td><td>Stateless authentication</td></tr>
    <tr><td><strong>Passwords</strong></td><td>bcryptjs</td><td>Password hashing</td></tr>
    <tr><td><strong>File Upload</strong></td><td>Multer</td><td>Photo + reference file uploads</td></tr>
    <tr><td><strong>Payments</strong></td><td>Razorpay SDK</td><td>Order creation + webhook verification</td></tr>
    <tr><td><strong>Email</strong></td><td>Nodemailer</td><td>Order status notifications</td></tr>
    <tr><td><strong>WhatsApp</strong></td><td>Meta Business API</td><td>Customer update messages</td></tr>
    <tr><td><strong>Security</strong></td><td>Helmet + CORS</td><td>HTTP headers + cross-origin</td></tr>
    <tr><td><strong>Logging</strong></td><td>Morgan + SystemLog model</td><td>HTTP + activity logs</td></tr>
  </table>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 2 — PROJECT STRUCTURE                                   -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s2">
  <div class="section-header">
    <div class="section-num">2</div>
    <div><div class="section-title">Project Structure</div><div class="section-subtitle">Directory layout and key files</div></div>
  </div>

  <div class="code-block"><span class="comment"># Root directory</span>
project-root/
├── server.js                     <span class="comment"># Express app entry point</span>
├── package.json
├── .env                          <span class="comment"># Environment variables</span>
├── uploads/                      <span class="comment"># Uploaded files (profile photos, order refs)</span>
│
├── server/
│   ├── models/                   <span class="comment"># Mongoose schemas</span>
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── Package.js
│   │   ├── Ticket.js
│   │   ├── Affiliate.js
│   │   ├── Payment.js
│   │   ├── Download.js
│   │   ├── PaymentGateway.js
│   │   ├── Setting.js
│   │   └── SystemLog.js
│   │
│   └── routes/                   <span class="comment"># Express route handlers</span>
│       ├── auth.js               <span class="comment"># Register, login, staff management</span>
│       ├── orders.js             <span class="comment"># Order CRUD + coupon + checkout</span>
│       ├── packages.js           <span class="comment"># Pricing packages</span>
│       ├── songOptions.js        <span class="comment"># Music styles, languages, moods</span>
│       ├── tickets.js            <span class="comment"># Support tickets</span>
│       ├── affiliates.js         <span class="comment"># Coupon / affiliate management</span>
│       ├── payments.js           <span class="comment"># Razorpay integration</span>
│       ├── staff.js              <span class="comment"># Staff workflow APIs</span>
│       ├── qa.js                 <span class="comment"># QA review + approve + rework</span>
│       ├── analytics.js          <span class="comment"># Revenue + orders + upsells analytics</span>
│       ├── downloads.js          <span class="comment"># Delivery files with expiry</span>
│       ├── admin.js              <span class="comment"># Dashboard, export, assign staff</span>
│       ├── notifications.js      <span class="comment"># Email + WhatsApp notifications</span>
│       ├── settings.js           <span class="comment"># Master data (music styles, languages)</span>
│       ├── logs.js               <span class="comment"># System activity logs</span>
│       ├── profile.js            <span class="comment"># User profile + photo upload</span>
│       ├── customers.js          <span class="comment"># Customer management</span>
│       └── samples.js            <span class="comment"># Audio sample songs</span>
│
└── src/                          <span class="comment"># React frontend</span>
    ├── App.tsx                   <span class="comment"># Routes definition</span>
    ├── contexts/AuthContext.tsx  <span class="comment"># JWT auth state</span>
    ├── hooks/useAuth.ts
    ├── lib/api.ts                <span class="comment"># fetchJson, postJson, putJson, deleteJson</span>
    ├── components/               <span class="comment"># Reusable UI components</span>
    └── pages/                    <span class="comment"># Full-page components</span></div>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 3 — DATABASE MODELS                                     -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s3">
  <div class="section-header">
    <div class="section-num">3</div>
    <div><div class="section-title">Database Models</div><div class="section-subtitle">MongoDB schemas with field descriptions</div></div>
  </div>

  <h2>User</h2>
  <table>
    <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    <tr><td>email</td><td>String (unique)</td><td>Login identifier</td></tr>
    <tr><td>password</td><td>String (hashed)</td><td>bcrypt hash, auto-hashed on save</td></tr>
    <tr><td>name</td><td>String</td><td>Display name</td></tr>
    <tr><td>role</td><td>Enum</td><td>user | admin | operator | lyrics_team | music_production | qa_team | support</td></tr>
    <tr><td>phone, city</td><td>String</td><td>Contact info</td></tr>
    <tr><td>department</td><td>String</td><td>Staff department label</td></tr>
    <tr><td>isActive</td><td>Boolean</td><td>Account enabled/disabled</td></tr>
    <tr><td>photo_url</td><td>String</td><td>Profile photo path</td></tr>
  </table>

  <h2>Order</h2>
  <table>
    <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    <tr><td>order_code</td><td>String (unique)</td><td>Auto-generated: ORD-timestamp-random</td></tr>
    <tr><td>customer_name, customer_email, customer_phone</td><td>String</td><td>Customer details</td></tr>
    <tr><td>package_id</td><td>Ref: Package</td><td>Which song package ordered</td></tr>
    <tr><td>status</td><td>Enum</td><td>received → processing → lyrics_in_progress → music_production → final_review → delivered | cancelled</td></tr>
    <tr><td>language, music_style, mood, singer_voice</td><td>String</td><td>Song creative brief</td></tr>
    <tr><td>story, names_to_include, special_message, reference_song</td><td>String</td><td>Customer's personalisation inputs</td></tr>
    <tr><td>upsell_options</td><td>[String]</td><td>Add-on names selected</td></tr>
    <tr><td>total_price</td><td>Number</td><td>Final amount after discounts + add-ons</td></tr>
    <tr><td>assigned_staff / assigned_lyrics_team / assigned_production_team / assigned_qa_team</td><td>Ref: User</td><td>Staff assignments per stage</td></tr>
    <tr><td>lyrics, music_prompt, ai_music_prompt</td><td>String</td><td>Production content</td></tr>
    <tr><td>audio_mp3, audio_wav, audio_instrumental, video_reel, lyrics_pdf</td><td>String</td><td>Delivery file URLs (S3/CDN)</td></tr>
    <tr><td>admin_notes, qa_notes, rework_reason</td><td>String</td><td>Internal notes</td></tr>
    <tr><td>deadline, delivery_date</td><td>Date</td><td>Production deadlines</td></tr>
  </table>

  <div class="grid-2">
    <div>
      <h2>Payment</h2>
      <table>
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>order_id</td><td>Ref: Order</td></tr>
        <tr><td>gateway</td><td>razorpay | stripe | manual</td></tr>
        <tr><td>gateway_order_id</td><td>Razorpay order ID</td></tr>
        <tr><td>gateway_payment_id</td><td>Razorpay payment ID</td></tr>
        <tr><td>gateway_signature</td><td>HMAC verification</td></tr>
        <tr><td>amount</td><td>In INR</td></tr>
        <tr><td>status</td><td>pending | paid | failed | refunded</td></tr>
      </table>
    </div>
    <div>
      <h2>Download</h2>
      <table>
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>order_id</td><td>Ref: Order</td></tr>
        <tr><td>customer_email</td><td>For access control</td></tr>
        <tr><td>file_type</td><td>mp3 | wav | instrumental | video_reel | lyrics_pdf</td></tr>
        <tr><td>file_url</td><td>S3/CDN URL</td></tr>
        <tr><td>expires_at</td><td>1-year expiry by default</td></tr>
        <tr><td>download_count</td><td>Tracks downloads</td></tr>
        <tr><td>max_downloads</td><td>Default 50</td></tr>
      </table>
    </div>
  </div>

  <h2>Affiliate / Coupon</h2>
  <table>
    <tr><th>Field</th><th>Description</th></tr>
    <tr><td>coupon_code</td><td>Unique uppercase code (e.g. SAVE10)</td></tr>
    <tr><td>coupon_type</td><td>percentage | fixed</td></tr>
    <tr><td>discount_value</td><td>% or ₹ amount</td></tr>
    <tr><td>usage_count / usage_limit</td><td>Rate limiting</td></tr>
    <tr><td>start_date / end_date</td><td>Validity window</td></tr>
    <tr><td>commission_percent</td><td>Affiliate earnings</td></tr>
    <tr><td>orders_generated, revenue_generated</td><td>Auto-tracked performance</td></tr>
  </table>

  <h2>Other Models</h2>
  <table>
    <tr><th>Model</th><th>Purpose</th><th>Key Fields</th></tr>
    <tr><td>Package</td><td>Song pricing tiers</td><td>name, price, delivery_hours, category</td></tr>
    <tr><td>Ticket</td><td>Support tickets</td><td>ticket_code, customer_email, subject, message, status, replies[]</td></tr>
    <tr><td>Setting</td><td>Master dropdown data</td><td>type (music_style/language/mood/upsell), value, price, is_active</td></tr>
    <tr><td>SystemLog</td><td>Activity audit trail</td><td>action, user_email, user_role, description, created_at</td></tr>
    <tr><td>PaymentGateway</td><td>Gateway credentials</td><td>name, key_id, key_secret (encrypted), is_test_mode</td></tr>
    <tr><td>Sample</td><td>Audio sample songs</td><td>title, genre, duration, audio_url</td></tr>
  </table>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 4 — AUTH & ROLES                                        -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s4">
  <div class="section-header">
    <div class="section-num">4</div>
    <div><div class="section-title">Authentication & Role System</div><div class="section-subtitle">JWT flow and access control matrix</div></div>
  </div>

  <h2>JWT Authentication Flow</h2>
  <div class="flow">
    <div class="flow-step">POST /auth/register<br/>or /auth/login</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">Server validates<br/>+ bcrypt compare</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">JWT issued<br/>(7-day expiry)</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">Client stores<br/>in localStorage</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">Authorization:<br/>Bearer {token}</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">Middleware<br/>decodes + attaches</div>
  </div>

  <p>Token payload: <code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;font-size:9pt">{ userId, email, role, name }</code></p>

  <h2>Role Access Matrix</h2>
  <table>
    <tr>
      <th>Area</th>
      <th>admin</th><th>operator</th><th>lyrics_team</th><th>music_production</th><th>qa_team</th><th>support</th><th>user</th>
    </tr>
    <tr><td>Admin Dashboard</td><td class="check">✓</td><td class="check">✓</td><td class="check">✓</td><td class="check">✓</td><td class="check">✓</td><td class="check">✓</td><td class="cross">✗</td></tr>
    <tr><td>All Orders</td><td class="check">✓</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td></tr>
    <tr><td>My Orders (customer)</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="check">✓</td></tr>
    <tr><td>Lyrics Stage</td><td class="check">✓</td><td class="check">✓</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td></tr>
    <tr><td>Music Production Stage</td><td class="check">✓</td><td class="check">✓</td><td class="cross">✗</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td></tr>
    <tr><td>QA Review</td><td class="check">✓</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td></tr>
    <tr><td>Support Tickets</td><td class="check">✓</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="check">✓</td><td class="check">✓*</td></tr>
    <tr><td>Affiliates/Coupons</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td></tr>
    <tr><td>Settings/Master Data</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td></tr>
    <tr><td>Staff Management</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td></tr>
    <tr><td>Analytics</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td></tr>
    <tr><td>System Logs</td><td class="check">✓</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td></tr>
  </table>
  <p style="font-size:8.5pt;color:#888">* Users can only view/create their own tickets. Staff see all.</p>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 5 — API REFERENCE                                       -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s5">
  <div class="section-header">
    <div class="section-num">5</div>
    <div><div class="section-title">Complete API Reference</div><div class="section-subtitle">Base URL: http://localhost:5000/api — All protected routes require Authorization: Bearer {token}</div></div>
  </div>

  <h2>Authentication  <span class="badge badge-gray">/api/auth</span></h2>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/auth/register</div><div class="endpoint-desc">Register new customer account. Body: name, email, phone, password</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/auth/login</div><div class="endpoint-desc">Login. Returns JWT token + user object. Blocks inactive accounts.</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/auth/social-login</div><div class="endpoint-desc">Google/Facebook OAuth stub. Returns 501 until OAuth credentials configured.</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/auth/change-password</div><div class="endpoint-desc">🔒 Authenticated. Requires current_password + new_password (min 6 chars)</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/auth/operators</div><div class="endpoint-desc">🔑 Admin. List all staff members (all non-user roles)</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/auth/operators</div><div class="endpoint-desc">🔑 Admin. Create staff: name, email, password, role, department, phone</div></div></div>
  <div class="endpoint"><span class="method PUT">PUT</span><div><div class="endpoint-path">/auth/operators/:id</div><div class="endpoint-desc">🔑 Admin. Toggle staff active/inactive</div></div></div>
  <div class="endpoint"><span class="method DELETE">DELETE</span><div><div class="endpoint-path">/auth/operators/:id</div><div class="endpoint-desc">🔑 Admin. Remove staff account</div></div></div>

  <h2>User Profile  <span class="badge badge-gray">/api/profile</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/profile/me</div><div class="endpoint-desc">🔒 Get current user's full profile</div></div></div>
  <div class="endpoint"><span class="method PUT">PUT</span><div><div class="endpoint-path">/profile/me</div><div class="endpoint-desc">🔒 Update name, phone, city</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/profile/photo</div><div class="endpoint-desc">🔒 Upload profile photo (multipart/form-data, field: photo, max 5MB)</div></div></div>

  <h2>Song Options — Public Dropdowns  <span class="badge badge-green">PUBLIC</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/music-styles</div><div class="endpoint-desc">Returns active music style options from Settings DB: [{id, name, price}]</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/languages</div><div class="endpoint-desc">Returns active language options</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/moods</div><div class="endpoint-desc">Returns active mood options</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/order-types</div><div class="endpoint-desc">Personal Song / Business Song / Campaign Song</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/upsells</div><div class="endpoint-desc">Returns active upsell add-on options with prices</div></div></div>

  <h2>Orders  <span class="badge badge-gray">/api/orders</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/orders/my</div><div class="endpoint-desc">🔒 Customer's own orders with package details populated</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/orders</div><div class="endpoint-desc">👷 Staff. All orders. Query: ?status=</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/orders</div><div class="endpoint-desc">Create order: customer_name, customer_email, package_id, story, music_style, mood, language, singer_voice, special_message, reference_song, upsell_options, total_price</div></div></div>
  <div class="endpoint"><span class="method PUT">PUT</span><div><div class="endpoint-path">/orders/:id</div><div class="endpoint-desc">👷 Staff. Update any order field (status, lyrics, notes, files, staff assignments)</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/orders/apply-coupon</div><div class="endpoint-desc">🔒 Validate and calculate discount. Body: order_id, coupon_code. Returns: discount_amount, new_total</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/orders/checkout</div><div class="endpoint-desc">🔒 Lock order, apply coupon, set status=received. Returns final_price + payment instructions.</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/orders/:id/upload</div><div class="endpoint-desc">🔒 Upload reference file. multipart/form-data, field: file (max 20MB). Returns file_url.</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/orders/:id/timeline</div><div class="endpoint-desc">🔒 Get order status timeline with stage completion indicators</div></div></div>

  <h2>Payments  <span class="badge badge-gray">/api/payments</span></h2>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/payments/create</div><div class="endpoint-desc">🔒 Create Razorpay order. Body: order_id. Returns: gateway_order_id, amount_paise</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/payments/verify</div><div class="endpoint-desc">🔒 Verify Razorpay signature. Body: razorpay_order_id, razorpay_payment_id, razorpay_signature. Moves order to processing on success.</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/payments/webhook</div><div class="endpoint-desc">PUBLIC. Razorpay webhook handler. Handles payment.captured + payment.failed events.</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/payments/:order_id</div><div class="endpoint-desc">🔒 Get payment status for an order</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/payments/admin/gateways</div><div class="endpoint-desc">🔑 Admin. List configured payment gateways</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/payments/admin/gateways</div><div class="endpoint-desc">🔑 Admin. Add gateway config (name, key_id, key_secret, webhook_secret)</div></div></div>
  <div class="endpoint"><span class="method PUT">PUT</span><div><div class="endpoint-path">/payments/admin/gateways/:id</div><div class="endpoint-desc">🔑 Admin. Update gateway credentials</div></div></div>

  <h2>Staff Workflow  <span class="badge badge-orange">/api/staff</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/staff/orders</div><div class="endpoint-desc">👷 Returns orders filtered by role: lyrics_team gets lyrics_in_progress, music_production gets music_production stage, etc.</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/staff/orders/:id</div><div class="endpoint-desc">👷 Full order detail for production</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/staff/orders/:id/lyrics</div><div class="endpoint-desc">👷 Submit lyrics. Body: lyrics (min 10 chars), music_prompt. Auto-advances status to music_production.</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/staff/orders/:id/music</div><div class="endpoint-desc">👷 Submit music file URLs. Body: audio_mp3, audio_wav, audio_instrumental, ai_music_prompt. Auto-advances to final_review.</div></div></div>
  <div class="endpoint"><span class="method PUT">PUT</span><div><div class="endpoint-path">/staff/orders/:id/status</div><div class="endpoint-desc">👷 Manually update status</div></div></div>

  <h2>QA  <span class="badge badge-cyan">/api/qa</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/qa/orders</div><div class="endpoint-desc">👷 QA team. All orders in final_review stage (oldest first)</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/qa/orders/:id</div><div class="endpoint-desc">👷 Full order detail for QA review</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/qa/orders/:id/approve</div><div class="endpoint-desc">👷 Approve order → delivered. Auto-creates Download records for all available files with 1-year expiry.</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/qa/orders/:id/rework</div><div class="endpoint-desc">👷 Send back to music_production. Body: reason (required), qa_notes</div></div></div>

  <h2>Downloads  <span class="badge badge-gray">/api/downloads</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/downloads</div><div class="endpoint-desc">🔒 Customer: their own files. Staff: all files.</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/downloads/:file_id</div><div class="endpoint-desc">🔒 Download file. Checks: expiry_date, is_active, download_count ≤ max_downloads. Returns file_url.</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/downloads/create</div><div class="endpoint-desc">👷 Admin: publish delivery files for an order. Body: order_id, files: [{file_type, file_url}]</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/downloads/order/:order_id</div><div class="endpoint-desc">👷 List all download records for an order</div></div></div>

  <h2>Support Tickets  <span class="badge badge-gray">/api/tickets</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/tickets</div><div class="endpoint-desc">👷 Staff: all tickets. Query: ?status=open|in_progress|resolved|closed</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/tickets/my</div><div class="endpoint-desc">🔒 Customer's own tickets</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/tickets</div><div class="endpoint-desc">🔒 Create ticket. Body: subject, message, order_code (optional)</div></div></div>
  <div class="endpoint"><span class="method PUT">PUT</span><div><div class="endpoint-path">/tickets/:id</div><div class="endpoint-desc">👷 Update status, assign staff</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/tickets/:id/reply</div><div class="endpoint-desc">👷 Staff reply to ticket. Auto-sets status to in_progress.</div></div></div>

  <h2>Analytics  <span class="badge badge-gray">/api/analytics</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/analytics/revenue</div><div class="endpoint-desc">🔑 Admin. total_revenue, period_revenue, monthly_breakdown, by_package. Query: ?period=30</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/analytics/orders</div><div class="endpoint-desc">🔑 Admin. by_status, by_language, by_music_style, by_mood, daily_last_30, conversion_rate</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/analytics/upsells</div><div class="endpoint-desc">🔑 Admin. Upsell popularity and count</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/analytics/staff</div><div class="endpoint-desc">🔑 Admin. Staff productivity: orders handled, delivered per staff member</div></div></div>

  <h2>Admin  <span class="badge badge-gray">/api/admin</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/admin/dashboard</div><div class="endpoint-desc">👷 KPI stats: total_orders, today_orders, today_revenue, total_revenue, open_tickets, upcoming_deadlines</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/admin/orders</div><div class="endpoint-desc">👷 Orders with filters: status, customer, music_style, language, deadline_before, deadline_after. Paginated.</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/admin/orders/export</div><div class="endpoint-desc">👷 Download CSV: order_code, customer, status, language, style, deadline</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/admin/orders/:id/timeline</div><div class="endpoint-desc">🔒 Order production timeline with completion indicators</div></div></div>
  <div class="endpoint"><span class="method PUT">PUT</span><div><div class="endpoint-path">/admin/orders/:id/status</div><div class="endpoint-desc">👷 Update order status directly</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/admin/orders/assign</div><div class="endpoint-desc">👷 Assign staff. Body: order_id, staff_id, role (lyrics|production|qa|general)</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/admin/customers</div><div class="endpoint-desc">👷 Paginated customer list. Query: ?search=</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/admin/customers/export</div><div class="endpoint-desc">👷 Download customers CSV</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/admin/customers/:id</div><div class="endpoint-desc">👷 Customer profile + all their orders</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/admin/payment-gateways</div><div class="endpoint-desc">🔑 Admin. List gateway configs (secrets hidden)</div></div></div>
  <div class="endpoint"><span class="method PUT">PUT</span><div><div class="endpoint-path">/admin/payment-gateways/:id</div><div class="endpoint-desc">🔑 Admin. Update gateway keys</div></div></div>

  <h2>Affiliates  <span class="badge badge-gray">/api/affiliates</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/affiliates</div><div class="endpoint-desc">👷 List all affiliates/coupons with usage stats</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/affiliates</div><div class="endpoint-desc">🔑 Admin. Create coupon. Body: name, coupon_code, coupon_type, discount_value, usage_limit, start/end dates</div></div></div>
  <div class="endpoint"><span class="method PUT">PUT</span><div><div class="endpoint-path">/affiliates/:id</div><div class="endpoint-desc">🔑 Admin. Update coupon</div></div></div>
  <div class="endpoint"><span class="method DELETE">DELETE</span><div><div class="endpoint-path">/affiliates/:id</div><div class="endpoint-desc">🔑 Admin. Delete coupon</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/affiliates/validate</div><div class="endpoint-desc">PUBLIC. Validate coupon code: returns coupon_type, discount_value. Checks expiry + usage limit.</div></div></div>

  <h2>Settings / Master Data  <span class="badge badge-gray">/api/settings</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/settings</div><div class="endpoint-desc">PUBLIC. Active settings. Query: ?type=music_style|language|mood|order_type|upsell</div></div></div>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/settings/all</div><div class="endpoint-desc">🔑 Admin. All settings including inactive</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/settings</div><div class="endpoint-desc">🔑 Admin. Add option: type, value, price (add-on cost), description</div></div></div>
  <div class="endpoint"><span class="method PUT">PUT</span><div><div class="endpoint-path">/settings/:id</div><div class="endpoint-desc">🔑 Admin. Update option (can disable via is_active: false)</div></div></div>
  <div class="endpoint"><span class="method DELETE">DELETE</span><div><div class="endpoint-path">/settings/:id</div><div class="endpoint-desc">🔑 Admin. Delete option</div></div></div>

  <h2>Notifications  <span class="badge badge-gray">/api/notifications</span></h2>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/notifications/email</div><div class="endpoint-desc">👷 Send email. Body: to, subject, body, html. Stub mode if SMTP not configured.</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/notifications/whatsapp</div><div class="endpoint-desc">👷 Send WhatsApp via Meta Business API. Body: phone, message.</div></div></div>
  <div class="endpoint"><span class="method POST">POST</span><div><div class="endpoint-path">/notifications/order-update</div><div class="endpoint-desc">👷 Auto-notify customer on status change via both email + WhatsApp.</div></div></div>

  <h2>System Logs  <span class="badge badge-gray">/api/logs</span></h2>
  <div class="endpoint"><span class="method GET">GET</span><div><div class="endpoint-path">/logs</div><div class="endpoint-desc">🔑 Admin. Query: ?action=, ?limit=. Returns last N activity logs.</div></div></div>

  <p style="margin-top:16px;font-size:9pt;color:#888">
    🔒 = Authenticated user &nbsp;|&nbsp; 👷 = Staff (operator or above) &nbsp;|&nbsp; 🔑 = Admin only &nbsp;|&nbsp; PUBLIC = No auth required
  </p>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 6 — PRODUCTION WORKFLOW                                 -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s6">
  <div class="section-header">
    <div class="section-num">6</div>
    <div><div class="section-title">Order Production Workflow</div><div class="section-subtitle">Full lifecycle from placement to delivery</div></div>
  </div>

  <div class="flow" style="flex-direction:column;align-items:flex-start;">
    <div style="display:flex;align-items:center;gap:10px;width:100%">
      <div class="flow-step" style="background:#EDE9FE;border-color:#7C3AED">1. received</div>
      <div class="flow-arrow">→</div>
      <span style="font-size:9pt;color:#555">Order placed by customer. Payment initiated.</span>
    </div>
    <div style="margin-left:20px;width:2px;height:12px;background:#ddd"></div>
    <div style="display:flex;align-items:center;gap:10px;width:100%">
      <div class="flow-step" style="background:#FEF3C7;border-color:#D97706">2. processing</div>
      <div class="flow-arrow">→</div>
      <span style="font-size:9pt;color:#555">Payment confirmed. Brief reviewed by operator. Lyrics team assigned.</span>
    </div>
    <div style="margin-left:20px;width:2px;height:12px;background:#ddd"></div>
    <div style="display:flex;align-items:center;gap:10px;width:100%">
      <div class="flow-step" style="background:#F3E8FF;border-color:#9333EA">3. lyrics_in_progress</div>
      <div class="flow-arrow">→</div>
      <span style="font-size:9pt;color:#555">Lyricist writes personalised lyrics. Submits via <code>/staff/orders/:id/lyrics</code>.</span>
    </div>
    <div style="margin-left:20px;width:2px;height:12px;background:#ddd"></div>
    <div style="display:flex;align-items:center;gap:10px;width:100%">
      <div class="flow-step" style="background:#FCE7F3;border-color:#DB2777">4. music_production</div>
      <div class="flow-arrow">→</div>
      <span style="font-size:9pt;color:#555">Composer creates music. Uploads MP3/WAV/instrumental via <code>/staff/orders/:id/music</code>.</span>
    </div>
    <div style="margin-left:20px;width:2px;height:12px;background:#ddd"></div>
    <div style="display:flex;align-items:center;gap:10px;width:100%">
      <div class="flow-step" style="background:#FEF2F2;border-color:#DC2626">5. final_review</div>
      <div class="flow-arrow">→</div>
      <span style="font-size:9pt;color:#555">QA team listens and verifies quality. Can approve or send back for rework.</span>
    </div>
    <div style="margin-left:20px;width:2px;height:12px;background:#ddd"></div>
    <div style="display:flex;align-items:center;gap:10px;width:100%">
      <div class="flow-step" style="background:#DCFCE7;border-color:#16A34A">6. delivered</div>
      <div class="flow-arrow">→</div>
      <span style="font-size:9pt;color:#555">QA approves → Download records created → Customer notified → Files appear in dashboard.</span>
    </div>
  </div>

  <div class="card card-orange" style="margin-top:20px">
    <h4>Rework Flow</h4>
    <p style="font-size:9pt;margin:0">If QA rejects: status reverts to <strong>music_production</strong>. The <code>rework_reason</code> field is set so the production team knows what to fix. The cycle repeats until QA approves.</p>
  </div>

  <h2>Staff Assignment</h2>
  <table>
    <tr><th>Role</th><th>Sees</th><th>Action</th></tr>
    <tr><td>lyrics_team</td><td>Orders in lyrics_in_progress stage</td><td>Submit lyrics via /staff/orders/:id/lyrics</td></tr>
    <tr><td>music_production</td><td>Orders in music_production stage</td><td>Submit music files via /staff/orders/:id/music</td></tr>
    <tr><td>qa_team</td><td>Orders in final_review stage</td><td>Approve or rework via /qa/orders/:id</td></tr>
    <tr><td>operator</td><td>All orders</td><td>Manage status, assign staff, handle support</td></tr>
    <tr><td>admin</td><td>Everything</td><td>Full control including settings, staff, payments</td></tr>
  </table>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 7 — PAYMENT INTEGRATION                                 -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s7">
  <div class="section-header">
    <div class="section-num">7</div>
    <div><div class="section-title">Payment Integration (Razorpay)</div><div class="section-subtitle">End-to-end payment flow</div></div>
  </div>

  <div class="flow">
    <div class="flow-step">Customer fills<br/>order form</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">POST /orders/checkout<br/>locks price</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">POST /payments/create<br/>Razorpay order</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">Razorpay<br/>Checkout UI</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">POST /payments/verify<br/>HMAC signature</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">Order → processing<br/>Production begins</div>
  </div>

  <h2>Configuration via Admin Panel</h2>
  <p>Razorpay credentials are stored in the <code>PaymentGateway</code> collection and managed through the admin panel (Settings → Payment Gateways tab). No code changes needed to switch between test and live mode.</p>

  <div class="card card-purple">
    <h4>HMAC Signature Verification</h4>
    <div class="code-block"><span class="comment">// Server-side signature verification</span>
<span class="const">const</span> expectedSig = crypto
  .createHmac(<span class="str">'sha256'</span>, keySecret)
  .update(<span class="str">\`\${razorpay_order_id}|\${razorpay_payment_id}\`</span>)
  .digest(<span class="str">'hex'</span>);

<span class="kw">if</span> (expectedSig !== razorpay_signature) {
  <span class="comment">// Payment tampered — reject</span>
}</div>
  </div>

  <h2>Webhook Events Handled</h2>
  <table>
    <tr><th>Event</th><th>Action</th></tr>
    <tr><td>payment.captured</td><td>Sets Payment status = 'paid', Order status = 'processing'</td></tr>
    <tr><td>payment.failed</td><td>Sets Payment status = 'failed', stores failure_reason</td></tr>
  </table>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 8 — FILE STORAGE                                        -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s8">
  <div class="section-header">
    <div class="section-num">8</div>
    <div><div class="section-title">File Storage & Downloads</div><div class="section-subtitle">Local storage now, S3/CDN ready</div></div>
  </div>

  <div class="grid-2">
    <div class="card card-purple">
      <h4>Current Setup (Local)</h4>
      <ul>
        <li>Profile photos → <code>/uploads/</code></li>
        <li>Order reference files → <code>/uploads/orders/</code></li>
        <li>Served at <code>http://localhost:5000/uploads/</code></li>
        <li>Multer handles multipart upload</li>
        <li>Max 20MB per file, image/audio/PDF/doc types</li>
      </ul>
    </div>
    <div class="card card-cyan">
      <h4>Production (S3/CDN)</h4>
      <ul>
        <li>Replace Multer disk storage with <code>multer-s3</code></li>
        <li>Delivery files stored on S3</li>
        <li>Serve via CloudFront CDN</li>
        <li>URL format: <code>https://cdn.yourdomain.com/orders/{id}/song.mp3</code></li>
        <li>Pre-signed URLs for private files</li>
      </ul>
    </div>
  </div>

  <h2>Download Protection</h2>
  <p>Every delivered file is registered in the <code>Download</code> collection. When a customer requests <code>GET /downloads/:file_id</code>, the system checks:</p>
  <table>
    <tr><th>Check</th><th>Fail Response</th></tr>
    <tr><td>Customer email matches file's customer_email</td><td>403 Access denied</td></tr>
    <tr><td>expires_at &lt; now (1-year default)</td><td>403 Download link has expired</td></tr>
    <tr><td>is_active = true</td><td>403 File is no longer available</td></tr>
    <tr><td>download_count &lt; max_downloads (default 50)</td><td>403 Maximum downloads reached</td></tr>
  </table>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 9 — NOTIFICATIONS                                       -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s9">
  <div class="section-header">
    <div class="section-num">9</div>
    <div><div class="section-title">Notifications (Email & WhatsApp)</div><div class="section-subtitle">SMTP + Meta Business API integration</div></div>
  </div>

  <div class="grid-2">
    <div class="card card-purple">
      <h4>Email (Nodemailer + SMTP)</h4>
      <p style="font-size:9pt">Configured via .env SMTP_* variables. Works with Gmail, SendGrid, AWS SES, or any SMTP provider. Falls back to console logging if not configured (dev mode).</p>
    </div>
    <div class="card card-green">
      <h4>WhatsApp (Meta Business API)</h4>
      <p style="font-size:9pt">Sends messages via Meta's Cloud API. Requires a verified Business Account and phone number. Falls back to console logging if not configured.</p>
    </div>
  </div>

  <h2>Auto Order Status Messages</h2>
  <table>
    <tr><th>Status Change</th><th>Customer Message</th></tr>
    <tr><td>processing</td><td>"Your song order ORD-XXX is now being processed by our team!"</td></tr>
    <tr><td>lyrics_in_progress</td><td>"Our lyricists are crafting beautiful lyrics for your song ORD-XXX!"</td></tr>
    <tr><td>music_production</td><td>"Our composers are creating the music for ORD-XXX. Almost there!"</td></tr>
    <tr><td>final_review</td><td>"Your song ORD-XXX is in final quality review!"</td></tr>
    <tr><td>delivered</td><td>"Your song ORD-XXX is ready! Log in to download it."</td></tr>
  </table>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 10 — FRONTEND PAGES                                     -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s10">
  <div class="section-header">
    <div class="section-num">10</div>
    <div><div class="section-title">Frontend Pages</div><div class="section-subtitle">All routes in App.tsx</div></div>
  </div>

  <table>
    <tr><th>Route</th><th>Component</th><th>Access</th><th>Description</th></tr>
    <tr><td>/</td><td>MarketingHome</td><td>Public</td><td>Main landing page with pricing, samples, testimonials</td></tr>
    <tr><td>/create-song</td><td>CreateSong</td><td>Public</td><td>High-conversion sales funnel (ad landing page)</td></tr>
    <tr><td>/order</td><td>OrderFlow</td><td>Public</td><td>Legacy order form (still active)</td></tr>
    <tr><td>/login</td><td>Login</td><td>Public</td><td>Customer login. Redirects to /dashboard after success.</td></tr>
    <tr><td>/signup</td><td>Signup</td><td>Public</td><td>Customer registration</td></tr>
    <tr><td>/dashboard</td><td>UserDashboard</td><td>🔒 Authenticated user</td><td>Orders, account settings, photo upload, support tickets</td></tr>
    <tr><td>/admin/login</td><td>AdminLogin</td><td>Public</td><td>Staff-only login. Blocks regular users.</td></tr>
    <tr><td>/admin</td><td>AdminDashboard</td><td>🔑 Staff roles</td><td>Full admin panel with 12 tabs (role-filtered)</td></tr>
    <tr><td>/samples</td><td>SamplesPage</td><td>Public</td><td>Audio sample songs with player</td></tr>
    <tr><td>/premium</td><td>PremiumLanding</td><td>Public</td><td>High-end music studio brand landing page</td></tr>
    <tr><td>/category</td><td>CategoryPage</td><td>Public</td><td>Browse by song category</td></tr>
  </table>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 11 — CREATE SONG PAGE                                   -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s11">
  <div class="section-header">
    <div class="section-num">11</div>
    <div><div class="section-title">Create Song Page — Sales Funnel</div><div class="section-subtitle">/create-song — Optimised for ad traffic conversion</div></div>
  </div>

  <h2>10-Section Funnel Structure</h2>
  <table>
    <tr><th>#</th><th>Section</th><th>Conversion Purpose</th></tr>
    <tr><td>1</td><td>Hero — Split layout with countdown timer</td><td>Immediate hook + urgency</td></tr>
    <tr><td>2</td><td>Social Proof — 10K+ songs, 3 testimonials</td><td>Trust building</td></tr>
    <tr><td>3</td><td>Song Type Cards — Personal / Business / Campaign</td><td>Package selection (auto-scrolls to form)</td></tr>
    <tr><td>4</td><td>Sample Songs — 4 audio player cards</td><td>Reduces quality hesitation</td></tr>
    <tr><td>5</td><td>6-Step Process — Story → Delivery</td><td>Removes process doubt</td></tr>
    <tr><td>6</td><td>Order Form — 3 sections + file upload</td><td>Core conversion action</td></tr>
    <tr><td>7</td><td>7 Add-on Options (upsells)</td><td>Revenue maximization</td></tr>
    <tr><td>8</td><td>Sticky Order Summary + Coupon + Checkout CTA</td><td>Reduce cart abandonment</td></tr>
    <tr><td>9</td><td>FAQ Accordion — 6 questions</td><td>Objection handling</td></tr>
    <tr><td>10</td><td>Final CTA — Gradient + Price reminder</td><td>Last-chance conversion</td></tr>
  </table>

  <h2>Conversion Optimization Features</h2>
  <div class="grid-2">
    <div class="card card-pink">
      <h4>Live Activity Toasts</h4>
      <p style="font-size:9pt">Auto-cycling notifications every 9 seconds: "Rahul from Mumbai just ordered a Birthday Song". Creates social proof + FOMO.</p>
    </div>
    <div class="card card-purple">
      <h4>Countdown Timer</h4>
      <p style="font-size:9pt">3-hour countdown in hero: "Next delivery slot closes in 02:47:31". Resets when it hits zero. Drives urgency.</p>
    </div>
    <div class="card card-green">
      <h4>Floating CTA Button</h4>
      <p style="font-size:9pt">Always-visible "🎵 Create Your Song" button at bottom center. Visible on desktop. Shows starting price.</p>
    </div>
    <div class="card card-cyan">
      <h4>WhatsApp Help Button</h4>
      <p style="font-size:9pt">Floating green WhatsApp button. Pre-filled message. Reduces abandonment from confused visitors.</p>
    </div>
  </div>

  <h2>Add-on Upsells (7 options)</h2>
  <table>
    <tr><th>Add-on</th><th>Price</th></tr>
    <tr><td>Female Singer</td><td>+₹799</td></tr>
    <tr><td>Fast Delivery</td><td>+₹999</td></tr>
    <tr><td>Extra Verse</td><td>+₹499</td></tr>
    <tr><td>Music Video Reel</td><td>+₹1,499</td></tr>
    <tr><td>Lyrics PDF</td><td>+₹199</td></tr>
    <tr><td>YouTube Publishing</td><td>+₹1,999</td></tr>
    <tr><td>Streaming Distribution</td><td>+₹2,999</td></tr>
  </table>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 12 — ADMIN DASHBOARD                                    -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s12">
  <div class="section-header">
    <div class="section-num">12</div>
    <div><div class="section-title">Admin Dashboard — 12 Tabs</div><div class="section-subtitle">Role-filtered tabs, all data from live MongoDB</div></div>
  </div>

  <table>
    <tr><th>Tab</th><th>Visible To</th><th>Features</th></tr>
    <tr>
      <td><strong>Dashboard</strong></td>
      <td>admin, operator</td>
      <td>6 KPI cards (orders, revenue, active, delivered, tickets, deadlines), status breakdown grid, upcoming deadlines table, recent orders list</td>
    </tr>
    <tr>
      <td><strong>Orders</strong></td>
      <td>admin, operator</td>
      <td>Search + status filter, CSV export, view full order detail panel, inline status update dropdown, edit mode with all production fields</td>
    </tr>
    <tr>
      <td><strong>Customers</strong></td>
      <td>admin, operator</td>
      <td>Paginated table, CSV export, joined date, order count, active/inactive status</td>
    </tr>
    <tr>
      <td><strong>Production</strong></td>
      <td>admin, operator, lyrics_team, music_production, qa_team</td>
      <td>Pipeline by stage, expand/collapse cards, lyrics editor, notes, move-to-next-stage button. Role filtered (lyrics team only sees lyrics stage)</td>
    </tr>
    <tr>
      <td><strong>Deliveries</strong></td>
      <td>admin, operator</td>
      <td>Orders in final_review/delivered, input fields for MP3/WAV/video/lyrics_pdf URLs, save note, mark as delivered</td>
    </tr>
    <tr>
      <td><strong>Staff</strong></td>
      <td>admin only</td>
      <td>Create any staff role, table with activate/deactivate/remove buttons</td>
    </tr>
    <tr>
      <td><strong>Support</strong></td>
      <td>admin, operator, support</td>
      <td>Ticket list with status filter, open ticket thread view, reply form, status update dropdown</td>
    </tr>
    <tr>
      <td><strong>Analytics</strong></td>
      <td>admin only</td>
      <td>Revenue metrics, progress-bar charts by status/language/music style, package revenue breakdown</td>
    </tr>
    <tr>
      <td><strong>Affiliates</strong></td>
      <td>admin only</td>
      <td>Create/edit/delete coupons, usage stats, enable/disable, percentage or fixed discount</td>
    </tr>
    <tr>
      <td><strong>Packages</strong></td>
      <td>admin only</td>
      <td>Add/edit/delete pricing packages with category, price, delivery hours, description</td>
    </tr>
    <tr>
      <td><strong>Settings</strong></td>
      <td>admin only</td>
      <td>CRUD for master dropdown data: music_style, language, mood, order_type, upsell. Type filter tabs.</td>
    </tr>
    <tr>
      <td><strong>System Logs</strong></td>
      <td>admin only</td>
      <td>Full audit trail: action type, user email+role, description, timestamp</td>
    </tr>
  </table>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 13 — USER DASHBOARD                                     -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s13">
  <div class="section-header">
    <div class="section-num">13</div>
    <div><div class="section-title">User Dashboard</div><div class="section-subtitle">/dashboard — Customer-facing order management</div></div>
  </div>

  <h2>Dashboard Tabs</h2>
  <div class="grid-3">
    <div class="card card-purple">
      <h4>My Orders</h4>
      <p style="font-size:9pt">Lists all orders fetched from <code>/orders/my</code>. Shows order code, package, status badge, date. Click to expand full order details.</p>
    </div>
    <div class="card card-cyan">
      <h4>Downloads</h4>
      <p style="font-size:9pt">Shows delivered song files. MP3, WAV, video reel, lyrics PDF. Download button calls <code>/downloads/:file_id</code> with expiry check.</p>
    </div>
    <div class="card card-green">
      <h4>Support</h4>
      <p style="font-size:9pt">View own tickets. Create new ticket. Track responses from support team in thread view.</p>
    </div>
    <div class="card card-orange">
      <h4>Account Settings</h4>
      <p style="font-size:9pt">Update name, phone, city. Upload profile photo (stored at /uploads/). Change password via <code>/auth/change-password</code>.</p>
    </div>
  </div>

  <h2>Order Status Display</h2>
  <p>Each order shows a visual timeline via <code>/orders/:id/timeline</code> with stage completion indicators. Customers can see exactly where their song is in production.</p>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 14 — ENVIRONMENT VARIABLES                              -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s14">
  <div class="section-header">
    <div class="section-num">14</div>
    <div><div class="section-title">Environment Variables</div><div class="section-subtitle">Configure in .env file at project root</div></div>
  </div>

  <div class="env-box">
<span class="env-comment"># ── Database ──────────────────────────────────────────────────────</span>
<span class="env-key">MONGODB_URI</span>=<span class="env-val">mongodb+srv://username:password@cluster.mongodb.net/songcraft</span>

<span class="env-comment"># ── Auth ──────────────────────────────────────────────────────────</span>
<span class="env-key">JWT_SECRET</span>=<span class="env-val">your-super-secret-jwt-key-min-32-chars</span>

<span class="env-comment"># ── Server ────────────────────────────────────────────────────────</span>
<span class="env-key">PORT</span>=<span class="env-val">5000</span>
<span class="env-key">NODE_ENV</span>=<span class="env-val">production</span>

<span class="env-comment"># ── Email (SMTP) ───────────────────────────────────────────────────</span>
<span class="env-key">SMTP_HOST</span>=<span class="env-val">smtp.gmail.com</span>
<span class="env-key">SMTP_PORT</span>=<span class="env-val">587</span>
<span class="env-key">SMTP_SECURE</span>=<span class="env-val">false</span>
<span class="env-key">SMTP_USER</span>=<span class="env-val">your@gmail.com</span>
<span class="env-key">SMTP_PASS</span>=<span class="env-val">your-app-password</span>
<span class="env-key">SMTP_FROM</span>=<span class="env-val">noreply@expressinmusic.com</span>

<span class="env-comment"># ── WhatsApp (Meta Business API) ──────────────────────────────────</span>
<span class="env-key">WHATSAPP_API_URL</span>=<span class="env-val">https://graph.facebook.com/v18.0</span>
<span class="env-key">WHATSAPP_API_TOKEN</span>=<span class="env-val">your_permanent_access_token</span>
<span class="env-key">WHATSAPP_PHONE_ID</span>=<span class="env-val">your_phone_number_id</span>

<span class="env-comment"># ── Razorpay Webhook ──────────────────────────────────────────────</span>
<span class="env-key">RAZORPAY_WEBHOOK_SECRET</span>=<span class="env-val">your_razorpay_webhook_secret</span>

<span class="env-comment"># ── Frontend (Vite) ───────────────────────────────────────────────</span>
<span class="env-key">VITE_API_URL</span>=<span class="env-val">https://api.expressinmusic.com/api</span>
  </div>

  <div class="card card-orange" style="margin-top:16px">
    <h4>Razorpay Keys Setup</h4>
    <p style="font-size:9pt;margin:0">Razorpay key_id and key_secret are stored in MongoDB via the Admin Panel → Packages → Payment Gateways. Go to <code>POST /payments/admin/gateways</code> with name=razorpay, key_id, key_secret to configure. No code changes needed.</p>
  </div>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 15 — RUNNING THE PROJECT                                -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s15">
  <div class="section-header">
    <div class="section-num">15</div>
    <div><div class="section-title">Running the Project</div><div class="section-subtitle">Local development and production setup</div></div>
  </div>

  <h2>Install & Start (Development)</h2>
  <div class="code-block"><span class="comment"># Install all dependencies</span>
npm install

<span class="comment"># Start backend server (port 5000)</span>
node server.js

<span class="comment"># Start frontend dev server (port 5173)</span>
npm run dev

<span class="comment"># Or use nodemon for auto-restart on changes</span>
npx nodemon server.js</div>

  <h2>Production Build</h2>
  <div class="code-block"><span class="comment"># Build frontend</span>
npm run build

<span class="comment"># Serve dist/ from Express (add to server.js)</span>
app.use(express.static(path.join(__dirname, 'dist')));
app.get(<span class="str">'*'</span>, (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

<span class="comment"># Run server in background</span>
nohup node server.js > /var/log/songcraft.log 2>&1 &

<span class="comment"># Or use PM2</span>
pm2 start server.js --name songcraft-api</div>

  <h2>Seed Master Data (Settings)</h2>
  <div class="code-block"><span class="comment"># After starting the server, add dropdown options via API</span>
curl -X POST http://localhost:5000/api/settings \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"music_style","value":"Bollywood","price":0}'

<span class="comment"># Or use the Settings tab in the admin panel UI</span></div>

  <h2>URL Summary</h2>
  <table>
    <tr><th>Service</th><th>Local URL</th><th>Production URL</th></tr>
    <tr><td>Frontend (customer)</td><td>http://localhost:5173</td><td>https://expressinmusic.com</td></tr>
    <tr><td>Backend API</td><td>http://localhost:5000/api</td><td>https://api.expressinmusic.com/api</td></tr>
    <tr><td>Admin Panel</td><td>http://localhost:5173/admin</td><td>https://expressinmusic.com/admin</td></tr>
    <tr><td>Admin Login</td><td>http://localhost:5173/admin/login</td><td>https://expressinmusic.com/admin/login</td></tr>
    <tr><td>Create Song (Ad Landing)</td><td>http://localhost:5173/create-song</td><td>https://expressinmusic.com/create-song</td></tr>
    <tr><td>API Health Check</td><td>http://localhost:5000/api/health</td><td>https://api.expressinmusic.com/api/health</td></tr>
  </table>
</div>


<!-- ══════════════════════════════════════════════════════════════ -->
<!-- SECTION 16 — SAMPLE TEST ACCOUNTS                              -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="section" id="s16">
  <div class="section-header">
    <div class="section-num">16</div>
    <div><div class="section-title">Sample Test Accounts</div><div class="section-subtitle">Pre-loaded accounts for testing all roles</div></div>
  </div>

  <h2>Customer Accounts (Login at /login)</h2>
  <table>
    <tr><th>Name</th><th>Email</th><th>Password</th><th>Orders</th></tr>
    <tr><td>Rajesh Kumar</td><td>rajesh.kumar@example.com</td><td>password</td><td>3 orders (Personal, Business, Campaign)</td></tr>
    <tr><td>Priya Sharma</td><td>priya.sharma@example.com</td><td>password</td><td>2 orders (Personal, Business)</td></tr>
  </table>

  <h2>Staff Accounts (Login at /admin/login)</h2>
  <table>
    <tr><th>Role</th><th>Email</th><th>Password</th><th>Access</th></tr>
    <tr><td>admin</td><td>admin@songcraft.com</td><td>admin123</td><td>All 12 tabs, full control</td></tr>
    <tr><td>operator</td><td>operator@songcraft.com</td><td>operator123</td><td>Dashboard, Orders, Customers, Production, Deliveries, Support</td></tr>
  </table>

  <div class="card card-orange" style="margin-top:20px">
    <h4>Important Security Note</h4>
    <p style="font-size:9pt;margin:0">Change all default passwords before deploying to production. The admin account should use a strong unique password stored in a password manager. Regular users cannot access the admin portal at /admin/login — they are redirected if they try.</p>
  </div>

  <div class="divider"></div>

  <div class="highlight-box" style="text-align:center;padding:28px;">
    <p style="font-size:14pt;font-weight:700;color:#1a1a2e;margin-bottom:8px;">ExpressinMusic Platform</p>
    <p style="color:#555;font-size:10pt">Built with Node.js + Express + MongoDB Atlas + React + TypeScript</p>
    <p style="color:#888;font-size:9pt;margin-top:12px">This document covers the complete backend API, database schema, frontend pages, admin system, payment integration, and deployment setup.</p>
    <div style="margin-top:16px;display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
      <span class="badge badge-purple">120+ API Endpoints</span>
      <span class="badge badge-pink">7 Staff Roles</span>
      <span class="badge badge-green">Razorpay Payments</span>
      <span class="badge badge-cyan">Email + WhatsApp</span>
      <span class="badge badge-orange">12-Tab Admin Panel</span>
      <span class="badge badge-gray">Sales Funnel Page</span>
    </div>
  </div>
</div>

</body>
</html>`;

// Write HTML to file
fs.writeFileSync(htmlPath, html);
console.log('HTML written to', htmlPath);

// Generate PDF with Puppeteer
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ],
  headless: true,
});

const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });

await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '15mm', right: '15mm', bottom: '20mm', left: '15mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: `
    <div style="width:100%;font-family:Arial,sans-serif;font-size:8pt;color:#aaa;text-align:center;padding:0 15mm;">
      ExpressinMusic Platform Documentation &nbsp;•&nbsp; Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>
  `,
});

await browser.close();
console.log('✅ PDF generated:', pdfPath);
