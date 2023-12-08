// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import RegistrationForm from './Registration/RegistrationForm';
import LoginForm from './Login/LoginForm';
import Header from './component/header/Header';
import Home from './pages/home/Home';
import MovieHome from './MoviePage/moviehome';
import AddMovieForm from './AddMovie/AddMovieForm';
import PaymentForm from './Payment/PaymentForm';
import AddActor from './component/header/Actor/AddActor';
import DeleteActor from './component/header/Actor/DeleteActor';
import AddGenre from './component/header/Genre/AddGenre';
import DeleteGenre from './component/header/Genre/DeleteGenre';
import MovieDetails from './movieDetails/movieDetails';
import WatchList from './component/WatchList/WatchList';
import PaymentDashboard from './Payment/PaymentDashboard';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  // console.log(location.pathname,'location.pathnamelocation.pathname')
  // // const isHomePage = location.pathname === '/';
  // const renderHeader = <Header />;

  return (
    <div className="App">
      <Header pathVal={location.pathname} />
      <Routes>
      < Route index element={<Home />} />
        <Route path="/Register" element={<RegistrationForm />} />
        <Route path="/Login" element={<LoginForm />} />
        <Route path="/moviehome" element={<MovieHome />}/> 
        <Route path="/addMovie" element={<AddMovieForm />}/> 
        <Route path="/payment" element={<PaymentForm />}/> 
        <Route path="/addActor" element={<AddActor />}/> 
        <Route path="/deleteActor" element={<DeleteActor/>}/>
        <Route path="/addGenre" element={<AddGenre/>}/>
        <Route path="/deleteGenre" element={<DeleteGenre/>}/>
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="watchList" element={<WatchList />} />
        <Route path="paymentDashboard" element={<PaymentDashboard />} />

        


      </Routes>
    </div>
  );
}

export default App;
