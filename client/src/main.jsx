import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API = import.meta.env.VITE_API_URL ||"http://localhost:4000/api";
const categories = ["All categories", "Education", "Environment", "Skilled Work", "Community Support", "Health & Wellbeing", "Arts & Culture"];
const initialForm = { name: "", category: "Community Support", type: "Offer", location: "", description: "", contact: "" };

function App() {
  const [listings, setListings] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [type, setType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showListingForm, setShowListingForm] = useState(false);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(initialForm);
  const [volunteer, setVolunteer] = useState({ name: "", email: "", interest: "", location: "" });

  async function loadListings() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (category !== "All categories") params.set("category", category);
      if (type !== "All") params.set("type", type);
      const response = await fetch(`${API}/listings?${params.toString()}`);
      if (!response.ok) throw new Error("Could not load listings.");
      setListings(await response.json());
    } catch {
      setError("Could not connect to the API. Make sure both the frontend and backend are running with npm run dev.");
    } finally { setLoading(false); }
  }

  useEffect(() => { loadListings(); }, [query, category, type]);

  const stats = useMemo(() => ({
    offers: listings.filter((x) => x.type === "Offer").length,
    requests: listings.filter((x) => x.type === "Request").length
  }), [listings]);

  async function submitListing(e) {
    e.preventDefault(); setNotice("");
    try {
      const response = await fetch(`${API}/listings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not add listing.");
      setForm(initialForm); setShowListingForm(false); setNotice("Your listing has been added."); await loadListings();
    } catch (err) { setNotice(err.message || "Could not submit listing."); }
  }

  async function submitVolunteer(e) {
    e.preventDefault(); setNotice("");
    try {
      const response = await fetch(`${API}/volunteers`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(volunteer) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not register.");
      setVolunteer({ name: "", email: "", interest: "", location: "" }); setShowVolunteerForm(false); setNotice(data.message);
    } catch (err) { setNotice(err.message || "Could not submit registration."); }
  }

  return <div>
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Shramdaan Connect home"><span className="brand-mark">S</span><span>Shramdaan <b>Connect</b><small>COMMUNITY • SKILLS • IMPACT</small></span></a>
      <nav><a href="#discover">Discover</a><a href="#how">How it works</a><a href="#about">About</a></nav>
      <button className="button button-small" onClick={() => { setShowListingForm(true); setNotice(""); }}>+ Share a skill</button>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="eyebrow"><span className="dot"></span> A community that gives back</span>
          <h1>Your skills can<br /> <em>change a community.</em></h1>
          <p>Connect with people around you. Share what you know, find the help you need, and make a difference together.</p>
          <div className="hero-actions"><a className="button" href="#discover">Explore community <span>↗</span></a><button className="button button-outline" onClick={() => setShowVolunteerForm(true)}>Become a volunteer</button></div>
          <div className="hero-proof"><div className="avatar-stack"><span>🌱</span><span>🤝</span><span>💡</span></div><span><b>Small acts, lasting impact.</b><br /><small>Every contribution counts.</small></span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of people working together">
          <div className="sun"></div><div className="art-label label-one">SHARE SKILLS <span>↗</span></div>
          <div className="hill hill-back"></div><div className="hill hill-front"></div>
          <div className="person person-one"><div className="head"></div><div className="body"></div><div className="leg leg-a"></div><div className="leg leg-b"></div></div>
          <div className="person person-two"><div className="head"></div><div className="body"></div><div className="leg leg-a"></div><div className="leg leg-b"></div></div>
          <div className="plant plant-one">✦</div><div className="plant plant-two">✿</div>
          <div className="art-label label-two">GROW TOGETHER <span>♥</span></div>
          <div className="art-card"><span className="art-card-icon">✳</span><span><b>One community</b><small>Many ways to help</small></span></div>
        </div>
      </section>

      <section className="impact-strip" aria-label="Community listing counts">
        <div><span className="impact-icon">↗</span><span><b>{stats.offers}+</b><small>Skills shared in results</small></span></div>
        <div><span className="impact-icon peach">♡</span><span><b>{stats.requests}+</b><small>Community requests</small></span></div>
        <div><span className="impact-icon yellow">✳</span><span><b>One goal</b><small>Stronger communities</small></span></div>
        <div className="impact-note">“Alone we can do so little; together we can do so much.”</div>
      </section>

      <section className="discover section" id="discover">
        <div className="section-heading"><div><span className="eyebrow">THE COMMUNITY BOARD</span><h2>Good things happen <em>when we connect.</em></h2><p>Find a skill to learn, offer a helping hand, or ask your community for support.</p></div><button className="button" onClick={() => { setShowListingForm(true); setNotice(""); }}>＋ Add a listing</button></div>
        <div className="filters">
          <label className="searchbox"><span>⌕</span><input aria-label="Search listings" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skills, places, or keywords..." /></label>
          <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          <select aria-label="Filter by type" value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Offer</option><option>Request</option></select>
        </div>
        {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
        {error && <div className="error" role="alert">{error}</div>}
        {loading ? <div className="empty">Loading community listings…</div> : listings.length === 0 ? <div className="empty"><span>🌿</span><h3>No listings found just yet</h3><p>Try another search or add the first listing in this category.</p><button className="button" onClick={() => setShowListingForm(true)}>Add a listing</button></div> :
          <div className="listing-grid">{listings.map((item, index) => <article className="listing-card" key={item.id}>
            <div className={`card-symbol symbol-${index % 4}`}>{["✳", "⌂", "✿", "↗"][index % 4]}</div>
            <div className="card-tags"><span className={item.type === "Offer" ? "tag offer" : "tag request"}>{item.type === "Offer" ? "Offering help" : "Looking for help"}</span><span className="category-tag">{item.category}</span></div>
            <h3>{item.name}</h3><p>{item.description}</p>
            <div className="card-footer"><span>⌖ {item.location}</span><a href={`mailto:${encodeURIComponent(item.contact)}?subject=${encodeURIComponent("Shramdaan Connect: " + item.name)}`} aria-label={`Contact about ${item.name}`}>Connect <span>↗</span></a></div>
          </article>)}</div>}
        <p className="demo-note">Community board demo · Listings reset when the server restarts.</p>
      </section>

      <section className="how section" id="how"><div className="how-intro"><span className="eyebrow">SIMPLE. HUMAN. POWERFUL.</span><h2>Making a difference<br />starts with <em>one step.</em></h2><p>You don't need to do everything. Just bring what you can, and let's build something meaningful together.</p><button className="button" onClick={() => setShowVolunteerForm(true)}>Join the community <span>↗</span></button></div>
        <div className="steps"><div className="step"><span className="step-number">01</span><span className="step-icon">🧭</span><div><h3>Discover your community</h3><p>Explore the skills, resources, and requests around you.</p></div></div><div className="step"><span className="step-number">02</span><span className="step-icon">🤲</span><div><h3>Share what you can</h3><p>Offer your time, knowledge, tools, or a helping hand.</p></div></div><div className="step"><span className="step-number">03</span><span className="step-icon">🌱</span><div><h3>Grow together</h3><p>Build connections that help your whole community thrive.</p></div></div></div>
      </section>

      <section className="join-banner" id="about"><div className="join-spark">✳</div><div><span className="eyebrow">THERE'S A PLACE FOR YOU HERE</span><h2>Have a little to give?<br /><em>It can mean a lot.</em></h2><p>Every skill has value. Every helping hand matters.</p></div><button className="button button-light" onClick={() => setShowVolunteerForm(true)}>I'd like to help <span>↗</span></button></section>
    </main>
    <footer><a className="brand footer-brand" href="#home"><span className="brand-mark">S</span><span>Shramdaan <b>Connect</b><small>COMMUNITY • SKILLS • IMPACT</small></span></a><span>Built on the belief that we do better, together. <b>♥</b></span><a href="#home">Back to top ↑</a></footer>

    {showListingForm && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowListingForm(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="listing-title"><button className="modal-close" onClick={() => setShowListingForm(false)} aria-label="Close">×</button><span className="eyebrow">COMMUNITY BOARD</span><h2 id="listing-title">Share a skill or request</h2><p>Tell your community how you can help—or what support you need.</p><form onSubmit={submitListing} className="form-grid">
      <label>Listing title<input required maxLength="100" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g. Weekend maths tutoring" /></label>
      <label>Category<select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>{categories.slice(1).map((c) => <option key={c}>{c}</option>)}</select></label>
      <label>I'm...<select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}><option>Offer</option><option>Request</option></select></label>
      <label>Location<input required value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} placeholder="Town, district, state" /></label>
      <label className="full">Description<textarea required maxLength="600" rows="3" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="What would you like people to know?" /></label>
      <label className="full">Contact email<input required type="email" value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} placeholder="you@example.org" /></label>
      <button className="button full" type="submit">Publish listing ↗</button>
    </form></section></div>}

    {showVolunteerForm && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowVolunteerForm(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="volunteer-title"><button className="modal-close" onClick={() => setShowVolunteerForm(false)} aria-label="Close">×</button><span className="eyebrow">MAKE A DIFFERENCE</span><h2 id="volunteer-title">Join as a volunteer</h2><p>Share a few details to register your interest in helping locally.</p><form onSubmit={submitVolunteer} className="form-grid">
      <label className="full">Your name<input required value={volunteer.name} onChange={(e) => setVolunteer({...volunteer, name: e.target.value})} /></label>
      <label className="full">Email address<input required type="email" value={volunteer.email} onChange={(e) => setVolunteer({...volunteer, email: e.target.value})} /></label>
      <label className="full">How would you like to help?<input required value={volunteer.interest} onChange={(e) => setVolunteer({...volunteer, interest: e.target.value})} placeholder="e.g. teaching, gardening, translation" /></label>
      <label className="full">Your location<input required value={volunteer.location} onChange={(e) => setVolunteer({...volunteer, location: e.target.value})} placeholder="Town, district, state" /></label>
      <button className="button full" type="submit">Register interest ↗</button>
    </form><p className="privacy-note">Demo only: registrations are held temporarily in server memory.</p></section></div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
