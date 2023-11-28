import {useState, useEffect} from 'react';

function App() {
  const [merchants, setMerchants] = useState(false);

  function getMerchant() {
    fetch('http://localhost:3001')
      .then(response => {
        return response.text();
      })
      .then(data => {
        setMerchants(data);
      });
  }

  function createMerchant() {
    let name = prompt('Enter log warning');
    let email = prompt('Enter log description');
    fetch('http://localhost:3001/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, email}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getMerchant();
      });
  }

  function deleteMerchant() {
    let id = prompt('Enter log id');
    fetch(`http://localhost:3001/log/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getMerchant();
      });
  }

  function updateMerchant() {
    let id = prompt('Enter log id');
    let name = prompt('Enter new log name');
    let email = prompt('Enter new log email');
    fetch(`http://localhost:3001/log/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, email}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getMerchant();
      });
  }

  useEffect(() => {
    getMerchant();
  }, []);
  return (
    <div>
      {merchants ? merchants : 'There is no log data available'}
      <br />
      <button onClick={createMerchant}>Add log</button>
      <br />
      <button onClick={deleteMerchant}>Delete log</button>
      <br />
      <button onClick={updateMerchant}>Update log</button>
    </div>
  );
}
export default App;