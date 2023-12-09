import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router-dom';

const AddActor = () => {
  const navigate = useNavigate();
  const [actorData, setActorData] = useState({
    name: '',
    birthDate: '',
    biography: '',
    picture: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActorData({
      ...actorData,
      [name]: value,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://moviemate.azurewebsites.net/api/Actor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actorData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Actor added successfully:", responseData);
        Swal.fire({
          icon: 'success',
          title: 'Actor added successfully!',
          text: 'You will be redirected to Movie Home.',
         
        });
        navigate('/moviehome');
      } else {
        console.error("Adding actor failed:", response.statusText);
        Swal.fire({
          icon: 'error',
          title: 'Error adding actor',
          text: 'An error occurred while adding the actor. You will be redirected to Movie Home.',
          
        });
        navigate('/moviehome');
      }
    } catch (error) {
      console.error("Error during actor addition:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error adding actor',
        text: 'An error occurred while adding the actor. You will be redirected to Movie Home.',
        
      });
      navigate('/moviehome');
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{color:"white"}}>Add Actor</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={actorData.name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="birthDate">Birth Date:</label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={actorData.birthDate}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="biography">Biography:</label>
        <textarea
          id="biography"
          name="biography"
          value={actorData.biography}
          onChange={handleInputChange}
          required
        ></textarea>

        <label htmlFor="picture">Picture (URL):</label>
        <input
          type="url"
          id="picture"
          name="picture"
          value={actorData.picture}
          onChange={handleInputChange}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default AddActor;
