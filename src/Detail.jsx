import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Detail() {
    const { slug } = useParams()
    const [movie, setMovie] = useState([])

    async function fetchDetail() {
        try {
            const res = await axios.get(`https://ophim1.com/v1/api/phim/${slug}`)
            setMovie(res.data.data.item)
        } catch (err) {
            console.error(err)
        }
    }
    
    useEffect(() => {
        fetchDetail()
    }, [slug])

    if (!movie) return <p>Đang tải...</p>
    
    return (
        <div>
            <h1>{movie.name}</h1>
            
            <div>
                <video className='aspect-video' src={movie.trailer_url} controls autoPlay></video>
                <div className=''>
                    
                </div>
            </div>
        </div>
    )
}