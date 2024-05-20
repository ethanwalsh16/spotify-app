import { useEffect, useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const CLIENT_ID = "a6c8df8a0da04c07bd4ec158bd1c0c13"
  const REDIRECT_URI = "http://localhost:5173/callback"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [count, setCount] = useState(0)
  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState<Artist[]>([]);


  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token") ?? ""

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))?.split("=")[1] ?? ""

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }
    setToken(token)
  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }
  
  const searchArtists = async (e: any) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "artist"
        }
    })

    setArtists(data.artists.items)
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        {artist.images.length ? <img width={"50%"} src={artist.images[0].url} alt={artist.name} /> : <div>No Image</div>}
        {artist.name}
      </div>
    ));
  };

  return (
    <>
	  {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Loginto Spotify</a>
        : <button onClick={logout}>Logout</button>}
	  <form onSubmit={searchArtists}>
		<input type="text" onChange={e => setSearchKey(e.target.value)}/>
		<button type={"submit"}>Search</button>
	  </form>
	  {renderArtists()}
    </>
  )
}

export default App
