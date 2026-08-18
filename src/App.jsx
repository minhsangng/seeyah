import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Detail from './Detail'
import SkyEffect from './components/SkyEffect'
import { Search, PlayCircle } from 'lucide-react'
import axios from 'axios'
import './App.css'

function Home({ data, query, setQuery }) {
  const [search, setSearch] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  
  function handleSearch(e) {
    e.preventDefault()
    const trimmed = query.trim().replace(/\s+/g, '-')
    if (!trimmed) return
    fetchSearch(trimmed)
  }
  
  async function fetchSearch(keyword) {
    try {
      if (keyword !== '') {
        const res = await axios.get('https://ophim1.com/v1/api/tim-kiem?keyword=' + keyword)
        if (res.status === 200) {
          setSearch(res.data.data.items)
          setHasSearched(true)
        }
      }
    } catch (err) {
      console.error("Fetch search with error: ", err)
    }
  }
  
  function handleQueryChange(e) {
    const value = e.target.value
    setQuery(value)

    if (value.trim() === '') {
      setHasSearched(false)
      setSearch([])
      return
    }
  }
  
  return (
    <section className='relative w-screen min-h-screen bg-bottom bg-no-repeat bg-cover' style={{backgroundImage: 'url(./src/assets/background.png)'}}>
      <SkyEffect starCount={80} shootingStarChance={0.008} moonX={0.6} moonY={0.1} moonRadius={45} />
      
      <div className='grid grid-cols-2 grid-rows-1 gap-0 w-[90vw] mx-auto h-screen items-center'>
        <div className='w-3/4 h-5/6 rounded-2xl bg-white/15 border-3 border-white drop-shadow-3xl drop-shadow-white px-4 py-8 overflow-hidden flex flex-col'>
          <h1 className='text-5xl text-center'>Xem phim miễn phí</h1>
          <div className='mt-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-white'>
            <form onSubmit={handleSearch} className='flex items-center gap-0 focus-within:outline-2 focus-within:outline-amber-300/50 rounded-2xl'>
              <input type='search' name='search' id='search-bar' value={query} onChange={handleQueryChange} placeholder='Tìm tên phim, diễn viên,...' className='bg-white/25 w-full border-2 border-r-1 border-amber-200 placeholder:text-amber-100 outline-none px-4 py-1.5 text-white rounded-tl-2xl rounded-bl-2xl' />
              <button type='submit' className='bg-white px-4 py-1.5 rounded-tr-2xl rounded-br-2xl border-2 border-l-1 border-amber-200 text-amber-500'><Search /></button>
            </form>

            {hasSearched && (
              <div className='mt-2'>
                <p className='text-white'>Kết quả cho: {query}</p>
                <div className='mt-1 grid grid-cols-1 grid-rows-auto gap-2 min-h-0 overflow-y-scroll scrollbar-thin scrollbar-thumb-white'>
                  {search.length === 0 ? (
                    <p className='text-white/70 text-sm'>Không tìm thấy kết quả nào.</p>
                  ) : (
                    search.map(item => (
                      <div key={item._id}>
                        <div className='bg-white/60 rounded-md flex items-start justify-between gap-0 overflow-hidden border border-amber-300/50'>
                          <div className='pl-14 pr-4 pt-4 pb-2 relative w-full h-full'>
                            <div className='absolute inset-0 bg-black text-white font-black flex items-center justify-center w-12 h-12 rounded-br-4xl'>{item.tmdb.vote_average}</div>
                            <p className='line-clamp-1 mb-1'>{item.name}</p>
                            <div className='grid grid-cols-3 grid-rows-1 gap-4 justify-between'>
                              <div className='col-span-2 flex flex-wrap gap-1 text-xs text-center'>
                                {item.category.map(i => (
                                  <p key={i.slug} className='bg-white w-fit h-fit rounded-lg px-1 py-0.5'>{i.name}</p>
                                ))}
                              </div>
                              <button className='rounded-full w-fit h-fit bg-amber-200 hover:bg-amber-400 hover:scale-110 transition ease-linear'>
                                <Link to={`/phim/${item.slug}`} className='flex items-center justify-center'><PlayCircle size={34} /></Link>
                              </button>
                            </div>
                          </div>
                          <div className='bg-center bg-cover min-h-32 w-auto aspect-3/4' style={{backgroundImage: `url(https://img.ophimimg.com/uploads/movies/${item.thumb_url})`}}></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='w-3/4 h-5/6 rounded-2xl bg-white/15 border-3 border-white drop-shadow-3xl drop-shadow-white px-4 py-8 justify-self-end overflow-hidden flex flex-col'>
          <h1 className='text-3xl'>List phim thịnh hành</h1>
          <div className='mt-6 grid grid-cols-1 grid-rows-auto gap-2 min-h-0 overflow-y-scroll scrollbar-thin scrollbar-thumb-white'>
            {data.map(item => {
              return (
                <div key={item._id}>
                  <div className='bg-white/60 rounded-md flex items-start justify-between gap-0 overflow-hidden border border-amber-300/50'>
                    <div className='pl-14 pr-4 pt-4 pb-2 relative w-full h-full'>
                      <div className='absolute inset-0 bg-black text-white font-black flex items-center justify-center w-12 h-12 rounded-br-4xl'>{item.tmdb.vote_average}</div>
                      <p className='line-clamp-1 mb-1'>{item.name}</p>
                      <div className='grid grid-cols-3 grid-rows-1 gap-4 justify-between'>
                        <div className='col-span-2 flex flex-wrap gap-1 text-xs text-center'>{item.category.map(i => (<p key={i.slug} className='bg-white w-fit h-fit rounded-lg px-1 py-0.5'>{i.name}</p>))}</div>
                        <button className='rounded-full w-fit h-fit bg-amber-200 hover:bg-amber-400 hover:scale-110 transition ease-linear'><Link to={`/phim/${item.slug}`} className='flex items-center justify-center'><PlayCircle size={34} /></Link></button>
                      </div>
                    </div>
                    <div className='bg-center bg-cover min-h-32 w-auto aspect-3/4' style={{backgroundImage: `url(https://img.ophimimg.com/uploads/movies/${item.thumb_url})`}}></div>
                  </div>
                </div>
            )})}
          </div>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])
  
  async function fectchData() {
    try {
      const res = await axios.get('https://ophim1.com/v1/api/home');
      if (res.status === 200) {
        setData(res.data.data.items)
      }
    } catch (err) {
      console.error('Fetch faied with error: ', err)
    }
  }
  
  useEffect(()=> {
    fectchData();
  }, []);
  
  return (
    <BrowserRouter>
      <header></header>
      <main>
        <article>    
          <Routes>
            <Route path='/' element={<Home data={data} query={query} setQuery={setQuery} />} />
            <Route path='/phim/:slug' element={<Detail />} />
          </Routes>
        </article>
      </main>
      <footer></footer>
    </BrowserRouter>
  )
}

export default App
