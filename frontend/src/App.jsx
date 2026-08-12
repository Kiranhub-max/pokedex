import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const TYPE_COLORS = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

function App() {
  const [name, setName] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error | success

  async function handleSearch(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setStatus("loading");
    setPokemon(null);

    try {
      const response = await fetch(`${API_URL}/pokemon/${name.toLowerCase().trim()}`);
      if (!response.ok) throw new Error("Not found");
      const data = await response.json();
      setPokemon(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  }

  const typeColor = pokemon ? TYPE_COLORS[pokemon.type] || "#A8A878" : "#9EA791";

  return (
    <div className="stage">
      <div className={`pokedex ${status === "loading" ? "is-scanning" : ""}`}>
        {/* Top bar: lens + indicator lights */}
        <div className="top-bar">
          <div className="lens-housing">
            <div className="lens">
              <div className="lens-shine" />
            </div>
          </div>
          <div className="indicator-lights">
            <span className="light light-yellow" />
            <span className="light light-green" />
          </div>
          <h1 className="brand">Pokédex</h1>
        </div>

        {/* Screen */}
        <div className="screen-bezel">
          <div className="screen" style={{ "--type-color": typeColor }}>
            <div className="scanlines" />

            {status === "idle" && (
              <div className="screen-msg">
                <p>NO DATA</p>
                <p className="screen-msg-sub">Enter a name to begin scan</p>
              </div>
            )}

            {status === "loading" && (
              <div className="screen-msg">
                <p className="blink">SCANNING...</p>
                <p className="screen-msg-sub">searching for {name.toLowerCase()}</p>
              </div>
            )}

            {status === "error" && (
              <div className="screen-msg">
                <p>NO SIGNAL</p>
                <p className="screen-msg-sub">"{name}" not found in database</p>
              </div>
            )}

            {status === "success" && pokemon && (
              <div className="entry">
                <div className="entry-header">
                  <span className="entry-id">ENTRY LOG</span>
                  <span className="entry-type" style={{ background: typeColor }}>
                    {pokemon.type}
                  </span>
                </div>
                <img className="entry-sprite" src={pokemon.image} alt={pokemon.name} />
                <p className="entry-name">{pokemon.name}</p>
                <div className="entry-stats">
                  <div className="stat">
                    <span className="stat-label">HEIGHT</span>
                    <span className="stat-value">{pokemon.height} m</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">WEIGHT</span>
                    <span className="stat-value">{pokemon.weight} kg</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Control panel */}
        <form className="control-panel" onSubmit={handleSearch}>
          <div className="dpad-decor" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="search-group">
            <label className="search-label" htmlFor="pokemon-search">
              Enter Pokémon Name
            </label>
            <div className="search-row">
              <input
                id="pokemon-search"
                type="text"
                placeholder="pikachu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "..." : "Scan"}
              </button>
            </div>
          </div>
        </form>

        {/* Speaker grill footer */}
        <div className="grill" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default App;
