import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate('/dashboard');
    }
    return (
        <div className="Home">
            <section className="main-tile">
            
            </section>



            <button onClick={goToDashboard}>Dashboard</button>
        </div>
    )
}

export default Home;