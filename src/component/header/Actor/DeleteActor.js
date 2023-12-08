import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteActor.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const DeleteActor = () => {
  const navigate = useNavigate();

  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);

  useEffect(() => {
    // Fetch the list of actors when the component mounts
    fetch('https://moviemate.azurewebsites.net/api/Actor')
      .then(response => response.json())
      .then(data => setActors(data))
      .catch(error => console.error('Error fetching actors:', error));
  }, []);

  const handleActorSelection = (actorId) => {
    const actor = actors.find(actor => actor.id === actorId);
    setSelectedActor(actor);
  };
  const user = JSON.parse(localStorage.getItem('userData'));
  useEffect(() => {
    if (!user ) {
        Swal.fire({
        icon: 'error',
        title: 'Unauthorized Access',
        text: 'You need to log in to access this page.',
      });
      navigate("/login");
    }
    else if(user.userType!=="admin"){
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized Access',
          text: "You don't have necessary permission to access this page",
        });
        navigate("/moviehome");
    }
  }, [user, navigate]);

  const handleDelete = () => {
    if (!selectedActor) return;

    fetch(`https://moviemate.azurewebsites.net/api/Actor/${selectedActor.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          console.log('Actor deleted successfully');
          Swal.fire({
            icon: 'success',
            title: 'Actor deleted successfully!',
            text: 'You will be redirected to Movie Home.',
           
          });
          navigate('/moviehome');
        } else {
          console.error('Error deleting actor');
          Swal.fire({
            icon: 'error',
            title: 'Error deleting actor',
            text: 'An error occurred while adding the actor. You will be redirected to Movie Home.',
            
          });
          navigate('/moviehome');
        }
      })
      .catch(error => console.error('Error:', error));

    const updatedActors = actors.filter(actor => actor.id !== selectedActor.id);
    setActors(updatedActors);

    console.log('Actor deleted successfully');
    navigate('/movieHome'); // Navigate to /movieHome
  };

  return (
    <div className="delete-actor-container">
      <h1>Delete Actor</h1>
      <div className="actor-list-container">
        <label htmlFor="actorList">Select an Actor:</label>
        <select
          id="actorList"
          onChange={(e) => handleActorSelection(Number(e.target.value))}
        >
          <option value="">Select an actor</option>
          {actors.map(actor => (
            <option key={actor.id} value={actor.id}>{actor.name}</option>
          ))}
        </select>
      </div>
      {selectedActor && (
        <div className="selected-actor-container">
          <h2>{selectedActor.name}</h2>
          <p>Birth Date: {selectedActor.birthDate}</p>
          <p>Biography: {selectedActor.biography}</p>
          <img src={selectedActor.picture} alt={`${selectedActor.name} Picturactor`} />
          <button onClick={handleDelete}>Delete Actor</button>
        </div>
      )}
    </div>
  );
};

export default DeleteActor;
