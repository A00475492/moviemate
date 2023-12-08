import React, { useEffect, useState } from "react"
import "./Home.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";


const Home = () => {

    const [homePageMovies, setHomePageMovies] = useState([])

    useEffect(() => {
        fetch("https://api.themoviedb.org/3/movie/popular?api_key=2c5a7b346ce4abb75dd52100003294fe&language=en-US")
            .then(res => res.json())
            .then(data => setHomePageMovies(data.results))
    }, [])
    return (
        <div className="poster">
            <Carousel
                showThumbs={false}
                autoPlay={true}
                transitionTime={3}
                infiniteLoop={true}
                showStatus={false}
                axis={'horizontal'}
            >
                  {
                        homePageMovies.map(movie => (
                            <div>
                                <div className="posterImage">
                                    <img src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`}  alt="Description of the image" />
                                </div>
                                <div className="posterImage__overlay">
                                    <div className="posterImage__title">{movie ? movie.original_title: ""}</div>
                                    </div>
                            </div>
                        ))
                    }
            </Carousel>
        </div>
    )

}
export default Home;