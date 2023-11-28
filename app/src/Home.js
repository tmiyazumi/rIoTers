import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

//images
import trashcan from './images/trashcan.webp';
import tam from './images/tam.jpg';
import taise from './images/taise.jpg';
import tyler from './images/tyler.jpg';
import mauricio from './images/mauricio.jpg';
import blackfriday from './images/blackfriday.webp';

const Home = () => {
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate('/dashboard');
    }
    return (
        <div className="Home">
            <section className="main-tile">
                <h1 className="title welcome-text">Welcome Back, Rioters!</h1>
                <div class="line-ornament"></div>

                <div class="animation-container">
                    <div class="trash-can"><img src={trashcan}/></div>
                    <div class="circle circle-1"><img src={tam}/></div>
                    <div class="circle circle-2"><img src={tyler}/></div>
                    <div class="circle circle-3"><img src={taise}/></div>
                    <div class="circle circle-4"><img src={mauricio}/></div>
                </div>

                <div className="artifact-container">
                    <div className='sq'/>
                    <div className='refer'>
                        <p>Refer a friend and they get:</p>
                        <img className='blackfriday' src={blackfriday}/>
                    </div>
                    <div className="left-btn">
                        <button className='dash-btn' onClick={goToDashboard}>Dashboard</button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home;