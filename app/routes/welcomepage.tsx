import { useNavigate } from "react-router";

export default function Welcomepage() { 

  const navigate = useNavigate();

  const whiteButton = {
    padding: '12px 75px',
    border: '2px solid black', 
    backgroundColor: 'white',
    color: 'black',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  };

  const purpleButton = {
    padding: '12px 90px',
    border: '2px #AC83CA', 
    backgroundColor: '#AC83CA',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  }

  //bottom buttons
  const clearButton = {
    padding: '12px 75px',
    marginBottom: '60px',
    fontSize: '17px',
    fontWeight: 'bold'
  }

  return (
    
    <div
      style={{
        display: 'flex',
        flexDirection: 'column', 
        height: '100vh'
      }}
    >
      <div style = {{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
        }}
      >
        <h1 style = {{ fontSize: '40px', fontWeight: "bold", marginBottom: '24px'}}>Welcome to Paint Prompt!</h1>
        <p style = {{fontSize: '20px', fontWeight:"bold", marginBottom: '24px'}}>Inspiration starts with your mood</p>

        <div>

          <button style={{ ...whiteButton, marginRight: '10px' }} onClick = {() => navigate("/signup")}>Sign Up</button>
          <button style={purpleButton} onClick = {() => navigate("/login")}>Log In</button>

        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1px'
          }}
        >
          <button style={clearButton} onClick={() => navigate("/copyright")}>© 2023 Paint Prompt. All rights reserved</button>
          <button style={clearButton} onClick={() => navigate("/privacypolicy")}>Privacy Policy</button>
          <button style={clearButton} onClick={() => navigate("/termsandservice")}>Terms and Service</button>
      </div>

    </div>
    
  );
}