import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const TYPE_COLORS = { normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030", grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0", ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820", rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848", steel: "#B8B8D0", fairy: "#EE99AC" };

function App() {
  const [name, setName] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState("idle");
  const [favorites, setFavorites] = useState([]);
  const [favoritesStatus, setFavoritesStatus] = useState("loading");
  const [favoriteActionId, setFavoriteActionId] = useState(null);
  const [favoriteError, setFavoriteError] = useState("");
  const [view, setView] = useState("search");

  useEffect(() => { loadFavorites(); }, []);

  async function loadFavorites() {
    setFavoritesStatus("loading"); setFavoriteError("");
    try {
      const response = await fetch(`${API_URL}/favorites`);
      if (!response.ok) throw new Error();
      setFavorites(await response.json()); setFavoritesStatus("success");
    } catch { setFavoritesStatus("error"); setFavoriteError("Could not load favorites. Please try again."); }
  }

  async function handleSearch(event) {
    event.preventDefault(); if (!name.trim()) return;
    setStatus("loading"); setPokemon(null);
    try {
      const response = await fetch(`${API_URL}/pokemon/${name.toLowerCase().trim()}`);
      if (!response.ok) throw new Error();
      setPokemon(await response.json()); setStatus("success"); setView("search");
    } catch { setStatus("error"); }
  }

  const favoriteIds = useMemo(() => new Set(favorites.map((favorite) => favorite.pokemon_id)), [favorites]);
  const isCurrentFavorite = pokemon && favoriteIds.has(pokemon.id);

  async function toggleFavorite(target) {
    const isFavorite = favoriteIds.has(target.id);
    setFavoriteActionId(target.id); setFavoriteError("");
    try {
      const response = await fetch(isFavorite ? `${API_URL}/favorites/${target.id}` : `${API_URL}/favorites`, isFavorite ? { method: "DELETE" } : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pokemon_id: target.id, pokemon_name: target.name, pokemon_image: target.image }) });
      if (!response.ok) throw new Error();
      if (isFavorite) setFavorites((current) => current.filter((favorite) => favorite.pokemon_id !== target.id));
      else { const result = await response.json(); setFavorites((current) => current.some((favorite) => favorite.pokemon_id === target.id) ? current : [result.favorite, ...current]); }
    } catch { setFavoriteError("Could not update favorites. Please try again."); }
    finally { setFavoriteActionId(null); }
  }

  const typeColor = pokemon ? TYPE_COLORS[pokemon.type] || "#A8A878" : "#9EA791";
  return <div className="stage"><div className={`pokedex ${status === "loading" ? "is-scanning" : ""}`}>
    <div className="top-bar"><div className="lens-housing"><div className="lens"><div className="lens-shine" /></div></div><div className="indicator-lights"><span className="light light-yellow" /><span className="light light-green" /></div><h1 className="brand">Pokédex</h1></div>
    <div className="screen-bezel"><div className="screen" style={{ "--type-color": typeColor }}><div className="scanlines" />
      {status === "idle" && <div className="screen-msg"><p>NO DATA</p><p className="screen-msg-sub">Enter a name to begin scan</p></div>}
      {status === "loading" && <div className="screen-msg"><p className="blink">SCANNING...</p><p className="screen-msg-sub">searching for {name.toLowerCase()}</p></div>}
      {status === "error" && <div className="screen-msg"><p>NO SIGNAL</p><p className="screen-msg-sub">&quot;{name}&quot; not found in database</p></div>}
      {status === "success" && pokemon && <div className="entry"><div className="entry-header"><span className="entry-id">ENTRY #{pokemon.id}</span><span className="entry-type" style={{ background: typeColor }}>{pokemon.type}</span></div><img className="entry-sprite" src={pokemon.image} alt={pokemon.name} /><p className="entry-name">{pokemon.name}</p><div className="entry-stats"><div className="stat"><span className="stat-label">HEIGHT</span><span className="stat-value">{pokemon.height} m</span></div><div className="stat"><span className="stat-label">WEIGHT</span><span className="stat-value">{pokemon.weight} kg</span></div></div><button className={`favorite-button ${isCurrentFavorite ? "is-favorite" : ""}`} type="button" onClick={() => toggleFavorite(pokemon)} disabled={favoriteActionId === pokemon.id || favoritesStatus === "loading"}>{favoriteActionId === pokemon.id ? "Saving..." : isCurrentFavorite ? "♡ Remove from Favorites" : "♥ Add to Favorites"}</button></div>}
    </div></div>
    <form className="control-panel" onSubmit={handleSearch}><div className="dpad-decor" aria-hidden="true"><span /><span /><span /><span /></div><div className="search-group"><label className="search-label" htmlFor="pokemon-search">Enter Pokémon Name</label><div className="search-row"><input id="pokemon-search" type="text" placeholder="pikachu" value={name} onChange={(event) => setName(event.target.value)} autoComplete="off" /><button type="submit" disabled={status === "loading"}>{status === "loading" ? "..." : "Scan"}</button></div></div></form>
    <section className="favorites-panel" aria-label="My Favorites"><div className="favorites-heading"><h2>My Favorites</h2><button type="button" onClick={() => setView(view === "favorites" ? "search" : "favorites")}>{view === "favorites" ? "Back to Search" : `View (${favorites.length})`}</button></div>{view === "favorites" && <div className="favorites-content">{favoritesStatus === "loading" && <p>Loading favorites...</p>}{favoritesStatus === "error" && <div><p>{favoriteError}</p><button type="button" onClick={loadFavorites}>Try again</button></div>}{favoritesStatus === "success" && favorites.length === 0 && <p>No Pokémon added to favorites yet. Search for one to get started.</p>}{favoritesStatus === "success" && favorites.map((favorite) => <article className="favorite-card" key={favorite.id ?? favorite.pokemon_id}><img src={favorite.pokemon_image} alt={favorite.pokemon_name} /><div><strong>{favorite.pokemon_name}</strong><span>#{favorite.pokemon_id}</span><small>Added: {new Date(favorite.chosen_at).toLocaleString()}</small></div><button type="button" onClick={() => toggleFavorite({ id: favorite.pokemon_id })} disabled={favoriteActionId === favorite.pokemon_id}>{favoriteActionId === favorite.pokemon_id ? "Removing..." : "Remove"}</button></article>)}</div>}{favoriteError && view !== "favorites" && <p className="favorite-error">{favoriteError}</p>}</section>
    <div className="grill" aria-hidden="true"><span /><span /><span /><span /><span /></div>
  </div></div>;
}
export default App;
