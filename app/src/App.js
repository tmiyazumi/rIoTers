import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Dashboard from './Dashboard';
import Home from './Home';
import Register from './Register';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/register' element={<Register/>}/>

            </Routes>
        </Router>
    )
}

export default App;